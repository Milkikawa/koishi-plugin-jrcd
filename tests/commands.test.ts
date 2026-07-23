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
