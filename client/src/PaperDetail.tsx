import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import type { ApiResponse } from "./apiTypes";

type PaperDetailProps = {
  apiResult: ApiResponse | null;
};

const PaperDetail: React.FC<PaperDetailProps> = ({ apiResult }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        論文詳細
      </Typography>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, minHeight: 120 }}>
        {apiResult && apiResult.results.length > 0 ? (
          <List>
            {apiResult.results.map((paper) => (
              <ListItem key={paper.id} alignItems="flex-start" sx={{ mb: 2 }}>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold">
                      {paper.title}（{paper.year}年, {paper.author}）
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        <b>要約:</b> {paper.summary}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>抄録:</b> {paper.abstract}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
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
