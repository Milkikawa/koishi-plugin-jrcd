# @cozmello/koishi-plugin-jrcd

一个适合 QQ 群娱乐的 Koishi「今日长度」插件，可以查看自己今天的长度，也可以和群友比一比。

## 安装

在 Koishi 插件市场搜索 `jrcd` 或包名 `@cozmello/koishi-plugin-jrcd`，安装并启用即可。

## 命令

- `jrcd`：查看自己今天的长度，别名 `今日长度`
- `bbcd @用户`：和指定用户比较，别名 `比比长度`

比较仅支持同一平台的用户。

## 玩法说明

- 结果根据平台和用户 ID 生成，同一个人当天的结果不会变化。
- 每天北京时间 0 点刷新。
- 长度范围为 `0`～`30` cm。
- 修改 `seed` 会重新改变大家的结果。

## 配置

| 配置项                    | 作用                              |
| ------------------------- | --------------------------------- |
| `seed`                    | 生成每日结果时使用的种子          |
| `longerLargeGapMessage`   | 自己长 `21` cm 及以上时的比较文案 |
| `longerMediumGapMessage`  | 自己长 `11`～`20` cm 时的比较文案 |
| `longerSmallGapMessage`   | 自己长 `1`～`10` cm 时的比较文案  |
| `shorterLargeGapMessage`  | 自己短 `21` cm 及以上时的比较文案 |
| `shorterMediumGapMessage` | 自己短 `11`～`20` cm 时的比较文案 |
| `shorterSmallGapMessage`  | 自己短 `1`～`10` cm 时的比较文案  |

## 致谢与授权

本项目由 `@yyyhf/koishi-plugin-jrcd@1.2.1` 重构而来，感谢原作者提供的灵感和代码。原插件采用 MIT 协议，本项目同样采用 [MIT 协议](./LICENSE)。

## 链接

- [GitHub 仓库](https://github.com/Milkikawa/koishi-plugin-jrcd)
- [更新日志](./CHANGELOG.md)
- [问题反馈](https://github.com/Milkikawa/koishi-plugin-jrcd/issues)
