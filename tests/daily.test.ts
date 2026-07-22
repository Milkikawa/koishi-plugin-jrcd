import assert from "node:assert/strict";
import test from "node:test";

import {
  createDailyResult,
  getShanghaiDayKey,
  javaStringHash,
  randomInRange,
} from "../src/daily";

test("javaStringHash 按 Java UTF-16 语义覆盖空串、中文和 emoji", () => {
  const vectors = [
    ["", 0],
    ["a", 97],
    ["abc", 96354],
    ["hello", 99162322],
    ["Koishi", -2042028241],
    ["中文", 646394],
    ["牛~牛", 28166456],
    ["😀", 1772899],
    ["The quick brown fox jumps over the lazy dog", -609428141],
  ] as const;

  for (const [source, expected] of vectors) {
    assert.equal(javaStringHash(source), expected, source);
  }
});

test("randomInRange 拒绝非法 range 并给出精确错误", () => {
  for (const range of [
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    assert.throws(
      () => randomInRange("seed", range),
      (error) =>
        error instanceof RangeError &&
        error.message === "range 必须是正安全整数"
    );
  }
});

test("上海日期在 UTC 15:59:59 与 16:00:00 之间跨日，并拒绝 Invalid Date", () => {
  assert.equal(
    getShanghaiDayKey(new Date("2026-07-22T15:59:59.000Z")),
    "2026-07-22"
  );
  assert.equal(
    getShanghaiDayKey(new Date("2026-07-22T16:00:00.000Z")),
    "2026-07-23"
  );
  assert.throws(
    () => getShanghaiDayKey(new Date(Number.NaN)),
    (error) =>
      error instanceof RangeError && error.message === "date 必须是有效日期"
  );
});

test("createDailyResult 对相同输入稳定", () => {
  const date = new Date("2026-07-22T08:00:00.000Z");
  const first = createDailyResult("fixed-seed", "mock:user", date);
  const second = createDailyResult("fixed-seed", "mock:user", date);

  assert.deepEqual(first, second);
});

test("createDailyResult 按 platform:userId 和上海日期隔离结果", () => {
  const date = new Date("2026-07-22T08:00:00.000Z");
  const nextDay = new Date("2026-07-23T08:00:00.000Z");
  const first = createDailyResult("fixed-seed", "mock:user", date);
  const otherIdentity = createDailyResult("fixed-seed", "other:user", date);
  const otherDay = createDailyResult("fixed-seed", "mock:user", nextDay);

  assert.equal(first.userKey, "mock:user");
  assert.equal(otherIdentity.userKey, "other:user");
  assert.equal(first.dayKey, "2026-07-22");
  assert.equal(otherDay.dayKey, "2026-07-23");
  assert.notDeepEqual(first, otherIdentity);
  assert.notDeepEqual(first, otherDay);
});

test("循环样例生成的 length 始终处于 0..30", () => {
  const date = new Date("2026-07-22T08:00:00.000Z");

  for (let index = 0; index < 1000; index++) {
    const result = createDailyResult("fixed-seed", `mock:user-${index}`, date);
    assert.ok(Number.isInteger(result.length));
    assert.ok(result.length >= 0 && result.length <= 30, String(result.length));
  }
});
