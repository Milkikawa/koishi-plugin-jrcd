import { Context } from "koishi";
import { registerCommands } from "./commands";
import { Config } from "./config";

export const name = "jrcd";

export { Config };

export function apply(ctx: Context, config: Config): void {
  registerCommands(ctx, config);
}
