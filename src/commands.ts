import { Context, Fragment, h } from "koishi";
import type { Config } from "./config";
import {
  compareDailyResults,
  selectComparisonMessage,
  type ComparisonResult,
} from "./comparison";
import { createDailyResult, formatDailyResult } from "./daily";

export interface UserIdentity {
  platform: string;
  userId: string;
  userKey: string;
}

function createUserIdentity(platform: string, userId: string): UserIdentity {
  return {
    platform,
    userId,
    userKey: `${platform}:${userId}`,
  };
}

export function parseUserArgument(target: unknown): UserIdentity | undefined {
  if (typeof target !== "string") return;

  const separatorIndex = target.indexOf(":");
  if (separatorIndex <= 0 || separatorIndex === target.length - 1) return;

  const platform = target.slice(0, separatorIndex);
  const userId = target.slice(separatorIndex + 1);
  return createUserIdentity(platform, userId);
}

function formatComparisonReply(
  current: UserIdentity,
  target: UserIdentity,
  comparison: ComparisonResult,
  config: Config
): Fragment {
  const message = selectComparisonMessage(comparison, config);

  if (comparison.relation === "equal") {
    return [
      h.at(current.userId),
      "你的长度和",
      h.at(target.userId),
      `一样长。${message}`,
    ];
  }

  const relationText = comparison.relation === "longer" ? "长" : "短";
  return [
    h.at(current.userId),
    "你的牛~牛长度比",
    h.at(target.userId),
    `${relationText}${comparison.difference}cm。${message}`,
  ];
}

export function registerCommands(ctx: Context, config: Config): void {
  ctx
    .command("jrcd", "查看今天的牛牛长度")
    .alias("今日长度")
    .action(({ session }) => {
      if (!session) return "无法获取当前会话信息。";
      if (!session.platform) return "无法获取当前平台信息。";
      if (!session.userId) return "无法获取你的用户信息。";

      const current = createUserIdentity(session.platform, session.userId);
      const result = createDailyResult(config.seed, current.userKey);
      return [h.at(current.userId), formatDailyResult(result)];
    });

  ctx
    .command("bbcd <target:user>", "比较今天的牛牛长度")
    .alias("比比长度")
    .action(({ session }, target) => {
      if (!session) return "无法获取当前会话信息。";
      if (!session.platform) return "无法获取当前平台信息。";
      if (!session.userId) return "无法获取你的用户信息。";
      if (!target) return "请指定要比较的用户。";

      const parsedTarget = parseUserArgument(target);
      if (!parsedTarget) return "无法识别目标用户。";
      if (parsedTarget.platform !== session.platform) {
        return "暂不支持跨平台比较。";
      }

      const current = createUserIdentity(session.platform, session.userId);
      const now = new Date();
      const currentResult = createDailyResult(
        config.seed,
        current.userKey,
        now
      );
      const targetResult = createDailyResult(
        config.seed,
        parsedTarget.userKey,
        now
      );
      const comparison = compareDailyResults(currentResult, targetResult);
      return formatComparisonReply(current, parsedTarget, comparison, config);
    });
}
