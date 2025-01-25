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
                    {Array.from({ length: 10 }, (_, rowIndex) =>
                        // Array.from({ length: 10 }, (_, colIndex) => `${rowIndex * 10 + colIndex + 1},`)
                        <Grid item container key={rowIndex} spacing={1} justifyContent="center" style={{ flexWrap: 'nowrap' }}>
                            {Array.from({ length: 10 }, (_, colIndex) => {
                                const seat = screen.seats.find(seat => seat.row === rowIndex && seat.col === colIndex);
                                return (
                                    <Grid item key={colIndex}>
                                        <Box
                                            sx={{
                                                width: '30px',
                                                height: '30px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                backgroundColor:'#9e9e9e'
                                            }}
                                            id={`S${rowIndex * 10 + colIndex + 1}`}
                                        >
                                            {rowIndex * 10 + colIndex + 1}
                                        </Box>
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