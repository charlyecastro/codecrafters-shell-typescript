import { createInterface } from "readline";
import { exit } from "process";
import { execSync } from 'child_process';
import {handleTypeCommand, locateExecutable} from "./utils"
import { COMMANDS } from "./constants";

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
  if (fullCommand === COMMANDS.exit) {
    rl.close();
    exit()
  }

  const [mainCommand, ...args] = fullCommand.split(' ');
  const secondCommand = args[0];

  if (mainCommand === COMMANDS.type) {
    
    handleTypeCommand(secondCommand);
    return
  }

  if (mainCommand === COMMANDS.echo) {
    console.log(args.join(" ")); 
    return;
  } 

  if (mainCommand === COMMANDS.pwd) {
    console.log(process.cwd())
    return;
  }

  if (mainCommand === COMMANDS.cd) {
    process.chdir(secondCommand);
    return;
  }

  if (locateExecutable(mainCommand)) {
    execSync(fullCommand, {stdio: "inherit"})
    return;
  }

  console.log(`${mainCommand}: command not found`);
}

