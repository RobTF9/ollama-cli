import { z } from "zod";
import { createToolFromZod, createJsonSchemaProperties } from "../utils/schema";

const diceSchema = z.object({
  sides: z
    .number()
    .describe("Number of sides on the dice (e.g., 6 for a standard dice)."),
  count: z.number().describe("Number of dice to roll."),
});

export const diceToolDefinition = createToolFromZod(
  "dice",
  "Roll a select number of dice with a specified number of sides.",
  diceSchema,
  createJsonSchemaProperties(
    {
      sides: {
        type: "number",
        description:
          "Number of sides on the dice (e.g., 6 for a standard dice).",
      },
      count: {
        type: "number",
        description: "Number of dice to roll.",
      },
    },
    ["sides", "count"]
  )
);

type Args = z.infer<typeof diceSchema>;

export async function dice({ sides, count }: Args): Promise<string> {
  const rolls = Array.from(
    { length: count },
    () => Math.floor(Math.random() * sides) + 1
  );

  return `${rolls.join(", ")}`;
}
