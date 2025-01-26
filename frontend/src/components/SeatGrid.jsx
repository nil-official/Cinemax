import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

const SeatGrid = ({ seats }) => {
  // Function to check if a seat is visible
  const isSeatVisible = (seat) => seat.row !== null && seat.col !== null;

  // Generate a 10x10 grid
  const grid = Array.from({ length: 10 }, (_, rowIndex) => {
    return Array.from({ length: 10 }, (_, colIndex) => {
      const rowLetter = (rowIndex + 1).toString();
      const colLetter = String.fromCharCode(65 + colIndex); // Convert 0-9 to 'A'-'J'
      const seat = seats.find(
        (seat) => seat.row === rowLetter && seat.col === colLetter
      );

      if (seat && isSeatVisible(seat)) {
        return (
          <Box
            key={`${rowLetter}${colLetter}`}
            sx={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ddd',
              backgroundColor: '#f5f5f5',
              fontSize: '14px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#ddd',
              },
            }}
          >
            {seat.index}
          </Box>
        );
      }
      // Empty/Invisible seat
      return (
        <Box
          key={`${rowLetter}${colLetter}`}
          sx={{ width: '40px', height: '40px' }}
        />
      );
    });
  });

  return (
    <Box>
      {/* Row labels */}
      {grid.map((row, rowIndex) => (
        <Box
          key={`row-${rowIndex}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            mb: '8px',
          }}
        >
          {/* Row label */}
          <Typography
            sx={{
              width: '20px',
              textAlign: 'center',
              mr: '4px',
              color: '#333',
            }}
          >
            {rowIndex + 1}
          </Typography>

          {/* Grid row */}
          <Grid container spacing={0}>
            {row.map((seatBox, colIndex) => (
              <Grid item key={`col-${colIndex}`}>
                {seatBox}
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default SeatGrid;