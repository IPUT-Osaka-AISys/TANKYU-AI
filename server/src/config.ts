import dotenv from "dotenv";

export function config() {
  dotenv.config();
  
  const CINII_API_KEY = process.env.CINII_API_KEY;
  if (!CINII_API_KEY) {
    throw new Error("CINII_API_KEY is not set in environment variables.");
  }

  const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
  const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION;
  const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
  const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;
  const AZURE_OPENAI_MODEL_NAME = process.env.AZURE_OPENAI_MODEL_NAME;

  if (!AZURE_OPENAI_API_KEY || !AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_DEPLOYMENT) {
    throw new Error("Azure OpenAI configuration is incomplete. Please check environment variables.");
  }

  return { 
    CINII_API_KEY,
    AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_API_VERSION,
    AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_DEPLOYMENT,
    AZURE_OPENAI_MODEL_NAME
  };
}
