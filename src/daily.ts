import type { Config } from "./config";

export type DailyStyle = "male" | "female";

export interface DailyResult {
  dayKey: string;
  userKey: string;
  length: number;
  style: DailyStyle;
}

type SeedPurpose = "length" | "style";

const shanghaiDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function javaStringHash(source: string): number {
  let hash = 0;
  for (let index = 0; index < source.length; index++) {
    hash = (Math.imul(hash, 31) + source.charCodeAt(index)) | 0;
  }
  return hash;
}

export function randomInRange(seed: string, range: number): number {
  if (!Number.isSafeInteger(range) || range <= 0) {
    throw new RangeError("range 必须是正安全整数");
  }
  return Math.abs(javaStringHash(seed) % range);
}

export function getShanghaiDayKey(date = new Date()): string {
  if (!Number.isFinite(date.getTime())) {
    throw new RangeError("date 必须是有效日期");
  }

  const dateParts: Partial<Record<"year" | "month" | "day", string>> = {};
  for (const part of shanghaiDateFormatter.formatToParts(date)) {
    if (part.type === "year" || part.type === "month" || part.type === "day") {
      dateParts[part.type] = part.value;
    }
  }

  const { year, month, day } = dateParts;
  if (!year || !month || !day) {
    throw new Error("无法生成上海时区日期键");
  }
  return `${year}-${month}-${day}`;
}

function createSeedMaterial(
  seed: string,
  userKey: string,
  dayKey: string,
  purpose: SeedPurpose
): string {
  return JSON.stringify({ version: 1, seed, userKey, dayKey, purpose });
}

export function createDailyResult(
  seed: string,
  userKey: string,
  date = new Date()
): DailyResult {
  const dayKey = getShanghaiDayKey(date);
  const lengthSeed = createSeedMaterial(seed, userKey, dayKey, "length");
  const styleSeed = createSeedMaterial(seed, userKey, dayKey, "style");

  return {
    dayKey,
    userKey,
    length: randomInRange(lengthSeed, 31),
    style: randomInRange(styleSeed, 2) === 1 ? "male" : "female",
  };
}

export function formatDailyResult(
  result: DailyResult,
  config?: Partial<Config>
): string {
  const { length } = result;

  if (result.style === "male") {
    if (length > 25) {
      return (
        config?.maleLengthVeryLarge?.replaceAll("${length}", String(length)) ||
        `♂今天的牛~牛长度是${length}cm，我靠，让哥哥爽一爽吧！\n(((o(*°▽°*)o)))...`
      );
    }
    if (length > 20) {
      return (
        config?.maleLengthLarge?.replaceAll("${length}", String(length)) ||
        `♂今天的牛~牛长度是${length}cm，哦豁？听说你很勇哦？\n(✧◡✧)`
      );
    }
    if (length > 15) {
      return (
        config?.maleLengthMedium?.replaceAll("${length}", String(length)) ||
        `♂今天的牛~牛长度是${length}cm，小老弟不错啊，和哥哥一起玩会儿吗\n(〃∇〃)`
      );
    }
    if (length > 5) {
      return (
        config?.maleLengthSmall?.replaceAll("${length}", String(length)) ||
        `♂今天的牛~牛长度是${length}cm，还行，也不是不能接受\n(๑´ㅂ´๑)`
      );
    }
    if (length > 1) {
      return (
        config?.maleLengthVerySmall?.replaceAll("${length}", String(length)) ||
        `♂今天的牛~牛长度是${length}cm，啥啊？怎么这么小啊？\n(*°ｰ°)v`
      );
    }
    return (
      config?.maleLengthZero?.replaceAll("${length}", String(length)) ||
      "♂今天的牛~牛长度是....今天你是女的啊？，算了算了\n︿(￣︶￣)︿"
    );
  }

  if (length > 25) {
    return (
      config?.femaleLengthVeryLarge?.replaceAll("${length}", String(length)) ||
      `♀今天的牛~牛长度是${length}cm，嘶哈嘶哈\n(((o(*°▽°*)o)))...`
    );
  }
  if (length > 20) {
    return (
      config?.femaleLengthLarge?.replaceAll("${length}", String(length)) ||
      `♀今天的牛~牛长度是${length}cm，单是看到哥哥的长度就....\n(〃w〃)`
    );
  }
  if (length > 15) {
    return (
      config?.femaleLengthMedium?.replaceAll("${length}", String(length)) ||
      `♀今天的牛~牛长度是${length}cm，也许我们今晚能做很多很多事情呢\n(〃∇〃)`
    );
  }
  if (length > 5) {
    return (
      config?.femaleLengthSmall?.replaceAll("${length}", String(length)) ||
      `♀今天的牛~牛长度是${length}cm，可以让我一口吃掉吗\n罒ω罒`
    );
  }
  if (length > 1) {
    return (
      config?.femaleLengthVerySmall?.replaceAll("${length}", String(length)) ||
      `♀今天的牛~牛长度是${length}cm，什么嘛，原来是可爱的小豆丁呀\n(*°ｰ°)v`
    );
  }
  return (
    config?.femaleLengthZero?.replaceAll("${length}", String(length)) ||
    "♀今天的牛~牛长度是....今天你是女孩子，小姐姐的派派可以让我摸摸吗\n(๑‾ ꇴ ‾๑)"
  );
}
