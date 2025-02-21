import React, { useEffect, useState } from 'react';
import axios from '../../../axiosConfig';
import {
  Container,
  Grid2,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DeleteButton from '../../../components/DeleteButton/DeleteButton';
import { format, parse } from 'date-fns';

const ScreenList = () => {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    try {
      const response = await axios.get('/screens');
      setScreens(response.data.screens);
    } catch (error) {
      toast.error('Error fetching screens: ');
    } finally {
      setLoading(false);
    }
  };

  const deleteScreen = async (screenId) => {
    try {
      const response = await axios.delete(`/screens/${screenId}`);
      setScreens((prevScreens) => prevScreens.filter(screen => screen._id !== screenId));
      toast.success("Screen deleted successfully");
    } catch (error) {
      toast.error('Error deleting screen: ');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      sx={{
        mt: 4,
        mb: 8,
        width: "100vw",
        height: "100vh"
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: 4
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '2rem',
              md: '2.25rem'
            }
          }}
        >
          Manage Screens
        </Typography>
        <Button
          component={Link}
          to="/admin/screens/add"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            width: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4],
              transition: 'all 0.2s ease-in-out'
            }
          }}
        >
          {isMobile ? 'Add' : 'Add Screen'}
        </Button>
      </Box>

      {screens.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
          No screens found
        </Typography>
      ) : (
        <>
          <Grid2 container spacing={5}>
            {screens.map((screen) => (
              <Grid2 xs={12} sm={6} md={4} key={screen._id}>
                <Card
                  sx={{
                    height: '100%',
                    minWidth: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 3,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <CardContent sx={{ padding: '16px' }}>
                    <Typography variant="h5" sx={{ textTransform: 'uppercase', mb: 1, fontSize: '2rem', fontWeight: 'bolder' }}>
                      {screen.name.length > 20 ? `${screen.name.slice(0, 20)}...` : screen.name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant='body1' color="text.main" sx={{ fontSize: '1.2rem' }}>
                        Layout:
                      </Typography>
                      {screen.layout.map((item, key) => (
                        <Typography key={key} variant="body2" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
                          {`${item.category} - ₹${item.price}`}
                        </Typography>
                      ))}
                    </Box>
                    <Box>
                      <Typography variant='body1' color="text.main" sx={{ fontSize: '1.2rem' }}>
                        Time Slots:
                      </Typography>
                      {screen.timeSlots.map((time, key) => (
                        <Typography key={key} variant="body2" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
                          {format(parse(time, "HH:mm", new Date()), "hh:mm a")}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/admin/screens/edit/${screen._id}`}
                      startIcon={<Edit />}
                      size="small"
                    >
                      Edit
                    </Button>
                    {/* <IconButton 
                      color="error" 
                      onClick={() => deleteScreen(screen._id)}
                      aria-label="delete screen"
                      size="small"
                    >
                      <Delete />
                    </IconButton> */}
                    <DeleteButton onDelete={() => deleteScreen(screen._id)} itemName={screen.name} />
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </>
      )}
    </Container>
  );
};

export default ScreenList;