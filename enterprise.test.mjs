// The enterprise build (workbuddy-enterprise) is an enterprise deployment's
// own host: its chats, sign-in and meters are the deployment's, its models
// are the standard gateway's (read by the account's X-Domain), and its
// credits are the enterprise meter's alone — no personal summary, no
// check-in. Measured 2026-11-03 against codechatturbo.copilot.qq.com
// (OPPO's).
import { afterEach, expect, test } from "bun:test"
import { WorkBuddyEnterpriseAuthPlugin, _internal } from "./index.mjs"

const real = globalThis.fetch
afterEach(() => (globalThis.fetch = real))

const site = _internal.SITES["workbuddy-enterprise"]
const later = () => Date.now() + 3600_000
const config = '{"code":0,"data":{"agents":[{"name":"cli","models":["m"]}],"models":[{"id":"m","name":"M"}]}}'

test("the model list is asked from the standard gateway, as the deployment's X-Domain", async () => {
  const got = []
  globalThis.fetch = async (url, init) => {
    got.push({ url: String(url), headers: new Headers(init?.headers) })
    return new Response(config)
  }
  await _internal.liveModels(site, { access: "a", uid: "u", enterpriseId: "codechatturbo" })
  expect(got[0].url).toStartWith("https://copilot.tencent.com/v3/config")
  expect(got[0].headers.get("X-Domain")).toBe("codechatturbo.copilot.qq.com")
  expect(got[0].headers.get("X-Enterprise-Id")).toBe("codechatturbo")
})

test("with no domain of its own, the X-Domain is the deployment", async () => {
  const got = []
  globalThis.fetch = async (url, init) => {
    got.push({ url: String(url), headers: new Headers(init?.headers) })
    return new Response(config)
  }
  await _internal.liveModels(site, { access: "a", uid: "u" })
  expect(got[0].headers.get("X-Domain")).toBe("codechatturbo.copilot.qq.com")
})

test("the credits are the enterprise meter's, and the summary is never asked", async () => {
  const asked = []
  globalThis.fetch = async (url) => {
    const u = new URL(String(url))
    asked.push(u.host + u.pathname)
    if (u.pathname === "/billing/meter/get-enterprise-user-usage")
      return new Response(
        JSON.stringify({
          code: 0,
          data: {
            credit: 2165.83,
            limitNum: 10000,
            cycleStartTime: "2026-10-13 00:00:00",
            cycleEndTime: "2026-11-12 23:59:59",
            cycleResetTime: "2026-11-13 00:00:00",
          },
        }),
      )
    return new Response(config)
  }
  const hooks = await WorkBuddyEnterpriseAuthPlugin({ client: {} })
  const out = await hooks.auth.usage(async () => ({ type: "oauth", access: "a", refresh: "r", expires: later(), uid: "u", enterpriseId: "codechatturbo" }))
  expect(out.error).toBeUndefined()
  expect(out.plan).toBe("Enterprise")
  expect(out.windows).toHaveLength(1)
  expect(out.windows[0].name).toBe("Credits")
  expect(out.windows[0].display).toBe("2165.83 / 10000")
  expect(out.windows[0].resetsAt).toBe(new Date("2026-11-13T00:00:00+08:00").toISOString())
  expect(asked).not.toContain("codechatturbo.copilot.qq.com/billing/meter/get-user-resource-summary")
  expect(asked).toContain("codechatturbo.copilot.qq.com/billing/meter/get-enterprise-user-usage")
})

test("the deployment has no check-in", async () => {
  const hooks = await WorkBuddyEnterpriseAuthPlugin({ client: {} })
  expect(hooks.auth.checkin).toBeUndefined()
})

test("a browser sign-in is the deployment's own page", async () => {
  const asked = []
  globalThis.fetch = async (url) => {
    const u = new URL(String(url))
    asked.push(u.host + u.pathname)
    const data =
      u.pathname.endsWith("/auth/state") ? { state: "s", authUrl: "https://codechatturbo.copilot.qq.com/login" }
      : u.pathname.endsWith("/auth/token") ? { accessToken: "a", refreshToken: "r", expiresIn: 3600, domain: "codechatturbo.copilot.qq.com" }
      : u.pathname.endsWith("/login/account") ? { uid: "u", nickname: "n", type: "exclusive", enterpriseId: "codechatturbo", enterpriseName: "OPPOVPC" }
      : u.pathname.endsWith("/accounts") ? { accounts: [{ uid: "u", type: "exclusive", enterpriseId: "codechatturbo", enterpriseName: "OPPOVPC", lastLogin: true }] }
      : {}
    return new Response(JSON.stringify({ code: 0, data }))
  }
  const flow = await _internal.browserSignIn(site)
  const result = await flow.callback()
  expect(result.type).toBe("success")
  expect(result.domain).toBe("codechatturbo.copilot.qq.com")
  expect(result.enterpriseId).toBe("codechatturbo")
  expect(asked[0]).toBe("codechatturbo.copilot.qq.com/v2/plugin/auth/state")
})

test("the desktop sign-in reads the deployment's own file", async () => {
  expect(site.authID).toBe("workbuddy-desktop-custom")
})