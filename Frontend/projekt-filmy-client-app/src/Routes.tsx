import React from 'react';
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom'
import App from './App'
import "./styles/App.css"
import HomePage from './components/Home_componets/HomePage';
import MoviePage from './components/Movie_componets/MoviePage';
import TestPage from './components/Home_componets/TestPage';
import SearchMoviesPage from "./components/SearchMovies_componets/SearchMoviesPage"
import SearchDirectorsPage from "./components/SearchDirectors_componets/SearchDirectorsPage";
import SearchActorsPage from "./components/SearchActors_componets/SearchActorsPage";
import ReviewsPage from './components/review_components/ReviewsPage';
import UserPage from './components/User_componets/UserPage';
import DirectorPage from './components/Home_componets/DirectorPage';
import ActorPage from './components/Home_componets/ActorPage';



export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "search-movies", element: <SearchMoviesPage /> },
      { path: "search-directors", element: <SearchDirectorsPage /> },
      { path: "search-actors", element: <SearchActorsPage /> },
      { path: "/:movieId", element: <MoviePage /> },
      { path: "/test", element: <TestPage /> },
      { path: "/reviews/:movieId", element: <ReviewsPage /> },
      { path: "/user/:userId", element: <UserPage /> },
      { path: "/actor/:actorId", element: <ActorPage /> },
      { path: "/director/:directorId", element: <DirectorPage /> },
    ],
  },
];
  export const router = createBrowserRouter(routes);