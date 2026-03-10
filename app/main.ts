import { createInterface } from "readline";
import { exit } from "process";
import { execSync } from "child_process";
import { handleTypeCommand, locateExecutable } from "./utils";
import { COMMANDS } from "./constants";

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

  const [mainCommand, ...args] = fullCommand.split(" ");
  const secondArg = args[0];

  switch (mainCommand) {
    case COMMANDS.type:
      handleTypeCommand(secondArg);
      break;
    case COMMANDS.echo:
      console.log(args.join(" "));
      break;
    case COMMANDS.pwd:
      console.log(process.cwd());
      break;
    case COMMANDS.cd:
      const dir = secondArg === "~" ? (process.env.HOME ?? "") : secondArg;
      try {
        process.chdir(dir);
      } catch {
        console.log(`cd: ${secondArg}: No such file or directory`);
      }
      break;
    default:
      if (locateExecutable(mainCommand)) {
        execSync(fullCommand, { stdio: "inherit" });
        return;
      }

      console.log(`${mainCommand}: command not found`);
  }
}
