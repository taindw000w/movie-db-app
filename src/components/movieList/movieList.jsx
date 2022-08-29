import React from 'react';
import PropTypes from 'prop-types';

import Movie from '../movie-item/movie-item';

const MovieList = ({ movies, onRate }) => {
  const moviesView = movies.map((movie) => {
    return <Movie onRate={onRate} {...movie} key={movie.id} />;
  });

  return (
    <ul className="movie-list">{moviesView}</ul>
  );
};

MovieList.defaultProps = {
  movies: [],
};

MovieList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object),
  onRate: PropTypes.func.isRequired,
};

export default MovieList;