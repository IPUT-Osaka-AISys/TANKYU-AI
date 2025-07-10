import React from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
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
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        テーマ探索
      </Typography>
      <Box
        component="form"
        sx={{ display: "flex", gap: 2, mb: 3 }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="キーワードや自然文を入力"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ minWidth: 120 }}
          disabled={loading || !query}
        >
          {loading ? "検索中..." : "検索"}
        </Button>
      </Box>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, minHeight: 120 }}>
        {apiError ? (
          <Typography color="error">{apiError}</Typography>
        ) : apiResult ? (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              テーマ推薦
            </Typography>
            <List dense>
              {apiResult.themes.map((theme, i) => (
                <ListItem key={i} disablePadding>
                  <ListItemText primary={theme} />
                </ListItem>
              ))}
            </List>
            <Box mt={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                分類
              </Typography>
              <Typography>{apiResult.categories.join(", ")}</Typography>
            </Box>
          </Box>
        ) : (
          <Typography color="text.secondary">
            検索結果がここに表示されます
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default SearchTheme;
