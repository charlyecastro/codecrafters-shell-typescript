import { createInterface } from "readline";
import { exit } from "process";
import { execSync } from "child_process";
import { handleTypeCommand, locateExecutable, handleCdCommand } from "./utils";
import { COMMANDS } from "./constants";
import { parse } from "shell-quote";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();
rl.on("line", (command: string) => {
  parseCommand(command);
  rl.prompt();
});

function parseCommand(fullCommand: string) {
  if (fullCommand === COMMANDS.exit) {
    rl.close();
    exit();
  }

  const [command, ...args] = parse(fullCommand) as string[];
  switch (command) {
    case COMMANDS.type:
      const value = args[0];
      handleTypeCommand(value);
      break;
    case COMMANDS.echo:
      console.log(args.join(' '));
      break;
    case COMMANDS.pwd:
      console.log(process.cwd());
      break;
    case COMMANDS.cd:
      const dir = args[0];
      handleCdCommand(dir);
      break;
    default:
      if (locateExecutable(command)) {
        execSync(fullCommand, { stdio: "inherit" });
        return;
      }

      console.log(`${command}: command not found`);
  }
}
