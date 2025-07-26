import { Message } from "ollama";
import ora from "ora";

export function loader(text: string) {
  const spinner = ora({ text, discardStdin: false }).start();

  return {
    start: () => spinner.start(),
    stop: () => spinner.stop(),
    succeed: (text?: string) => spinner.succeed(text),
    fail: (text?: string) => spinner.fail(text),
    info: (text?: string) => spinner.info(text),
    warn: (text?: string) => spinner.warn(text),
    clear: () => spinner.clear(),
    text: (newText: string) => {
      spinner.text = newText;
      return spinner;
    },
  };
}

export const reset = "\x1b[0m"; // Reset color

export const colors = {
  user: "\x1b[36m", // cyan
  assistant: "\x1b[32m", // green
  grey: "\x1b[90m", // grey
  error: "\x1b[31m", // red
  warning: "\x1b[33m", // yellow
  info: "\x1b[34m", // blue
  success: "\x1b[32m", // green
};

export const icons = {
  check: "\x1b[32m✔\x1b[0m", // green check
  cross: "\x1b[31m✖\x1b[0m", // red cross
  info: "\x1b[34mℹ\x1b[0m", // blue info
  warn: "\x1b[33m⚠\x1b[0m", // yellow warning
};

export function userMessage(content?: string) {
  return `${colors.user}[USER]${reset}\n${content ?? ""}`;
}

export function assistantMessage(content: string) {
  return `\n${colors.assistant}[ASSISTANT]${reset}\n${content}\n`;
}

export function errorMessage(content: string) {
  return `${icons.cross}${colors.error} Error: ${content}${reset}`;
}

interface LogArgs {
  message?: Message;
  error?: string;
}

export function log({ message, error }: LogArgs) {
  if (error) {
    console.error(errorMessage(error));
  }

  if (!message) return;

  if (message.role === "user") {
    console.log(userMessage(message.content));
  }
  if (message.role === "assistant") {
    console.log(assistantMessage(message.content));
  }
}
