import React from 'react';
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './components/Home_componets/HomePage';


export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [{ path: "", element: <HomePage /> }],
  },
];
  export const router = createBrowserRouter(routes);