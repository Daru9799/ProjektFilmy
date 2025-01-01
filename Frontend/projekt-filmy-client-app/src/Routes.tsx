import React from 'react';
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom'
import App from './App'


export const routes: RouteObject[] = [
    {
      path: "/",
      element: <App />,
      children: [
        
      ],
    },
  ];
  export const router = createBrowserRouter(routes);