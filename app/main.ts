import { createInterface } from "readline";
import { exit } from "process";
import { execSync } from 'child_process';
import {handleTypeCommand, locateExecutable} from "./utils"
import { main } from "bun";

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
    handleTypeCommand(secondCommand);
    return
  }

  if (mainCommand === "echo") {
    console.log(args.join(" ")); 
    return;
  } 

  if (mainCommand === "pwd") {
    console.log(process.cwd())
    return;
  }

  if (locateExecutable(mainCommand)) {
    execSync(fullCommand, {stdio: "inherit"})
    return;
  }

  console.log(`${mainCommand}: command not found`);
}

