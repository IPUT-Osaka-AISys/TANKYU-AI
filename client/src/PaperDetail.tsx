import React from "react";

const PaperDetail: React.FC = () => {
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
        <p style={{ color: "#888" }}>論文詳細情報がここに表示されます</p>
      </div>
    </section>
  );
};

export default PaperDetail;
