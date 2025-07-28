import { z } from "zod";
import { Tool } from "ollama";

// Convert Zod schema to JSON Schema properties
function zodToJsonSchema(schema: z.ZodObject<any>): {
  properties: Record<string, any>;
  required: string[];
} {
  const shape = schema.shape;
  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const [key, zodType] of Object.entries(shape)) {
    const type = zodType as z.ZodTypeAny;

    // Extract description from Zod schema
    const description = type.description;

    // Determine JSON Schema type
    let jsonSchemaType: string;
    if (type instanceof z.ZodNumber) {
      jsonSchemaType = "number";
    } else if (type instanceof z.ZodString) {
      jsonSchemaType = "string";
    } else if (type instanceof z.ZodBoolean) {
      jsonSchemaType = "boolean";
    } else if (type instanceof z.ZodArray) {
      jsonSchemaType = "array";
    } else if (type instanceof z.ZodObject) {
      jsonSchemaType = "object";
    } else {
      jsonSchemaType = "string"; // fallback
    }

    properties[key] = {
      type: jsonSchemaType,
      ...(description && { description }),
    };

    // Check if field is required (not optional)
    if (!(type instanceof z.ZodOptional)) {
      required.push(key);
    }
  }

  return { properties, required };
}

// Simplified tool creation from Zod schema only

interface ToolArgs<T extends z.ZodRawShape> {
  name: string;
  description: string;
  schema: z.ZodObject<T>;
}

export function createToolFromZod<T extends z.ZodRawShape>({
  name,
  description,
  schema,
}: ToolArgs<T>): Tool & { schema: z.ZodObject<T> } {
  const jsonSchema = zodToJsonSchema(schema);

  return {
    type: "function",
    function: {
      name,
      description,
      parameters: {
        type: "object",
        properties: jsonSchema.properties,
        required: jsonSchema.required,
      },
    },
    schema, // Keep reference for type inference
  };
}
