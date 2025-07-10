import React from "react";

const ReferenceList: React.FC = () => {
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
        <p style={{ color: "#888" }}>参考文献リストがここに表示されます</p>
      </div>
    </section>
  );
};

export default ReferenceList;
