import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchShowtimes, selectShowtime } from '../store/actions/showtimes';
import { isoDateConverter as convert } from '../utils/isoDateConverter';

const Showtimespage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { movieId } = useParams();

    const { showtimes, selectedShowtime, status, error } = useSelector((state) => state.showtimeState);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchShowtimes(movieId));
        }
    }, [status, dispatch]);

    useEffect(() => {
        if(selectedShowtime){
            navigate(`/movie/${movieId}/showtimes/${selectedShowtime._id}/seatlayout`);
        }
    }, [selectedShowtime, navigate, movieId]);

    const handleShowtimeSelect = (showtime) => {
        dispatch(selectShowtime(showtime));
        
    }

    return (
        <div>
            {status === 'loading' && <p>Loading...</p>}
            <div>Status: {status}</div>
            {showtimes.map((showtime) => (
                <div style={{cursor: 'pointer'}} key={showtime.id} onClick={() => handleShowtimeSelect(showtime)}>
                    <p>{convert(showtime.startAt)} - {convert(showtime.endAt)} -- {showtime.screenId}</p>
                    <p></p>
                </div>
            ))}
            {/* <div>Selected showtime: {selectedShowtime}</div> */}
        </div>
    )
}

export default Showtimespage