import { createInterface } from "readline";
import { exit } from "process";
import { execSync } from "child_process";
import {
  handleTypeCommand,
  locateExecutable,
  handleCdCommand,
  log,
  isValidPipeOperator,
} from "./utils";
import { COMMANDS } from "./constants";
import { parse } from "shell-quote"; // Maybe build my own parser

/** Normalize 1> to > so shell-quote parses it as a redirect operator */
/** shell-quote does not support 1> */
function normalizeRedirect(input: string): string {
  return input.replace(/\b1>/g, ">");
}

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

  const [command, ...args] = parse(normalizeRedirect(fullCommand)) as string[];
  const [operator, file] = args.slice(-2);
  const isValidPipe = isValidPipeOperator(operator);
  const redirectFile = isValidPipe ? file : undefined;

  switch (command) {
    case COMMANDS.type:
      const value = args[0];
      handleTypeCommand(value);
      break;
    case COMMANDS.echo:
      const finalArgs = isValidPipe ? args.slice(0, -2) : args;
      log(finalArgs.join(" "), redirectFile);
      break;
    case COMMANDS.pwd:
      log(process.cwd(), redirectFile);
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
