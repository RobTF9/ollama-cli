import ollama from "ollama";
import * as readline from "readline";

async function main() {
  const model = "llama3.1";
  const { models } = await ollama.list();

  if (!models.some(({ name }) => name === model)) {
    console.log(`Model ${model} not found. Pulling the model...`);
    await ollama.pull({ model });
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

  const tools = [
    {
      type: "function",
      function: {
        name: "get_capital",
        description: "Get the capital of a country",
        parameters: {
          type: "object",
          properties: {
            country: {
              type: "string",
              description: "The name of the country to get the capital for",
            },
          },
          required: ["country"],
        },
      },
    },
  ];

  console.log("Chat started. Type 'exit' to quit.\n");

  while (true) {
    const userInput = await new Promise<string>((resolve) => {
      rl.question("You: ", resolve);
    });

    if (userInput.toLowerCase() === "exit") {
      break;
    }

    messages.push({
      role: "user",
      content: userInput,
    });

    try {
      const response = await ollama.chat({
        model: "llama3.1",
        messages: messages,
        tools: tools,
      });

      console.log("Assistant:", response.message.content);

      messages.push({
        role: "assistant",
        content: response.message.content,
      });
    } catch (error) {
      console.error("Error:", error);
    }

    console.log();
  }

  rl.close();
}

main();
