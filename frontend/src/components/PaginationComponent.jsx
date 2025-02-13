import React from 'react';
import { Box, Pagination } from '@mui/material';

const PaginationComponent = ({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  // Calculate item ranges
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      mt: 4, 
      mb: 4,
      '& .MuiPagination-ul': { 
        justifyContent: 'center' 
      } 
    }}>
      <Pagination 
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default PaginationComponent;