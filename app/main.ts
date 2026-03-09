import { createInterface } from "readline";

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
  // handle Type
  if (mainCommand === "type") {
    const secondCommand = args[0];
    if (secondCommand === "echo" || secondCommand === "exit" || secondCommand === "type") {
      console.log(`${args[0]} is a shell builtin`)
    } else {
      console.log(`${secondCommand}: not found`);
    }
  }
  // handle Echo
  else if (mainCommand === "echo") {
    console.log(args.join(" ")); 
  } else {
    console.log(`${mainCommand}: command not found`);
  }
  rl.prompt();
});