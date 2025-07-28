import { ToolCall } from "ollama";
import { dice, diceToolDefinition } from "./dice";

export const tools = [diceToolDefinition];

interface RunnerArgs {
  toolCall: ToolCall;
}

export async function runner({ toolCall }: RunnerArgs) {
  switch (toolCall.function.name) {
    case diceToolDefinition.function.name:
      const args = toolCall.function.arguments as {
        sides: number;
        count: number;
      };
      return await dice(args);
    default:
      throw new Error(`Unknown tool call: ${toolCall.function.name}`);
  }
}
