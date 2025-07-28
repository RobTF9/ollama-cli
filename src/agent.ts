import { Tool } from "ollama";
import { model } from "./model";
import { loader, log } from "./ui";
import { runner } from "./tools";

interface AgentArgs {
  userMessage: string;
  tools?: Tool[];
}

const messages = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
];

export async function agent({ userMessage, tools = [] }: AgentArgs) {
  messages.push({
    role: "user",
    content: userMessage,
  });

  const agentLoader = loader("Thinking...");

  try {
    while (true) {
      const response = await model({
        messages,
        tools,
      });

      if (response.message.content) {
        messages.push({
          role: "assistant",
          content: response.message.content,
        });
        agentLoader.stop().clear();
        log({ message: response.message });

        return response.message;
      }

      if (response.message.tool_calls) {
        const toolCall = response.message.tool_calls[0];
        agentLoader.text(`Executing tool: ${toolCall.function.name}`);
        const toolResponse = await runner({ toolCall });
        messages.push({
          role: "tool",
          content: toolResponse,
        });
        agentLoader.succeed(`Tool executed: ${toolCall.function.name}`);
      }
    }
  } catch (error) {
    agentLoader.fail(`Error: ${error}`).clear();
    throw error;
  }
}
