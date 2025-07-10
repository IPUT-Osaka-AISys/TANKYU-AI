import express, { Request, Response } from "express";
import cors from "cors";
import { SearchResponse } from "./types";

const app = express();
const port = 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

app.use(cors());
app.use(express.json());

app.post("/search", (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: "queryパラメータが必要です" });
    return;
  }
  if (query === "__force_error__") {
    res.status(500).json({ status: "error", error: "サーバ内部エラー" });
    return;
  }
  // ダミーの検索結果
  const response: SearchResponse = {
    results: [
      {
        id: "paper-1",
        title: `ダミー論文タイトル1: ${query}`,
        author: "山田 太郎",
        year: 2024,
        abstract: "これはダミーの抄録1です。",
        summary: "これはAIによるダミー要約1です。",
      },
      {
        id: "paper-2",
        title: `ダミー論文タイトル2: ${query}`,
        author: "佐藤 花子",
        year: 2023,
        abstract: "これはダミーの抄録2です。",
        summary: "これはAIによるダミー要約2です。",
      },
    ],
    themes: [
      "AIと教育の未来",
      "教育現場における生成AI活用",
      "AI倫理と学習評価",
    ],
    references: [
      {
        id: "ref-1",
        title: "AI時代の教育改革",
        author: "田中 一郎",
        year: 2022,
      },
      {
        id: "ref-2",
        title: "生成AIと学習評価",
        author: "鈴木 花子",
        year: 2021,
      },
    ],
    categories: ["AI活用", "教育工学", "生成AI"],
    status: "success",
  };
  res.json(response);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

export default app;
