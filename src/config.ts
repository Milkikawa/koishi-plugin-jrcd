import { Schema } from "koishi";

export interface Config {
  seed: string;
  longerLargeGapMessage: string;
  longerMediumGapMessage: string;
  longerSmallGapMessage: string;
  shorterLargeGapMessage: string;
  shorterMediumGapMessage: string;
  shorterSmallGapMessage: string;
  // 男性主体文案
  maleLengthVeryLarge: string;
  maleLengthLarge: string;
  maleLengthMedium: string;
  maleLengthSmall: string;
  maleLengthVerySmall: string;
  maleLengthZero: string;
  // 女性主体文案
  femaleLengthVeryLarge: string;
  femaleLengthLarge: string;
  femaleLengthMedium: string;
  femaleLengthSmall: string;
  femaleLengthVerySmall: string;
  femaleLengthZero: string;
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
  // 男性主体文案
  maleLengthVeryLarge: Schema.string()
    .role("textarea")
    .default(
      "♂今天的牛~牛长度是${length}cm，我靠，让哥哥爽一爽吧！\n(((o(*°▽°*)o)))..."
    )
    .description(
      "男性长度 > 25cm 时的主体文案（${length} 会被替换为实际长度）。"
    ),
  maleLengthLarge: Schema.string()
    .role("textarea")
    .default("♂今天的牛~牛长度是${length}cm，哦豁？听说你很勇哦？\n(✧◡✧)")
    .description("男性长度 > 20cm 时的主体文案。"),
  maleLengthMedium: Schema.string()
    .role("textarea")
    .default(
      "♂今天的牛~牛长度是${length}cm，小老弟不错啊，和哥哥一起玩会儿吗\n(〃∇〃)"
    )
    .description("男性长度 > 15cm 时的主体文案。"),
  maleLengthSmall: Schema.string()
    .role("textarea")
    .default("♂今天的牛~牛长度是${length}cm，还行，也不是不能接受\n(๑´ㅂ´๑)")
    .description("男性长度 > 5cm 时的主体文案。"),
  maleLengthVerySmall: Schema.string()
    .role("textarea")
    .default("♂今天的牛~牛长度是${length}cm，啥啊？怎么这么小啊？\n(*°ｰ°)v")
    .description("男性长度 > 1cm 时的主体文案。"),
  maleLengthZero: Schema.string()
    .role("textarea")
    .default("♂今天的牛~牛长度是....今天你是女的啊？，算了算了\n︿(￣︶￣)︿")
    .description("男性长度 ≤ 1cm 时的主体文案。"),
  // 女性主体文案
  femaleLengthVeryLarge: Schema.string()
    .role("textarea")
    .default("♀今天的牛~牛长度是${length}cm，嘶哈嘶哈\n(((o(*°▽°*)o)))...")
    .description(
      "女性长度 > 25cm 时的主体文案（${length} 会被替换为实际长度）。"
    ),
  femaleLengthLarge: Schema.string()
    .role("textarea")
    .default("♀今天的牛~牛长度是${length}cm，单是看到哥哥的长度就....\n(〃w〃)")
    .description("女性长度 > 20cm 时的主体文案。"),
  femaleLengthMedium: Schema.string()
    .role("textarea")
    .default(
      "♀今天的牛~牛长度是${length}cm，也许我们今晚能做很多很多事情呢\n(〃∇〃)"
    )
    .description("女性长度 > 15cm 时的主体文案。"),
  femaleLengthSmall: Schema.string()
    .role("textarea")
    .default("♀今天的牛~牛长度是${length}cm，可以让我一口吃掉吗\n罒ω罒")
    .description("女性长度 > 5cm 时的主体文案。"),
  femaleLengthVerySmall: Schema.string()
    .role("textarea")
    .default(
      "♀今天的牛~牛长度是${length}cm，什么嘛，原来是可爱的小豆丁呀\n(*°ｰ°)v"
    )
    .description("女性长度 > 1cm 时的主体文案。"),
  femaleLengthZero: Schema.string()
    .role("textarea")
    .default(
      "♀今天的牛~牛长度是....今天你是女孩子，小姐姐的派派可以让我摸摸吗\n(๑‾ ꇴ ‾๑)"
    )
    .description("女性长度 ≤ 1cm 时的主体文案。"),
});
