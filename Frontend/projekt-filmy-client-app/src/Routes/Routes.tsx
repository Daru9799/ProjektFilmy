import { RouteObject, createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from './HomePage';
import MoviePage from '../components/MoviePage_components/MoviePage';
import SearchMoviesPage from "../components/SearchMovies_componets/SearchMoviesPage"
import SearchDirectorsPage from "./SearchDirectorsPage";
import SearchActorsPage from "./SearchActorsPage";
import ReviewsPage from '../components/review_components/ReviewsPage';
import UserPage from '../components/User_componets/UserPage';
import PersonPage from './PersonPage';
import UserReviewsPage from '../components/User_componets/UserReviews';
import AllAchievements from '../components/Achievements_components/AllAchievements';
import UserAchievements from '../components/Achievements_components/UserAchievements';
import UserStatistics from '../components/User_componets/UserStatistics';
import FriendsPage from '../components/Friends_components/FriendsPage';
import BlockedPage from '../components/Blocked_components/BlockedPage';
import NotificationPage from '../components/Notifications_components/NotificationsPage';
import CreateMovieCollection from '../components/CreateMovieCollection_components/CreateMovieCollection';
import NotFoundPage from './NotFoundPage';



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
      { path: "/:movieId/reviews", element: <ReviewsPage /> },
      { path: "user/:userName", element: <UserPage /> },
      { path: "people/:id", element: <PersonPage /> },
      { path: "user/:userName/reviews", element: <UserReviewsPage /> },
      { path: "achievements", element:<AllAchievements/>},
      { path: "user/:userName/friends", element: <FriendsPage /> },
      { path: "user/achievements/:userName",element:<UserAchievements/>},
      { path: "users/statistics/:userName", element:<UserStatistics/>},
      { path: "user/:userName/moviecollection/create", element:<CreateMovieCollection/>},
      { path: "user/:userName/blocked", element:<BlockedPage/>},
      { path: "notifications", element: <NotificationPage />},

      //Strona 404
      { path: "404", element: <NotFoundPage /> }, //Do przenoszenia w odpowiednich miejscach
      { path: "*", element: <NotFoundPage /> } //Pod ścieżki typu /test/test/test
    ],
  },
];
export const router = createBrowserRouter(routes);