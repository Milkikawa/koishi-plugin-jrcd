import assert from "node:assert/strict";
import test from "node:test";

import type { Config } from "../src/config";
import { parseUserArgument, registerCommands } from "../src/commands";

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

type Action = (argv: { session?: FakeSession }, target?: unknown) => unknown;

interface FakeSession {
  platform?: string;
  userId?: string;
}

interface CapturedCommand {
  declaration: string;
  description: string;
  aliases: string[];
  action?: Action;
}

class FakeCommand {
  constructor(private readonly captured: CapturedCommand) {}

  alias(name: string): this {
    this.captured.aliases.push(name);
    return this;
  }

  action(callback: Action): this {
    this.captured.action = callback;
    return this;
  }
}

class FakeContext {
  readonly commands: CapturedCommand[] = [];
  middlewareCalls = 0;

  command(declaration: string, description: string): FakeCommand {
    const captured = { declaration, description, aliases: [] };
    this.commands.push(captured);
    return new FakeCommand(captured);
  }

  middleware(): void {
    this.middlewareCalls++;
  }
}

function createRegisteredContext(): FakeContext {
  const context = new FakeContext();
  registerCommands(context as never, config);
  return context;
}

test("parseUserArgument 支持普通和含额外冒号的用户标识", () => {
  assert.deepEqual(parseUserArgument("mock:user-name"), {
    platform: "mock",
    userId: "user-name",
    userKey: "mock:user-name",
  });
  assert.deepEqual(parseUserArgument("mock:tenant:user"), {
    platform: "mock",
    userId: "tenant:user",
    userKey: "mock:tenant:user",
  });
});

test("parseUserArgument 拒绝空值、无冒号及冒号两侧为空", () => {
  for (const target of [undefined, null, "", "mock", ":user", "mock:"]) {
    assert.equal(parseUserArgument(target), undefined);
  }
});

test("registerCommands 只注册 jrcd、bbcd 及其别名，且不调用 middleware", () => {
  const context = createRegisteredContext();

  assert.deepEqual(
    context.commands.map(({ declaration, aliases }) => ({
      declaration,
      aliases,
    })),
    [
      { declaration: "jrcd", aliases: ["今日长度"] },
      { declaration: "bbcd <target:user>", aliases: ["比比长度"] },
    ]
  );
  assert.equal(context.middlewareCalls, 0);
  assert.ok(
    context.commands.every((command) => typeof command.action === "function")
  );
});

test("bbcd action 返回缺目标和跨平台提示", () => {
  const context = createRegisteredContext();
  const action = context.commands[1]?.action;
  assert.ok(action);

  const session = { platform: "mock", userId: "current" };
  assert.equal(action({ session }), "请指定要比较的用户。");
  assert.equal(action({ session }, "other:target"), "暂不支持跨平台比较。");
});

test("bbcd action 对同平台非数字目标返回 Fragment", () => {
  const context = createRegisteredContext();
  const action = context.commands[1]?.action;
  assert.ok(action);

  const result = action(
    { session: { platform: "mock", userId: "current-user" } },
    "mock:target-name"
  );

  assert.ok(Array.isArray(result));
  assert.ok(result.length > 0);
  assert.notEqual(typeof result, "string");
});

test("导入和执行命令不会污染 String.prototype", () => {
  assert.equal(Object.hasOwn(String.prototype, "hashCode"), false);
  createRegisteredContext();
  assert.equal(Object.hasOwn(String.prototype, "hashCode"), false);
});
