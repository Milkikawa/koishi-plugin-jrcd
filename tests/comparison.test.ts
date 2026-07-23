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
