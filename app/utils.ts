import which from "which";
import { builtinCommands } from "./constants";
import fs from "fs";

export function handleTypeCommand(command: string) {
  if (builtinCommands.includes(command)) {
    console.log(`${command} is a shell builtin`);
    return;
  }

  const location = locateExecutable(command);
  if (location) {
    console.log(`${command} is ${location}`);
    return;
  }

  console.log(`${command}: not found`);
  return;
}

export function handleCdCommand(arg: string) {
  const dir = arg === "~" ? (process.env.HOME ?? "") : arg;
  try {
    process.chdir(dir);
  } catch {
    console.log(`cd: ${arg}: No such file or directory`);
  }
}

export function locateExecutable(command: string): string | null {
  return which.sync(command, { nothrow: true });
}

export function isValidPipeOperator(operatorString: string) {
  const operator = JSON.parse(JSON.stringify(operatorString)).op ?? "";
  return operator === `>` || operator === `1>`;
}

export function log(content: string, file?: string) {
  if (file) {
    try {
      fs.writeFileSync(file, content, {flag: "w"});
    } catch (err) {
      console.log(err);
    }
    return;
  }
  console.log(content);
}

// async function locateExecutableV1(command: string){
//   const userPath = process.env.PATH
//   if (!userPath) {
//     console.log(`${command}: not found`)
//     return;
//   }

//   const dirs = userPath.split(path.delimiter) // delimteres are different for each OS (; or :)
//   for( const dir in dirs) {
//     const filePath = path.join(dir, command) // paths are different for each os ( / or \)
//     try {
//       await access(filePath, fsConstants.X_OK)
//       console.log(`${command} is ${filePath}`);
//       return;
//     } catch {}
//   }
// }
