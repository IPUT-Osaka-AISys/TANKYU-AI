import React, { useState } from "react";
import "./App.css";
import SearchTheme from "./SearchTheme";
import PaperDetail from "./PaperDetail";
import ReferenceList from "./ReferenceList";

const SIDEBAR_ITEMS = [
  { key: "search", label: "テーマ探索" },
  { key: "paper", label: "論文詳細" },
  { key: "reference", label: "参考文献リスト" },
];

function App() {
  const [activePage, setActivePage] = useState("search");

  let content;
  if (activePage === "search") content = <SearchTheme />;
  else if (activePage === "paper") content = <PaperDetail />;
  else if (activePage === "reference") content = <ReferenceList />;

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>研究テーマ探索AIシステム</h1>
      </header>
      <div className="app-body">
        <aside className="app-sidebar">
          <nav>
            <ul>
              {SIDEBAR_ITEMS.map((item) => (
                <li
                  key={item.key}
                  style={{
                    background: activePage === item.key ? "#c7d2e5" : undefined,
                    borderRadius: "6px",
                    padding: "0.4rem 0.7rem",
                  }}
                  onClick={() => setActivePage(item.key)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="app-main">{content}</main>
      </div>
      <footer className="app-footer">
        <small>&copy; 2025 研究テーマ探索AIシステム</small>
      </footer>
    </div>
  );
}

export default App;
