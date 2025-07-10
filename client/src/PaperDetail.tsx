import React from "react";

import type { ApiResponse } from "./apiTypes";

type PaperDetailProps = {
  apiResult: ApiResponse | null;
};

const PaperDetail: React.FC<PaperDetailProps> = ({ apiResult }) => {
  return (
    <section>
      <h2>論文詳細</h2>
      <div
        style={{
          background: "#f3f6fa",
          padding: "2rem",
          borderRadius: "8px",
          minHeight: "120px",
        }}
      >
        {apiResult && apiResult.results.length > 0 ? (
          <ul>
            {apiResult.results.map((paper) => (
              <li key={paper.id}>
                <div>
                  <b>{paper.title}</b>（{paper.year}年, {paper.author}）
                </div>
                <div>要約: {paper.summary}</div>
                <div>抄録: {paper.abstract}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#888" }}>論文詳細情報がここに表示されます</p>
        )}
      </div>
    </section>
  );
};

export default PaperDetail;
