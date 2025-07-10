import React from "react";

const SearchTheme: React.FC = () => {
  return (
    <section>
      <h2>テーマ探索</h2>
      <form
        className="search-form"
        style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}
      >
        <input
          type="text"
          placeholder="キーワードや自然文を入力"
          style={{ flex: 1, padding: "0.7rem", fontSize: "1.1rem" }}
        />
        <button
          type="submit"
          style={{ padding: "0.7rem 1.5rem", fontSize: "1.1rem" }}
        >
          検索
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
        <p style={{ color: "#888" }}>検索結果がここに表示されます</p>
      </div>
    </section>
  );
};

export default SearchTheme;
