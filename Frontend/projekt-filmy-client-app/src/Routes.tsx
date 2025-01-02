import React from 'react';
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './components/Home_componets/HomePage';
import MoviePage from './components/Home_componets/MoviePage';


export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [{ path: "", element: <HomePage /> },
      {path:"/:id", element:<MoviePage/>}
    ],},
];
  export const router = createBrowserRouter(routes);