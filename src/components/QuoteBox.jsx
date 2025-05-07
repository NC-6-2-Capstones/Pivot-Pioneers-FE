import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';

const QuoteBox = ({ quote, author, tags = [], onFilter }) => {
  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="body1" gutterBottom>
          “{quote}”
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          <Chip label={author} onClick={() => onFilter(author)} clickable />
          {tags.map((tag, index) => (
            <Chip key={index} label={tag} onClick={() => onFilter(tag)} clickable />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuoteBox;