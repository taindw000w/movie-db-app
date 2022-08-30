import React from 'react';
import { Input, Spin, Alert, Pagination, Tabs } from 'antd';
import { debounce } from 'lodash';

import { MovieList } from '../movieList/movieList';
import TmdbService from '../services/services';
import { TmdbServiceProvider } from '../tmdb-service-context';

import '../../../node_modules/antd/dist/antd.css';
import './app.css';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      queryRatedMoviesPage: 1,
      searchString: '',
      movies: [],
      ratedMovies: [],
      queryRatedMovies: [],
      totalResults: 0,
      ratedCount: 0,
      totalQueryRatingResults: 0,
      isLoading: false,
      error: false,
      message: '',
    };
  }

  handleError = (error) => {
    const { searchString } = this.state;
    this.setState({
      searchString,
      currentPage: 1,
      movies: [],
      totalResults: 0,
      isLoading: false,
      error: true,
      message: error.message,
    });
  };

  getRatingById = (id) => {
    const { ratedMovies } = this.state;
    if (ratedMovies.length === 0) {
      return 0;
    }

    const index = ratedMovies.findIndex((movie) => movie.id === id);
    if (index > -1) {
      return ratedMovies[index].id;
    }
    return 0;
  };

  search = async (page = 1) => {
    const { movies, searchString } = this.state;
    if (!searchString) {
      this.setState({
        searchString: '',
        currentPage: page,
        movies: [],
        totalResults: 0,
        isLoading: false,
        error: false,
        message: '',
      });
      return;
    }

      this.setState({
        currentPage: page,
        searchString,
        movies,
        totalResults: 0,
        isLoading: true,
        error: false,
        message: '',
      });

      try {
        const response = await this.tmdbService.searchMovies(searchString, page, 'en-US', false);
        const results = await response.results;
        const totalResults = await response.totalResults;
        const moviesWithRating = await results.map((movie) => {
          return {
            ...movie,
            rating: this.getRatingById(movie.id),
          };
        });

        if (totalResults === 0) {
          if (page > 1) {
            this.setState({
              movies: [],
              searchString,
              currentPage: page,
              totalResults: 0,
              isLoading: false,
              error: false,
              message: '',
            });
          } else {
            this.setState({
              movies: [],
              searchString,
              currentPage: page,
              totalResults,
              isLoading: false,
              error: true,
              message: 'Фильм не найден',
            });
          }
        } else {
          this.setState({
            movies: moviesWithRating,
            searchString,
            currentPage: page,
            totalResults,
            isLoading: false,
            error: false,
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    };

  componentDidMount = async () => {
    this.tmdbService = new TmdbService();

    this.debouncedSearch = debounce(this.search, 500);
    const allMovieGenresObject = await this.tmdbService.getAllGenres();
    this.allMovieGenres = await allMovieGenresObject.genres;
  };

  onSearchStringChange = (event) => {
    if (!event) {
      return;
    }

    this.setState({
      currentPage: 1,
      searchString: event.currentTarget.value,
      totalResults: 0,
    });

    this.debouncedSearch();
  };

  findIndexByID = (array, id) => {
    if (typeof array === 'undefined') {
      return null;
    }
    return array.findIndex((movie) => movie.id === id);
  };

  changeRating = (value, index, moviesPropertyName) => {
    this.setState((state) => {
      const modifiedMovie = {
        ...state[moviesPropertyName][index],
        rating: value,
      };

      const modifieMovies = [
        ...state[moviesPropertyName].slice(0, index),
        modifiedMovie,
        ...state[moviesPropertyName].slice(index + 1),
      ];

      return {
        [moviesPropertyName]: modifieMovies,
      };
    });
  };

  getMovieById = (id) => {
    const { movies } = this.state;
    const index = this.findIndexByID(movies, id);

    return movies[index];
  };

  addRatedMovie = (value, id) => {
    const newRatedMovie = this.getMovieById(id);
    newRatedMovie.rating = value;

    this.setState((state) => {
      const newRatedMovies = [...state.ratedMovies, newRatedMovie];

      return {
        ratedMovies: newRatedMovies,
        ratedCount: state.ratedCount + 1
      };
    });
  };

  handleRate = (value, id) => {
    this.tmdbService.rate(value, id);
    const { ratedMovies, movies } = this.state;
    const index = this.findIndexByID(ratedMovies, id);

    if (index === null || index === -1) {
        this.addRatedMovie(value, id);
    } else {
      this.changeRating(value, index, 'ratedMovies');
      const indexInMovies = this.findIndexByID(movies, id);
      this.changeRating(value, indexInMovies, 'movies');
    }
  };

  getQueryRatedMovies = async (page = 1) => {
    const responseJson = await this.tmdbService.getRatedMovies();
    try {
      const queryRatedMovies =       await responseJson.results;
      const totalQueryRatingResults = await responseJson.total_results;
      this.setState({
        queryRatedMovies,
        totalQueryRatingResults,
        queryRatedMoviesPage: page,          
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error: true,
        message: error,
      });        
    }
  };

  changePaginationRating = () => {
    
  }

  handleTabChange = (activeKey) => {
    if (activeKey === "3") {
      this.getQueryRatedMovies();
    }
  };
  

  render() {
    const {
      error,
      isLoading,
      message,
      movies,
      totalQueryRatingResults,
      queryRatedMovies,
      queryRatedMoivesPage,
      searchString,
      currentPage,
      totalResults,
      ratedMovies,
      ratedCount,
    } = this.state;

    const spinner = isLoading ? <Spin /> : null;
    const alert = error ? <Alert message={message} type="error" /> : null;
    const hasData = !(isLoading || error || movies === []);
    const didSearch = isLoading || error || movies !== [];
    const data = hasData && didSearch ? <MovieList movies={movies} onRate={this.handleRate} /> : null;

    const ratedData = ratedMovies === [] ? null : <MovieList onRate={this.handleRate} movies={ratedMovies} />;
    const queryRatedData = queryRatedMovies === [] ? null : <MovieList onRate={this.handleRate} movies={queryRatedMovies} />;
    const { TabPane } = Tabs;

    return (
      <div className="app">
        <TmdbServiceProvider value={this.allMovieGenres}>
          <Tabs defaultActiveKey="1" className="center-layout" onChange={this.handleTabChange}>
            <TabPane tab="Search" key="1" className="center-layout">
              <Input.Search
                placeholder="Type to search…"
                size="small"
                onChange={this.onSearchStringChange}
                value={searchString}
                className="search-bar"
              />
              { spinner }
              { alert }
              { data }
              <Pagination
                current={currentPage}
                pageSize={20}
                responsive
                onChange={this.search}
                total={totalResults}
                showSizeChanger={false}
              />
            </TabPane>
            <TabPane tab="Rated" key="2" className="center-layout">
              { ratedData }
              { (ratedData > 20) ? <Pagination  
                responsive 
                pageSize={100} 
                total={ratedCount} 
                changePaginationRating={this.changePaginationRating}
              /> 
              : <Pagination
                pageSize={20}
                responsive
                total={ratedCount}
                showSizeChanger={false}
              /> } 
              {/* <Pagination
                pageSize={20}
                responsive
                total={ratedCount}
                showSizeChanger={false}
              /> */}
            </TabPane>
          </Tabs>
        </TmdbServiceProvider>
      </div>
    );
  }
}


