import { z } from "zod";
import { createToolFromZod } from "../utils/schema";

export const diceToolDefinition = createToolFromZod({
  name: "dice",
  description: "Roll a select number of dice with a specified number of sides.",
  schema: z.object({
    sides: z
      .number()
      .describe("Number of sides on the dice (e.g., 6 for a standard dice)."),
    count: z.number().describe("Number of dice to roll."),
  }),
});

type Args = z.infer<typeof diceToolDefinition.schema>;

export async function dice({ sides, count }: Args): Promise<string> {
  const rolls = Array.from(
    { length: count },
    () => Math.floor(Math.random() * sides) + 1
  );

  return `${rolls.join(", ")}`;
}
