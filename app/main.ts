import { createInterface } from "readline";
import { exit } from "process";
import which from "which";
import { execSync } from 'child_process';

const commands = ["exit","type","echo"]

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();
rl.on('line', (command: string) => {
  parseCommand(command)
  rl.prompt();
});

function parseCommand(fullCommand: string){
  if (fullCommand === 'exit') {
    rl.close();
    exit()
  }

  const [mainCommand, ...args] = fullCommand.split(' ');

  if (mainCommand === "type") {
    const secondCommand = args[0];

    if (commands.includes(secondCommand)) {
      console.log(`${secondCommand} is a shell builtin`);
      return
    } 

    const location = locateExecutable(secondCommand);
    if (location) {
      console.log(`${secondCommand} is ${location}`);
      return;
    }

    console.log(`${secondCommand}: not found`);
  }
  // handle Echo
  if (mainCommand === "echo") {
    console.log(args.join(" ")); 
    return;
  } 

  if (locateExecutable(mainCommand)) {
    execSync(fullCommand, {stdio: "inherit"})
    return;
  }

  console.log(`${mainCommand}: command not found`);
}

function locateExecutable(command: string): string | null {
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