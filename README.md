# WorkBuddy Enterprise

一个 OpenCode/magpie 插件：登录企业专属部署的 WorkBuddy
（`https://codechatturbo.copilot.qq.com`），用它自己的域名收发对话、读取企业额度。

## 安装（用文件夹，不经 npm）

插件只有 4 个文件，没有运行时依赖，拷过去就能用：

- `index.mjs`
- `opencode.mjs`
- `opencode2.mjs`
- `package.json`

1. 把整个 `workbuddy-enterprise` 文件夹放到一个**不会随便移动**的位置，例如
   - Windows：`D:\plugins\workbuddy-enterprise`
   - macOS / Linux：`~/plugins/workbuddy-enterprise`
2. 打开 magpie → **Plugins（插件）→ 添加插件**，点 **Choose a folder** 选到这个文件夹；
   或者直接把它的绝对路径粘贴进输入框。
3. 列表里出现「WorkBuddy Enterprise」，然后去 **Providers** 用浏览器登录一次。

## 绝对路径怎么填

输入框里填的是**指向那个文件夹的完整路径**，不是 `index.mjs`，也不是压缩包：

| 系统 | 写法 |
|---|---|
| Windows | `D:\plugins\workbuddy-enterprise`（`D:/plugins/...` 也可以） |
| macOS / Linux | `/Users/you/plugins/workbuddy-enterprise` |

- 一定要写**从盘符 / 根目录开始的完整路径**，不要写 `./` 开头的相对路径。
- 文件夹搬走后，`~/.config/magpie/plugins.json` 里对应的 `spec` 要跟着改成新路径。
- 用 Choose a folder 选的话，路径是自动写好的，不用手抄。

## 更新

这个插件不走 magpie 的自动更新。更新时把新的 4 个文件覆盖到同一文件夹，
重启 magpie（或让它重载插件）即可。
