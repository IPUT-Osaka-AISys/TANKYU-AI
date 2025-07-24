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

// すべてのリクエストをログ出力
app.use((req: Request, res: Response, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path} - Query:`, req.query, "Params:", req.params);
  next();
});

app.get("/paper/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`[DEBUG] GET /paper/:id called with id: "${id}"`);
  console.log(`[DEBUG] Full request path: ${req.path}`);
  console.log(`[DEBUG] Request params:`, req.params);
  
  if (!id) {
    console.log(`[DEBUG] No id parameter provided`);
    res.status(400).json({ error: "idパラメータが必要です" });
    return;
  }
  try {
    console.log(`[DEBUG] Calling getCiniiArticleDetail with id: "${id}"`);
    const { getCiniiArticleDetail } = await import("./services/ciniiService");
    const detail = await getCiniiArticleDetail(id);
    console.log(`[DEBUG] CiNii API response:`, detail ? "Found" : "Not found");
    
    if (!detail) {
      console.log(`[DEBUG] No detail found for id: "${id}"`);
      res.status(404).json({ error: "論文が見つかりません" });
      return;
    }
    console.log(`[DEBUG] Returning detail for id: "${id}"`);
    res.json(detail);
  } catch (err: any) {
    console.log(`[DEBUG] Error occurred:`, err.message);
    res
      .status(500)
      .json({ status: "error", error: err.message || "サーバ内部エラー" });
  }
});

app.post("/search", async (req: Request, res: Response) => {
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
