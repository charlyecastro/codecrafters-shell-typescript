import { createInterface } from "readline";
import { exit } from "process";
import { spawnSync } from "child_process";
import { parse } from "shell-quote"; // Maybe build my own parser
import fs from "fs";

import {
  handleTypeCommand,
  locateExecutable,
  handleCdCommand,
  log,
  extractRedirect,
  confirmDirExists,
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

  const normalizedCommand = normalizeRedirect(fullCommand);
  const parsedCommand = parse(normalizedCommand);
  const { sanitizedCommand, redirectFile } = extractRedirect(parsedCommand);
  const [command, ...finalArgs] = sanitizedCommand;

  switch (command) {
    case COMMANDS.type:
      handleTypeCommand(finalArgs[0]);
      break;
    case COMMANDS.echo:
      log(finalArgs.join(" "), redirectFile);
      break;
    case COMMANDS.pwd:
      log(process.cwd(), redirectFile);
      break;
    case COMMANDS.cd:
      handleCdCommand(finalArgs[0]);
      break;
    default:
      const executablePath = locateExecutable(command);
      if (!executablePath) {
        process.stdout.write(`${command}: command not found\n`);
        return;
      }
      if (redirectFile) {
        confirmDirExists(redirectFile);
        const fd = fs.openSync(redirectFile, "w");
        spawnSync(executablePath, finalArgs, {
          stdio: ["inherit", fd, "inherit"],
          argv0: command,
        });
        fs.closeSync(fd);
        return;
      }
      spawnSync(executablePath, finalArgs, {
        stdio: "inherit",
        argv0: command,
      });
  }
}
