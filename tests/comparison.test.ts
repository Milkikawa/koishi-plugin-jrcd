import assert from "node:assert/strict";
import test from "node:test";

import type { Config } from "../src/config";
import {
  compareDailyResults,
  selectComparisonMessage,
  type ComparisonResult,
} from "../src/comparison";
import type { DailyResult } from "../src/daily";

const config: Config = {
  seed: "test-seed",
  longerLargeGapMessage: "longer-large",
  longerMediumGapMessage: "longer-medium",
  longerSmallGapMessage: "longer-small",
  shorterLargeGapMessage: "shorter-large",
  shorterMediumGapMessage: "shorter-medium",
  shorterSmallGapMessage: "shorter-small",
  maleLengthVeryLarge:
    "♂今天的牛~牛长度是${length}cm，我靠，让哥哥爽一爽吧！\n(((o(*°▽°*)o)))...",
  maleLengthLarge: "♂今天的牛~牛长度是${length}cm，哦豁？听说你很勇哦？\n(✧◡✧)",
  maleLengthMedium:
    "♂今天的牛~牛长度是${length}cm，小老弟不错啊，和哥哥一起玩会儿吗\n(〃∇〃)",
  maleLengthSmall:
    "♂今天的牛~牛长度是${length}cm，还行，也不是不能接受\n(๑´ㅂ´๑)",
  maleLengthVerySmall:
    "♂今天的牛~牛长度是${length}cm，啥啊？怎么这么小啊？\n(*°ｰ°)v",
  maleLengthZero:
    "♂今天的牛~牛长度是....今天你是女的啊？，算了算了\n︿(￣︶￣)︿",
  femaleLengthVeryLarge:
    "♀今天的牛~牛长度是${length}cm，嘶哈嘶哈\n(((o(*°▽°*)o)))...",
  femaleLengthLarge:
    "♀今天的牛~牛长度是${length}cm，单是看到哥哥的长度就....\n(〃w〃)",
  femaleLengthMedium:
    "♀今天的牛~牛长度是${length}cm，也许我们今晚能做很多很多事情呢\n(〃∇〃)",
  femaleLengthSmall: "♀今天的牛~牛长度是${length}cm，可以让我一口吃掉吗\n罒ω罒",
  femaleLengthVerySmall:
    "♀今天的牛~牛长度是${length}cm，什么嘛，原来是可爱的小豆丁呀\n(*°ｰ°)v",
  femaleLengthZero:
    "♀今天的牛~牛长度是....今天你是女孩子，小姐姐的派派可以让我摸摸吗\n(๑‾ ꇴ ‾๑)",
};

function daily(length: number): DailyResult {
  return {
    dayKey: "2026-07-22",
    userKey: "mock:user",
    length,
    style: "male",
  };
}

test("比较边界 0、1、10、11、20、21 及正负方向", () => {
  const cases = [
    [15, 15, { relation: "equal", difference: 0, tier: "equal" }],
    [1, 0, { relation: "longer", difference: 1, tier: "small" }],
    [10, 0, { relation: "longer", difference: 10, tier: "small" }],
    [11, 0, { relation: "longer", difference: 11, tier: "medium" }],
    [20, 0, { relation: "longer", difference: 20, tier: "medium" }],
    [21, 0, { relation: "longer", difference: 21, tier: "large" }],
    [0, 1, { relation: "shorter", difference: 1, tier: "small" }],
    [0, 10, { relation: "shorter", difference: 10, tier: "small" }],
    [0, 11, { relation: "shorter", difference: 11, tier: "medium" }],
    [0, 20, { relation: "shorter", difference: 20, tier: "medium" }],
    [0, 21, { relation: "shorter", difference: 21, tier: "large" }],
  ] as const;

  for (const [currentLength, targetLength, expected] of cases) {
    assert.deepEqual(
      compareDailyResults(daily(currentLength), daily(targetLength)),
      expected,
      `${currentLength} - ${targetLength}`
    );
  }
});

test("六个 Config 文案字段按长短和差距语义映射", () => {
  const cases: Array<[ComparisonResult, string]> = [
    [{ relation: "longer", difference: 21, tier: "large" }, "longer-large"],
    [{ relation: "longer", difference: 11, tier: "medium" }, "longer-medium"],
    [{ relation: "longer", difference: 1, tier: "small" }, "longer-small"],
    [{ relation: "shorter", difference: 21, tier: "large" }, "shorter-large"],
    [{ relation: "shorter", difference: 11, tier: "medium" }, "shorter-medium"],
    [{ relation: "shorter", difference: 1, tier: "small" }, "shorter-small"],
  ];

  for (const [comparison, expected] of cases) {
    assert.equal(selectComparisonMessage(comparison, config), expected);
  }

  assert.equal(
    selectComparisonMessage(
      { relation: "shorter", difference: 11, tier: "medium" },
      config
    ),
    config.shorterMediumGapMessage
  );
});

test("相等时使用固定文案而不读取六个差距字段", () => {
  assert.equal(
    selectComparisonMessage(
      { relation: "equal", difference: 0, tier: "equal" },
      config
    ),
    "试试刺刀看看谁能赢吧！"
  );
});
