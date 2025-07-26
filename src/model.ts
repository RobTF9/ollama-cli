import ollama, { type Message, Tool } from "ollama";
import { loader } from "./ui";

const selectedModel = "llama3.1";

export async function init() {
  const { models } = await ollama.list();

  if (!models.find(({ name }) => name === selectedModel)) {
    const modelLoader = loader(`Pulling model ${selectedModel}...`);
    try {
      await ollama.pull({ model: selectedModel });
      modelLoader.succeed(`Model ${selectedModel} pulled successfully.`);
      return;
    } catch (error) {
      modelLoader.fail(`Failed to pull model ${selectedModel}.`);
      throw error;
    }
  }

  return;
}

interface ModelArgs {
  messages: Message[];
  tools: Tool[];
}

export async function model({ messages, tools }: ModelArgs) {
  try {
    const response = await ollama.chat({
      model: selectedModel,
      messages,
      options: {
        temperature: 0,
      },
      tools,
    });

    return response;
  } catch (error) {
    console.error(`Error during chat: ${error}`);
    throw error;
  }
}
