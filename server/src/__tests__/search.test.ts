import request from "supertest";
import app from "../index";

describe("POST /search", () => {
  it("キーワードを受け取り、ダミーの検索結果を返す", async () => {
    const res = await request(app)
      .post("/search")
      .send({ query: "AIと教育" })
      .expect(200);

    expect(res.body).toHaveProperty("results");
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBeGreaterThan(1);
    for (const paper of res.body.results) {
      expect(paper).toHaveProperty("id");
      expect(typeof paper.id).toBe("string");
      expect(paper).toHaveProperty("title");
      expect(paper).toHaveProperty("author");
      expect(paper).toHaveProperty("year");
      expect(paper).toHaveProperty("abstract");
      expect(paper).toHaveProperty("summary");
    }
    expect(res.body).toHaveProperty("themes");
    expect(Array.isArray(res.body.themes)).toBe(true);
    expect(res.body.themes.length).toBeGreaterThan(0);
    expect(typeof res.body.themes[0]).toBe("string");

    expect(res.body).toHaveProperty("references");
    expect(Array.isArray(res.body.references)).toBe(true);
    expect(res.body.references.length).toBeGreaterThan(0);
    expect(res.body.references[0]).toHaveProperty("id");
    expect(typeof res.body.references[0].id).toBe("string");
    expect(res.body.references[0]).toHaveProperty("title");
    expect(res.body.references[0]).toHaveProperty("author");
    expect(res.body.references[0]).toHaveProperty("year");

    expect(res.body).toHaveProperty("categories");
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
    expect(typeof res.body.categories[0]).toBe("string");

    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("success");
  });

  it("query未指定時は400を返す", async () => {
    const res = await request(app).post("/search").send({}).expect(400);

    expect(res.body).toHaveProperty("error");
  });

  it("サーバ内部エラー時は500とstatus:errorを返す", async () => {
    // 強制的にエラーを発生させるため、特殊なクエリを送る
    const res = await request(app)
      .post("/search")
      .send({ query: "__force_error__" })
      .expect(500);

    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty("error");
  });
});
