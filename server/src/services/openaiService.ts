// Azure OpenAIでテーマとカテゴリを生成するサービス
import fetch from "node-fetch";
import dotenv from "dotenv";
import { AzureOpenAI } from "openai";

dotenv.config();

const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-04-01-preview";
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = process.env.AZURE_OPENAI_MODEL_NAME || "gpt-4.1-mini";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4.1-mini";
const options = {
  apiKey,
  apiVersion,
  endpoint,
  deployment,
};

const client = new AzureOpenAI(options);

export async function generateThemesAndCategories(
  papers: any[],
  query: string
): Promise<{ themes: string[]; categories: string[] }> {
  const paperSummaries = papers
    .map((p, i) => `【${i + 1}】タイトル: ${p.title}\n要約: ${p.abstract}`)
    .join("\n\n");
  const prompt = `
あなたは研究テーマ提案AIです。
以下は「${query}」で検索した既存研究です。
${paperSummaries}

この分野で新たに研究するなら、どんなテーマやカテゴリが良いか、日本語で3つずつ提案してください。
出力形式:
テーマ: ["...", "...", "..."]
カテゴリ: ["...", "...", "..."]
`;

  const result = await client.chat.completions.create({
    model: modelName,
    messages: [
      { role: "system", content: "あなたは優秀な研究テーマ提案AIです。" },
      { role: "user", content: prompt },
    ],
    max_tokens: 256,
    temperature: 0.7,
    top_p: 0.9,
  });
  if (!result.choices || result.choices.length === 0) {
    throw new Error("OpenAIからの応答がありません");
  }
  if (!result.choices[0].message || !result.choices[0].message.content) {
    throw new Error("OpenAIからの応答が不正です");
  }
  const response = result.choices[0].message.content.trim();
  // 柔軟な抽出ロジック
  const themesMatch = response.match(/テーマ\s*[:：]?\s*\[([^\]]+)\]/);
  const categoriesMatch = response.match(/カテゴリ\s*[:：]?\s*\[([^\]]+)\]/);
  let themes: string[] = [];
  let categories: string[] = [];
  if (themesMatch) {
    themes = themesMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/["「」]/g, ""));
  } else {
    console.warn("テーマ抽出失敗:", response);
  }
  if (categoriesMatch) {
    categories = categoriesMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/["「」]/g, ""));
  } else {
    console.warn("カテゴリ抽出失敗:", response);
  }
  return { themes, categories };
}
