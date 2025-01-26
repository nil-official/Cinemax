import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchScreen } from '../store/actions/screens';
import { isoDateConverter as convert } from '../utils/isoDateConverter';
import SeatGrid from '../components/SeatGrid';
import { Grid, Box } from '@mui/material';

const SeatLayoutpage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { movieId, showtimeId } = useParams();

    const { screen, status, error } = useSelector((state) => state.screenState);
    const { selectedShowtime } = useSelector((state) => state.showtimeState);

    // for temp use
    const rows = 10;
    const cols = 10;

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchScreen(selectedShowtime.screenId));
        }
    }, [status, dispatch]);

    // show the movie name, showtime, screen type 

    return (
        <div>
            {status === 'loading' && <p>Loading...</p>}
            {
                status === 'succeeded' && screen &&

                <Grid container direction="column" spacing={1} justifyContent="center" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
                    {// For each row, create a row of seats
                        Array.from({ length: rows }, (_, rowIndex) =>
                            <Grid item container key={rowIndex} spacing={1} justifyContent="center" style={{ flexWrap: 'nowrap' }}>
                                {Array.from({ length: cols }, (_, colIndex) => {
                                    const currIndex = rowIndex * cols + colIndex;
                                    console.log(screen.seats[currIndex]);
                                    
                                    return (
                                        <Grid item key={colIndex}>
                                            {screen.seats[currIndex].row !== null ?
                                            <Box
                                                sx={{
                                                    width: '30px',
                                                    height: '30px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    backgroundColor:'#111',
                                                    padding: '5px',
                                                    fontSize: '12px',
                                                }}
                                                id={`S${rowIndex * cols + colIndex + 1}`}
                                            >
                                                {screen.seats[currIndex].row}{screen.seats[currIndex].col}
                                            </Box>
                                            :
                                            <Box
                                                sx={{
                                                    width: '30px',
                                                    height: '30px',
                                                }}
                                                id={`S${rowIndex * cols + colIndex + 1}`}
                                            >
                                            </Box>
                                            }
                                        </Grid>
                                    )
                                })}
                            </Grid>

                        )}
                </Grid>
            }

        </div>
    )
}

export default SeatLayoutpage