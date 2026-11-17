# WorkBuddy Enterprise

OpenCode / magpie provider 插件：登录企业专属部署的 WorkBuddy
（`https://codechatturbo.copilot.qq.com`），用它自己的域名收发对话、读取企业额度。

## 安装

```sh
magpie plugin add github:hijoywell/workbuddy-enterprise
```

或在 magpie：**Plugins → Add a plugin**，粘贴 GitHub 地址 `github:hijoywell/workbuddy-enterprise`。
也可把仓库下载到本地任意目录，用 `magpie plugin add /path/to/workbuddy-enterprise` 添加该文件夹。

装完在 **Plugins** 里出现 **WorkBuddy Enterprise**。

## 登录（关键）

装好插件**不等于登录**。登录入口不在插件页，在 Providers：

- **图形界面**：**Providers → ＋ Add provider**，找到 **WorkBuddy Enterprise** 的卡片，点它 → 选登录方式 → 完成。
- **命令行**：`magpie plugin login workbuddy-enterprise`

三种登录方式，任选其一：

| 方式 | 说明 |
|---|---|
| WorkBuddy Enterprise account (browser) | 浏览器打开企业自己的登录页（推荐） |
| WorkBuddy Enterprise desktop's sign-in | 复用桌面客户端已登录的账号；桌面端 5.6+ 加密了 token，读不到时会提示改用浏览器 |
| WorkBuddy Enterprise API key | 在企业部署的 profile 页面生成 key |

登录成功后，`magpie plugin` 会显示 `workbuddy-enterprise … signed in`。

## 使用

登录后在任意 agent 的模型选择器里选 `workbuddy-enterprise/…` 开头的模型即可。

## 更新

```sh
magpie plugin update workbuddy-enterprise
```

或在 **Plugins** 里点该插件的 **Update**。
