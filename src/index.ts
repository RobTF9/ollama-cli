import * as readline from "readline";
import { model, init } from "./model";
import { loader, log, userMessage } from "./ui";

async function main() {
  try {
    await init();
  } catch (error) {
    console.error("Failed to initialize the model:", error);
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
  ];

  console.log("Chat started. Type 'exit' to quit.\n");

  while (true) {
    const userInput = await new Promise<string>((resolve) => {
      rl.question(userMessage(), resolve);
    });

    if (userInput.toLowerCase() === "exit") {
      break;
    }

    messages.push({
      role: "user",
      content: userInput,
    });

    try {
      rl.pause();
      const spinner = loader("");

      const response = await model({
        messages,
        tools: [],
      });

      spinner.stop().clear();
      rl.resume();

      if (response.message.content) {
        messages.push({
          role: "assistant",
          content: response.message.content,
        });
        log(response.message);
      }
    } catch (error) {
      rl.resume();
      console.error("Error:", error);
    }
  }

  rl.close();
}

main();
