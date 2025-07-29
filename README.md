# Arbiter

A TypeScript CLI application that provides an interactive chat interface with Ollama AI models and tool calling capabilities.

## Features

- Interactive command-line chat interface
- Tool calling support with type-safe schema definitions
- Automatic model management (downloads models if not available)
- Real-time loading indicators with Ora spinner
- Built-in tools (dice rolling example)
- Extensible tool system with Zod schema validation

## Prerequisites

- Node.js (version 14 or higher)
- [Ollama](https://ollama.ai/) installed and running locally

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd arbiter
```

2. Install dependencies:
```bash
npm install
```

## Usage

Start the interactive chat:
```bash
npm run dev
```

The application will:
1. Check if the required model (llama3.1) is available
2. Download it automatically if needed
3. Start an interactive chat session
4. Type `exit` to quit

## Project Structure

```
src/
├── agent.ts        # Main agent logic and conversation handling
├── model.ts        # Ollama model initialization and chat interface
├── ui.ts           # User interface utilities (spinners, logging)
├── index.ts        # Application entry point
├── tools/          # Tool definitions and runners
│   ├── dice.ts     # Example dice rolling tool
│   └── index.ts    # Tool registry and execution
└── utils/
    └── schema.ts   # Zod to JSON Schema conversion utilities
```

## Adding New Tools

Tools are defined using Zod schemas for type safety:

```typescript
import { z } from "zod";
import { createToolFromZod } from "../utils/schema";

const myToolSchema = z.object({
  input: z.string().describe("Description of the input parameter"),
});

export const myToolDefinition = createToolFromZod({
  name: "myTool",
  description: "What this tool does",
  schema: myToolSchema,
});

type Args = z.infer<typeof myToolDefinition.schema>;

export async function myTool({ input }: Args): Promise<string> {
  // Tool implementation
  return "result";
}
```

Then register it in `src/tools/index.ts`.

## Configuration

The application uses the `llama3.1` model by default. You can change this in `src/model.ts`:

```typescript
const selectedModel = "your-preferred-model";
```

## Development

Build the project:
```bash
tsc -b
```

Run the compiled JavaScript:
```bash
node dist/index.js
```

## License

ISC