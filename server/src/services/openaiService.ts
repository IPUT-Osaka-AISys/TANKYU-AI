// Azure OpenAIでテーマとカテゴリを生成するサービス
import fetch from "node-fetch";
import { AzureOpenAI } from "openai";
import { config } from "../config";

const {
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
  AZURE_OPENAI_ENDPOINT,
  AZURE_OPENAI_MODEL_NAME,
  AZURE_OPENAI_DEPLOYMENT,
} = config();

const options = {
  apiKey: AZURE_OPENAI_API_KEY,
  apiVersion: AZURE_OPENAI_API_VERSION,
  endpoint: AZURE_OPENAI_ENDPOINT,
  deployment: AZURE_OPENAI_DEPLOYMENT,
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
    model: AZURE_OPENAI_MODEL_NAME,
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

/**
 * クエリからキーワードの配列を生成する
 * @param query ユーザーが入力したクエリ文字列
 * @returns キーワードの配列
 */
export async function extractKeywordsFromQuery(
  query: string
): Promise<string[]> {
  const prompt = `
あなたは研究テーマ分析AIです。
以下のクエリから、論文検索に有効なキーワードを1-5個抽出してください。

クエリ: "${query}"

抽出したキーワードは、CiNiiで論文を検索するのに適した形で出力してください。
専門用語や学術的なキーワードを優先してください。

出力形式:
キーワード: ["...", "...", "...", "...", "..."]
`;

  const result = await client.chat.completions.create({
    model: AZURE_OPENAI_MODEL_NAME,
    messages: [
      {
        role: "system",
        content:
          "あなたは優秀な研究キーワード抽出AIです。学術的な観点から適切なキーワードを抽出します。",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 200,
    temperature: 0.3,
    top_p: 0.8,
  });

  if (!result.choices || result.choices.length === 0) {
    throw new Error("OpenAIからの応答がありません");
  }

  if (!result.choices[0].message || !result.choices[0].message.content) {
    throw new Error("OpenAIからの応答が不正です");
  }

  const response = result.choices[0].message.content.trim();

  // キーワード抽出ロジック
  const keywordsMatch = response.match(/キーワード\s*[:：]?\s*\[([^\]]+)\]/);

  if (keywordsMatch) {
    const keywords = keywordsMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/["「」]/g, ""))
      .filter((keyword) => keyword.length > 0);

    return keywords;
  } else {
    console.warn("キーワード抽出失敗:", response);
    // フォールバック: 元のクエリをそのまま使用
    return [query];
  }
}
