import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, CircularProgress, Link } from "@mui/material";

type PaperDetailProps = {
  paperId: string;
};

type PaperDetailData = {
  id: string;
  title: string;
  author: string;
  year: string;
  abstract: string;
  url: string;
};

const PaperDetail: React.FC<PaperDetailProps> = ({ paperId }) => {
  const [data, setData] = useState<PaperDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paperId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3001/paper/${encodeURIComponent(paperId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("論文詳細取得に失敗しました");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [paperId]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        論文詳細
      </Typography>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, minHeight: 120 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
            <Typography>読み込み中...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error">
            {error.includes("404") ? "論文が見つかりません" : error}
          </Typography>
        ) : data ? (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {data.title}
            </Typography>
            <Typography>
              <b>著者:</b> {data.author || "不明"}
            </Typography>
            <Typography>
              <b>出版年:</b> {data.year || "不明"}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <b>抄録:</b> {data.abstract || "（抄録情報なし）"}
            </Typography>
            {data.url && (
              <Box sx={{ mt: 2 }}>
                <Link href={data.url} target="_blank" rel="noopener">
                  CiNiiで詳細を見る
                </Link>
              </Box>
            )}
          </Box>
        ) : (
          <Typography color="text.secondary">
            論文詳細情報がここに表示されます
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default PaperDetail;
