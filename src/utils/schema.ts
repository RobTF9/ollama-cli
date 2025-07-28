import { z } from "zod";
import { Tool } from "ollama";

// Manual schema definition helper - avoids Zod internals compatibility issues
export function createToolFromZod<T extends z.ZodRawShape>(
  name: string,
  description: string,
  schema: z.ZodObject<T>,
  jsonSchemaProperties: {
    properties: Record<string, any>;
    required: string[];
  }
): Tool & { schema: z.ZodObject<T> } {
  return {
    type: "function",
    function: {
      name,
      description,
      parameters: {
        type: "object",
        properties: jsonSchemaProperties.properties,
        required: jsonSchemaProperties.required,
      },
    },
    schema, // Keep reference for type inference
  };
}

// Helper to create JSON Schema properties manually
export function createJsonSchemaProperties(properties: Record<string, {
  type: string;
  description?: string;
  enum?: any[];
  items?: any;
}>, required: string[] = []): {
  properties: Record<string, any>;
  required: string[];
} {
  return { properties, required };
}
