import { useState } from "react";
import "./App.css";
import SearchTheme from "./SearchTheme";
import PaperDetail from "./PaperDetail";
import ReferenceList from "./ReferenceList";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const SIDEBAR_ITEMS = [
  {
    key: "search",
    label: "テーマ探索",
    icon: <SearchIcon fontSize="small" />,
  },
  { key: "paper", label: "論文詳細", icon: <ArticleIcon fontSize="small" /> },
  {
    key: "reference",
    label: "参考文献リスト",
    icon: <MenuBookIcon fontSize="small" />,
  },
];

import type { ApiResponse } from "./apiTypes";

function App() {
  const [activePage, setActivePage] = useState("search");
  const [query, setQuery] = useState("");
  const [apiResult, setApiResult] = useState<ApiResponse | null>(null);

  let content;
  if (activePage === "search")
    content = (
      <SearchTheme
        query={query}
        setQuery={setQuery}
        apiResult={apiResult}
        setApiResult={setApiResult}
      />
    );
  else if (activePage === "paper")
    content = <PaperDetail apiResult={apiResult} />;
  else if (activePage === "reference")
    content = <ReferenceList apiResult={apiResult} />;

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
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onClick={() => setActivePage(item.key)}
                >
                  {item.icon}
                  {item.label}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="app-main">{content}</main>
      </div>
      {/* モバイル用ボトムナビゲーション */}
      <nav className="app-bottom-nav">
        <BottomNavigation
          showLabels
          value={activePage}
          onChange={(_, newValue) => setActivePage(newValue)}
          sx={{
            display: { xs: "flex", sm: "none" },
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100vw",
            zIndex: 100,
            borderTop: "1px solid #ddd",
          }}
        >
          <BottomNavigationAction
            label="テーマ探索"
            value="search"
            icon={<SearchIcon />}
          />
          <BottomNavigationAction
            label="論文詳細"
            value="paper"
            icon={<ArticleIcon />}
          />
          <BottomNavigationAction
            label="参考文献"
            value="reference"
            icon={<MenuBookIcon />}
          />
        </BottomNavigation>
      </nav>
      <footer className="app-footer">
        <small>&copy; 2025 研究テーマ探索AIシステム</small>
      </footer>
    </div>
  );
}

export default App;
