import { createInterface } from "readline";
import { exit } from "process";
import { access, constants } from 'fs/promises';
import path from "path";

const commands = ["exit","type","echo"]

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();
rl.on('line', async (command: string) => {
  await parseCommand(command)
  rl.prompt();
});

async function parseCommand(command: string){
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

    const userPath = process.env.PATH
    if (!userPath) {
      console.log(`${secondCommand}: not found user path`)
      return;
    }

    const dirs = userPath.split(path.delimiter) // delimteres are different for each OS (; or :)
    for( const dir in dirs) {
      const filePath = path.join(dir, secondCommand) // paths are different for each os ( / or \)
      try {
        const result = await access(filePath, constants.X_OK)
        console.log(`${secondCommand} is ${filePath}`)
        return;
      } catch {
        continue
      }
    }

    console.log(`${secondCommand}: not found fallback`);
  }
  // handle Echo
  if (mainCommand === "echo") {
    console.log(args.join(" ")); 
    return;
  } 
}
  