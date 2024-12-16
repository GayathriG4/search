import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";

const API_KEY = "d3bd82df"; //OMDb API Key
const API_URL = "https://www.omdbapi.com/";

const Home = ({ fetchMovies }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [movieType, setMovieType] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(searchQuery || "Avengers", 1, movieType, setMovies, setError);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    fetchMovies(searchQuery || "Avengers", page, movieType, setMovies, setError);
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-6">
      <h1 className="text-center text-3xl font-bold mb-6">Movies Search App</h1>
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6"
      >
        <input
          type="text"
          placeholder="Search for movies..."
          className="p-2 rounded-md w-full md:w-1/2 text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-2 rounded-md text-black"
          value={movieType}
          onChange={(e) => setMovieType(e.target.value)}
        >
          <option value="">All</option>
          <option value="movie">Movies</option>
          <option value="series">Series</option>
          <option value="episode">Episodes</option>
        </select>
        <button
          type="submit"
          className="p-2 bg-blue-500 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="bg-gray-800 p-4 rounded shadow hover:shadow-lg cursor-pointer"
          >
            <Link to={`/movie/${movie.imdbID}`}>
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-64 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-bold">{movie.Title}</h3>
              <p>{movie.Year}</p>
            </Link>
          </div>
        ))}
      </div>

      {movies.length > 0 && (
        <div className="flex justify-center mt-6 gap-4">
          {currentPage > 1 && (
            <button
              className="p-2 bg-blue-500 rounded hover:bg-blue-700"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          )}
          <button
            className="p-2 bg-blue-500 rounded hover:bg-blue-700"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const MoviesList = ({ fetchMovies }) => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const { type } = useParams();

  useEffect(() => {
    fetchMovies("", 1, type || "", setMovies, setError);
  }, [type]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-6">
      <h1 className="text-center text-3xl font-bold mb-6">{type ? `${type[0].toUpperCase() + type.slice(1)} List` : "All Movies"}</h1>
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="bg-gray-800 p-4 rounded shadow hover:shadow-lg cursor-pointer"
          >
            <Link to={`/movie/${movie.imdbID}`}>
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-64 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-bold">{movie.Title}</h3>
              <p>{movie.Year}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const MovieDetail = ({ fetchMovieDetails }) => {
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { id: movieId } = useParams();
  
    useEffect(() => {
      fetchMovieDetails(movieId, setMovie, setError);
    }, [movieId]);
  
    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }
  
    if (!movie) {
      return <p className="text-center text-white">Loading movie details...</p>;
    }
  
    return (
      <div className="movie-detail-container">
        <button onClick={() => navigate(-1)} className="mb-4">
          Back to Results
        </button>
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="rounded-lg"
        />
        <h2 className="text-3xl font-bold">{movie.Title}</h2>
        <p>
          <strong>Year:</strong> {movie.Year}
        </p>
        <p>
          <strong>Genre:</strong> {movie.Genre}
        </p>
        <p>
          <strong>Director:</strong> {movie.Director}
        </p>
        <p>
          <strong>Actors:</strong> {movie.Actors}
        </p>
        <p>
          <strong>Plot:</strong> {movie.Plot}
        </p>
        <p>
          <strong>IMDB Rating:</strong> {movie.imdbRating}
        </p>
      </div>
    );
  };   

const App = () => {
  const fetchMovies = async (query, page, type, setMovies, setError) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          apikey: API_KEY,
          s: query || "Avengers",
          type,
          page,
        },
      });

      if (response.data.Response === "True") {
        setMovies(response.data.Search);
        setError("");
      } else {
        setMovies([]);
        setError(response.data.Error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      console.error(err);
    }
  };

  const fetchMovieDetails = async (id, setMovie, setError) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          apikey: API_KEY,
          i: id,
          plot: "full",
        },
      });

      if (response.data.Response === "True") {
        setMovie(response.data);
        setError("");
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      console.error(err);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home fetchMovies={fetchMovies} />} />
        <Route path="/movies" element={<MoviesList fetchMovies={fetchMovies} />} />
        <Route path="/:type" element={<MoviesList fetchMovies={fetchMovies} />} />
        <Route path="/movie/:id" element={<MovieDetail fetchMovieDetails={fetchMovieDetails} />} />
      </Routes>
    </Router>
  );
};

export default App;
