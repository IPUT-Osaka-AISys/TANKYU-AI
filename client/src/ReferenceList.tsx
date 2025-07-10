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

type ReferenceListProps = {
  apiResult: ApiResponse | null;
};

const ReferenceList: React.FC<ReferenceListProps> = ({ apiResult }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        参考文献リスト
      </Typography>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, minHeight: 120 }}>
        {apiResult && apiResult.references.length > 0 ? (
          <List>
            {apiResult.references.map((ref) => (
              <ListItem key={ref.id}>
                <ListItemText
                  primary={
                    <Typography>
                      {ref.title}（{ref.year}年, {ref.author}）
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">
            参考文献リストがここに表示されます
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ReferenceList;
