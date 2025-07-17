import express, { Request, Response } from "express";
import cors from "cors";
import { SearchResponse, CiniiArticle } from "./types";
import { SearchThemeUseCase } from "./application/SearchThemeUseCase";

const app = express();
const port = 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

app.use(cors());
app.use(express.json());

app.post("/search", async (req: Request, res: Response) => {
  app.get("/paper/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "idパラメータが必要です" });
      return;
    }
    try {
      const { getCiniiArticleDetail } = await import("./services/ciniiService");
      const detail = await getCiniiArticleDetail(id);
      if (!detail) {
        res.status(404).json({ error: "論文が見つかりません" });
        return;
      }
      res.json(detail);
    } catch (err: any) {
      res
        .status(500)
        .json({ status: "error", error: err.message || "サーバ内部エラー" });
    }
  });
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: "queryパラメータが必要です" });
    return;
  }
  if (query === "__force_error__") {
    res.status(500).json({ status: "error", error: "サーバ内部エラー" });
    return;
  }
  try {
    const useCase = new SearchThemeUseCase();
    const response = await useCase.execute(query);
    res.json(response);
  } catch (err: any) {
    res
      .status(500)
      .json({ status: "error", error: err.message || "サーバ内部エラー" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default app;
