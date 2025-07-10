import React from "react";

import type { ApiResponse } from "./apiTypes";

type SearchThemeProps = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  apiResult: ApiResponse | null;
  setApiResult: React.Dispatch<React.SetStateAction<ApiResponse | null>>;
};

const SearchTheme: React.FC<SearchThemeProps> = ({
  query,
  setQuery,
  apiResult,
  setApiResult,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiResult(null);
    setApiError(null);

    try {
      const res = await fetch("http://localhost:3001/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data: ApiResponse = await res.json();
      if (!res.ok || data.status === "error") {
        setApiError(data.error || "サーバエラー");
      } else {
        setApiResult(data);
      }
    } catch (err) {
      setApiError(
        `通信エラー: ${err instanceof Error ? err.message : "不明なエラー"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>テーマ探索</h2>
      <form
        className="search-form"
        style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="キーワードや自然文を入力"
          style={{ flex: 1, padding: "0.7rem", fontSize: "1.1rem" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          style={{ padding: "0.7rem 1.5rem", fontSize: "1.1rem" }}
          disabled={loading || !query}
        >
          {loading ? "検索中..." : "検索"}
        </button>
      </form>
      <div
        className="search-result-placeholder"
        style={{
          background: "#f3f6fa",
          padding: "2rem",
          borderRadius: "8px",
          minHeight: "120px",
        }}
      >
        {apiError ? (
          <p style={{ color: "red" }}>{apiError}</p>
        ) : apiResult ? (
          <div>
            <div>
              <strong>テーマ推薦:</strong>
              <ul>
                {apiResult.themes.map((theme, i) => (
                  <li key={i}>{theme}</li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <strong>分類:</strong> {apiResult.categories.join(", ")}
            </div>
          </div>
        ) : (
          <p style={{ color: "#888" }}>検索結果がここに表示されます</p>
        )}
      </div>
    </section>
  );
};

export default SearchTheme;
