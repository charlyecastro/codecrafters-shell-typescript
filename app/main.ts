import { createInterface } from "readline";
import { access, constants } from 'fs/promises';

const commands = ["exit","type","echo"]

async function checkExecutePermission(path: string): Promise<boolean> {
  try {
    // Check if the path is executable (X_OK)
    await access(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();

rl.on('line', (command: string) => {
  // handle Exit
  if (command === 'exit') {
    rl.close();
    return;
  }

  const [mainCommand, ...args] = command.split(' ');

  if (!commands.includes(mainCommand)) {
    console.log(`${mainCommand}: command not found`);
  }

  // handle Type
  if (mainCommand === "type") {
    const secondCommand = args[0];
    const systemPath: string = process.env.Path;
    const systemPaths = systemPath.split(":");
    const foundPaths = systemPaths.filter( async (path: string) => {
      const found = path.includes(secondCommand);
      if (!found) return false
      return await checkExecutePermission(path)
    } )
    
    const foundPath = foundPaths[0]

    if (commands.includes(mainCommand)) {
      console.log(`${args[0]} is a shell builtin`)
    } else if(foundPath){
      console.log(`${secondCommand} is ${foundPath}`)
    } else {
      console.log(`${secondCommand}: not found`);
    }
  }
  // handle Echo
  else if (mainCommand === "echo") {
    console.log(args.join(" ")); 
  } 

  rl.prompt();
});