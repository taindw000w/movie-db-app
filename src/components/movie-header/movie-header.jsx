import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import './movie-header.css';

import { TmdbServiceConsumer } from '../tmdb-service-context';

export class MovieHeader extends React.Component {
  constructor(props) {
    super(props);

    this.getVoteColorClass = (vote) => {
      if (vote < 3) {
        return 'voteBad';
      }

      if (vote < 5) {
        return 'votePoor';
      }

      if (vote < 7) {
        return 'voteGood';
      }

      return 'voteAwesome';
    };
  }

  getGenreNames = (genreIds, allMovieGenres) => {
    return genreIds.map((id) => {
      return allMovieGenres.map((genre) => {
        if (genre.id === id) {
          return <span className="movie-genre">{genre.name}</span>;
        }
        return '';
      });
    });
  };

  render() {
    const { originalTitle, releaseDate, voteAverage, genreIds } = this.props;

    const voteClasses = 'voteAverage '.concat(this.getVoteColorClass(voteAverage));

    let dateFormatted;
    try {
      dateFormatted = format(new Date(releaseDate), 'MMMM d, yyyy');
    } catch (error) {
      dateFormatted = '';
    }

    return (
      <TmdbServiceConsumer>
        {(allMovieGenres) => {
          return (
            <div className="movie-stats">
              <div className="movie-header">
                <h5 className="title">{originalTitle}</h5>
                <span className={voteClasses}>{voteAverage}</span>
              </div>
              <p className="movie-date">{dateFormatted}</p>
              <div className="movie-genres">{this.getGenreNames(genreIds, allMovieGenres)}</div>
            </div>
          );
        }}
      </TmdbServiceConsumer>
    );
  }
}

MovieHeader.defaultProps = {
  releaseDate: '',
  voteAverage: 0,
  genreIds: [],
};

MovieHeader.propTypes = {
  originalTitle: PropTypes.string.isRequired,
  releaseDate: PropTypes.string,
  voteAverage: PropTypes.number,
  genreIds: PropTypes.arrayOf(PropTypes.number),
};
