import * as readline from "readline";
import { init } from "./model";
import { log, userMessage } from "./ui";
import { agent } from "./agent";
import { tools } from "./tools";

async function main() {
  try {
    await init();
  } catch (error) {
    log({ error: `Initialization failed: ${error}` });
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Chat started. Type 'exit' to quit.\n");

  while (true) {
    const userInput = await new Promise<string>((resolve) => {
      rl.question(userMessage(), resolve);
    });

    if (userInput.toLowerCase() === "exit") {
      break;
    }

    try {
      rl.pause();
      await agent({ userMessage: userInput, tools });
    } catch (error) {
      log({ error: `${error}` });
    } finally {
      rl.resume();
    }
  }

  rl.close();
}

main();
