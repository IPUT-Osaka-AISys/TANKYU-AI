import { useState, useEffect } from "react";
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
  {
    key: "paper",
    label: "論文詳細",
    icon: <ArticleIcon fontSize="small" />,
  },
  {
    key: "reference",
    label: "参考文献リスト",
    icon: <MenuBookIcon fontSize="small" />,
  },
];

import type { ApiResponse } from "./apiTypes";

type PaperSelectProps = {
  references: { id: string; title: string }[];
  selectedPaperId: string;
  setSelectedPaperId: (id: string) => void;
};

const PaperSelect: React.FC<PaperSelectProps> = ({
  references,
  selectedPaperId,
  setSelectedPaperId,
}) => (
  <div style={{ marginBottom: "1rem" }}>
    <label>
      論文を選択:
      <select
        value={selectedPaperId}
        onChange={(e) => setSelectedPaperId(e.target.value)}
        style={{ marginLeft: "0.5rem" }}
      >
        <option value="">選択してください</option>
        {references.map((paper) => {
          // crid本体のみ抽出
          let crid = paper.id;
          if (/^https?:\/\//.test(paper.id)) {
            const m = paper.id.match(/crid\/([0-9A-Za-z]+)/);
            crid = m ? m[1] : paper.id;
          } else if (paper.id.startsWith("crid:")) {
            crid = paper.id.replace(/^crid:/, "");
          }
          return (
            <option key={paper.id} value={crid}>
              {paper.title}
            </option>
          );
        })}
      </select>
    </label>
  </div>
);

function App() {
  const [activePage, setActivePage] = useState("search");
  const [query, setQuery] = useState("");
  const [apiResult, setApiResult] = useState<ApiResponse | null>(null);
  const [selectedPaperId, setSelectedPaperId] = useState<string>("");

  useEffect(() => {
    setSelectedPaperId("");
  }, [apiResult]);

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
  else if (
    activePage === "paper" &&
    apiResult &&
    Array.isArray(apiResult.references)
  )
    content = (
      <div>
        <PaperSelect
          references={apiResult.references}
          selectedPaperId={selectedPaperId}
          setSelectedPaperId={setSelectedPaperId}
        />
        {selectedPaperId && <PaperDetail paperId={selectedPaperId} />}
      </div>
    );
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
