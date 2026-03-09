import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});


rl.prompt();
rl.on('line', (command: string) => {
  if (command === 'exit') {
    rl.close();
    return;
  }
  const [cmd, ...args] = command.split(' ');
  if (cmd === "echo") {
    console.log(args.join(" ")); 
  } else {
    console.log(`${command}: command not found`);
  }
  rl.prompt();
});