import { z } from "zod";
import { Tool } from "ollama";

export const diceToolDefinition = {
  type: "function",
  function: {
    name: "dice",
    description:
      "Roll a select number of dice with a specified number of sides.",
    parameters: {
      properties: {
        sides: z.object({
          type: "integer",
          description:
            "Number of sides on the dice (e.g., 6 for a standard dice).",
          minimum: 3,
          maximum: 20,
        }),
        count: z.object({
          type: "integer",
          description: "Number of dice to roll.",
          minimum: 1,
          maximum: 100,
        }),
      },
      required: ["sides", "count"],
      type: "object",
    },
  },
};

type Args = {
  sides: number;
  count: number;
};

export async function dice({ sides, count }: Args): Promise<string> {
  if (sides < 3 || sides > 20) {
    throw new Error("Sides must be between 3 and 20.");
  }
  if (count < 1 || count > 100) {
    throw new Error("Count must be between 1 and 100.");
  }

  const rolls = Array.from(
    { length: count },
    () => Math.floor(Math.random() * sides) + 1
  );

  return `You rolled: ${rolls.join(", ")} (Total: ${rolls.reduce(
    (sum, roll) => sum + roll,
    0
  )})`;
}
