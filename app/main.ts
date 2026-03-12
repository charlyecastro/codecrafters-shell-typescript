import { createInterface } from "readline";
import { exit } from "process";
import { spawnSync } from "child_process";
import { parse } from "shell-quote"; // Maybe build my own parser
import path from "path";
import fs from "fs";

import {
  handleTypeCommand,
  locateExecutable,
  handleCdCommand,
  log,
  isValidPipeOperator,
} from "./utils";
import { COMMANDS } from "./constants";

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

  // Check if operator and file args exist
  const [operator, file] = args.slice(-2);
  const isValidPipe = isValidPipeOperator(operator);
  const redirectFile = isValidPipe ? file : undefined;

  // Ensure operator and file args are excluded
  const finalArgs = isValidPipe ? args.slice(0, -2) : args;
  finalArgs.push("\n")
  // const finalFullCommand = [command, finalArgs].join(" ");

  switch (command) {
    case COMMANDS.type:
      const value = args[0];
      handleTypeCommand(value);
      break;
    case COMMANDS.echo:
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
      const executablePath = locateExecutable(command);
      if (!executablePath) {
        console.log(`${command}: command not found`);
        return;
      }

      if (redirectFile) {
        const dir = path.dirname(redirectFile);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const fd = fs.openSync(redirectFile, "w");
        spawnSync(executablePath, finalArgs, { stdio: ["inherit", fd, fd], argv0: "command" });
        fs.closeSync(fd);
        return;
      }
      spawnSync(executablePath, finalArgs, { stdio: ["inherit"], argv0: "command" });

  }
}
