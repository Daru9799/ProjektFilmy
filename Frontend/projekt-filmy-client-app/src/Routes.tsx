import React from 'react';
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom'
import App from './App'
import "./styles/App.css"
import HomePage from './components/Home_componets/HomePage';
import MoviePage from './components/Home_componets/MoviePage';
import TestPage from './components/Home_componets/TestPage';
import SearchMoviesPage from "./components/SearchMovies_componets/SearchMoviesPage"
import ReviewsPage from './components/Home_componets/ReviewsPage';


export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "search-movies", element: <SearchMoviesPage /> },
      { path: "/:id", element: <MoviePage /> },
      { path: "/test", element: <TestPage /> },
      {path: "/reviews/:id", element:<ReviewsPage/>}
    ],
  },
];
  export const router = createBrowserRouter(routes);