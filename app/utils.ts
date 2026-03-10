import which from "which";

export const builtinCommands = ["exit", "type", "echo", "pwd"];

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

export function locateExecutable(command: string): string | null {
  return which.sync(command, { nothrow: true })
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