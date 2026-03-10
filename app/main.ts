import { createInterface } from "readline";
import { exit } from "process";
import { access } from 'fs/promises';
import { constants as fsConstants } from "fs";
import path from "path";
import which from "which";

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

function parseCommand(command: string){
  if (command === 'exit') {
    rl.close();
    exit()
  }

  const [mainCommand, ...args] = command.split(' ');

  if (!commands.includes(mainCommand)) {
    console.log(`${mainCommand}: command not found`);
    return
  }

  if (mainCommand === "type") {
    const secondCommand = args[0];

    if (commands.includes(secondCommand)) {
      console.log(`${secondCommand} is a shell builtin`);
      return
    } 

    const location: string | null = which.sync(secondCommand, { nothrow: true });
    if (location !== null) {
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
}
  
async function locateExecutableV1(secondCommand: string){
  const userPath = process.env.PATH
  if (!userPath) {
    console.log(`${secondCommand}: not found`)
    return;
  }

  const dirs = userPath.split(path.delimiter) // delimteres are different for each OS (; or :)
  for( const dir in dirs) {
    const filePath = path.join(dir, secondCommand) // paths are different for each os ( / or \)
    try {
      await access(filePath, fsConstants.X_OK)
      console.log(`${secondCommand} is ${filePath}`);
      return;
    } catch {}
  }
}