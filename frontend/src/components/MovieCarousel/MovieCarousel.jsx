import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import MovieCarouselCard from "./MovieCarouselCard";

const MovieCarousel = ({ movies }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Sort movies by releaseDate
  const sortedMovies = [...movies].sort(
    (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
  );

  const moviesToShow = isMobile ? movies : sortedMovies.slice(0, 10);

  return (
    <Box sx={{ position: "relative", maxWidth: "100%", overflow: "hidden" }}>
      {/* Scroll Menu with Navigation Buttons */}
      <ScrollMenu
        LeftArrow={isMobile ? null : LeftArrow}
        RightArrow={isMobile ? null : RightArrow}
        style={{ display: "flex", justifyContent: "space-evenly" }}
      >
        {moviesToShow.map((movie, i) => (
          <Box key={i} sx={{ textAlign: "center" }}>
            <MovieCarouselCard movie={movie} theme={theme} />
          </Box>
        ))}
      </ScrollMenu>
    </Box>
  );
};

// Left Scroll Button Component
const LeftArrow = () => {
  const { scrollPrev } = React.useContext(VisibilityContext);
  return (
    <IconButton
      onClick={() => scrollPrev()}
      sx={{
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        zIndex:999,
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
      }}
    >
      <ArrowBackIos sx={{paddingLeft:"5px", fontSize: "28px"}}/>
    </IconButton>
  );
};

// Right Scroll Button Component
const RightArrow = () => {
  const { scrollNext } = React.useContext(VisibilityContext);
  return (
    <IconButton
      onClick={() => scrollNext()}
      sx={{
        position: "absolute",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
      }}
    >
      <ArrowForwardIos />
    </IconButton>
  );
};

export default MovieCarousel;