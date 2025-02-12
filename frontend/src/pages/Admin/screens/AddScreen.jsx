import React, { useEffect, useState } from 'react';
import axios from '../../../axiosConfig';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  CircularProgress, 
  Grid 
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const AddScreen = () => {
  const [name, setName] = useState('');
  const [layout, setLayout] = useState([{ category: '', price: '', rows: [{ row: '', seats: [''] }] }]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the screen ID from the URL

  useEffect(() => {
    if (id) {
      fetchScreenData();
    }
  }, [id]);

  const fetchScreenData = async () => {
    try {
      const response = await axios.get(`/screens/${id}`);
      const screenData = response.data;
      setName(screenData.name);
      setLayout(screenData.layout);
      setIsEditing(true);
    } catch (error) {
      toast.error('Error fetching screen data: ' + error.message);
    }
  };

  const handleLayoutChange = (index, field, value) => {
    const newLayout = [...layout];
    if (field === 'category' || field === 'price') {
      newLayout[index][field] = value;
    }
    setLayout(newLayout);
  };

  const handleAddRow = (index) => {
    const newLayout = [...layout];
    newLayout[index].rows.push({ row: '', seats: [''] });
    setLayout(newLayout);
  };

  const handleDeleteRow = (layoutIndex, rowIndex) => {
    const newLayout = [...layout];
    newLayout[layoutIndex].rows.splice(rowIndex, 1);
    setLayout(newLayout);
  };

  const handleAddLayout = () => {
    setLayout([...layout, { category: '', price: '', rows: [{ row: '', seats: [''] }] }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        // Update existing screen
        const response = await axios.put(`/screens/${id}`, { name, layout });
        toast.success("Screen updated successfully");
      } else {
        // Add new screen
        const response = await axios.post('/screens', { name, layout });
        toast.success("Screen added successfully");
      }
      navigate('/admin/screens');
    } catch (error) {
      toast.error('Error saving screen: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {isEditing ? 'Edit Screen' : 'Add New Screen'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField 
            label="Screen Name" 
            variant="outlined" 
            fullWidth 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </Box>

        {layout.map((layoutItem, index) => (
          <Box key={index} sx={{ mb: 4, border: '1px solid #ccc', padding: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Layout {index + 1}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Category" 
                  variant="outlined" 
                  fullWidth 
                  value={layoutItem.category} 
                  onChange={(e) => handleLayoutChange(index, 'category', e.target.value)} 
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Price" 
                  variant="outlined" 
                  type="number" 
                  fullWidth 
                  value={layoutItem.price} 
                  onChange={(e) => handleLayoutChange(index, 'price', e.target.value)} 
                  required 
                />
              </Grid>
            </Grid>
            {layoutItem.rows.map((rowItem, rowIndex) => (
              <Box key={rowIndex} sx={{ mt: 2 }}>
                <TextField 
                  label={`Row ${rowIndex + 1}`} 
                  variant="outlined" 
                  fullWidth 
                  value={rowItem.row} 
                  onChange={(e) => {
                    const newLayout = [...layout];
                    newLayout[index].rows[rowIndex].row = e.target.value;
                    setLayout(newLayout);
                  }} 
                  required 
                />
                <TextField 
                  sx={{ mt: 2 }}
                  label="Seats (comma separated)" 
                  variant="outlined" 
                  fullWidth 
                  value={rowItem.seats.join(', ')} 
                  onChange={(e) => {
                    const seats = e.target.value.split(',').map(seat => seat.trim());
                    const newLayout = [...layout];
                    newLayout[index].rows[rowIndex].seats = seats;
                    setLayout(newLayout);
                  }} 
                  required 
                />
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => handleDeleteRow(index, rowIndex)} 
                  sx={{ mt: 2 }}
                >
                  Delete Row
                </Button>
              </Box>
            ))}
            <Button variant="outlined" onClick={() => handleAddRow(index)} sx={{ mt: 2 }}>
              Add Row
            </Button>
          </Box>
        ))}
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: 2, 
            mt: 4
        }}>
          <Button variant="outlined" onClick={handleAddLayout}>
            Add Layout
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : isEditing ? 'Update Screen' : 'Add Screen'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddScreen;