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
  const [cmd, ...args] = command.split(' ');
  // handle Type
  if (cmd === "type") {
    if (args[0] === "echo" || args[0] === "exit" || args[0] === "type") {
      console.log(`${args[0]} is a shell builtin`)
    }
  }
  // handle Echo
  else if (cmd === "echo") {
    console.log(args.join(" ")); 
  } else {
    console.log(`${command}: command not found`);
  }
  rl.prompt();
});