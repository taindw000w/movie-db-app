import React from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';

// import './movie-footer.css';

export default class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overview: props.overview,
      rating: props.rating,
    };
  }

  truncateDescription = (description) => {
    if (typeof description === 'undefined') {
      return '';
    }
    const indexOfSpaceAfterTruncate = description.indexOf(' ', 200);
    return description.slice(0, indexOfSpaceAfterTruncate).concat('…');
  };

  componentDidUpdate = (prevProps) => {
    const { rating } = this.props;
    if (rating !== prevProps.rating) {
      this.setState({
        rating,
      });
    }
  };
  render() {
    const { overview, rating } = this.state;

    const { id, onRate } = this.props;

    return (
      <div className="movie-footer movie-stats">
        <p className="movie-description">{this.truncateDescription(overview)}</p>
        <Rate count={10} allowHalf onChange={(value) => onRate(value, id)} value={rating} className="movie-rate" />
      </div>
    );
  }
}

Movie.defaultProps = {
  rating: 0,
};

Movie.propTypes = {
  overview: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  rating: PropTypes.number,
  onRate: PropTypes.func.isRequired,
};
