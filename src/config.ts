import { Schema } from "koishi";

export interface Config {
  seed: string;
  longerLargeGapMessage: string;
  longerMediumGapMessage: string;
  longerSmallGapMessage: string;
  shorterLargeGapMessage: string;
  shorterMediumGapMessage: string;
  shorterSmallGapMessage: string;
}

export const Config: Schema<Config> = Schema.object({
  seed: Schema.string()
    .default("SA9873ZASD87")
    .description(
      "用于生成每日固定结果的随机种子；修改后所有用户的结果都会变化。"
    ),
  longerLargeGapMessage: Schema.string()
    .role("textarea")
    .default("好猛,试试强制让他受孕吧！！！(((o(*°▽°*)o)))")
    .description("比对方长 21cm 及以上时追加的文案。"),
  longerMediumGapMessage: Schema.string()
    .role("textarea")
    .default("不错的成绩,努力一下或许可以让他受孕哦..(〃w〃)")
    .description("比对方长 11～20cm 时追加的文案。"),
  longerSmallGapMessage: Schema.string()
    .role("textarea")
    .default("还行,可以尝试一下(๑‾ ꇴ ‾๑)")
    .description("比对方长 1～10cm 时追加的文案。"),
  shorterLargeGapMessage: Schema.string()
    .role("textarea")
    .default("快逃!!!!!!!!(o(*°▽°*)o)")
    .description("比对方短 21cm 及以上时追加的文案。"),
  shorterMediumGapMessage: Schema.string()
    .role("textarea")
    .default("胆大就上!胆小火速撤离!!!罒ω罒")
    .description("比对方短 11～20cm 时追加的文案。"),
  shorterSmallGapMessage: Schema.string()
    .role("textarea")
    .default("差的不多,富贵险中求一下(*°ｰ°)v?")
    .description("比对方短 1～10cm 时追加的文案。"),
});
