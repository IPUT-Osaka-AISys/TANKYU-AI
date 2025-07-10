import React from "react";

import type { ApiResponse } from "./apiTypes";

type ReferenceListProps = {
  apiResult: ApiResponse | null;
};

const ReferenceList: React.FC<ReferenceListProps> = ({ apiResult }) => {
  return (
    <section>
      <h2>参考文献リスト</h2>
      <div
        style={{
          background: "#f3f6fa",
          padding: "2rem",
          borderRadius: "8px",
          minHeight: "120px",
        }}
      >
        {apiResult && apiResult.references.length > 0 ? (
          <ul>
            {apiResult.references.map((ref) => (
              <li key={ref.id}>
                {ref.title}（{ref.year}年, {ref.author}）
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#888" }}>参考文献リストがここに表示されます</p>
        )}
      </div>
    </section>
  );
};

export default ReferenceList;
