import dotenv from "dotenv";

export function config() {
  dotenv.config();
  const CINII_API_KEY = process.env.CINII_API_KEY;
  if (!CINII_API_KEY) {
    throw new Error("CINII_API_KEY is not set in environment variables.");
  }
  return { CINII_API_KEY };
}
