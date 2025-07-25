import ollama, { type Message, Tool } from "ollama";

interface ModelArgs {
  messages: Message[];
  tools: Tool[];
}

export async function model({ messages, tools }: ModelArgs): Promise<string> {
  const model = "llama3.1";
  const { models } = await ollama.list();

  if (!models.some(({ name }) => name === model)) {
    console.log(`Model ${model} not found. Pulling the model...`);
    await ollama.pull({ model });
    console.log(`Model ${model} pulled successfully.`);
  }

  try {
    const response = await ollama.chat({
      model,
      messages,
      tools,
    });

    return response.message.content;
  } catch (error) {
    console.error(`Error during chat: ${error}`);
    throw error;
  }
}
