import { RouteObject, createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from './HomePage';
import MoviePage from './MoviePage';
import SearchMoviesPage from "./SearchMoviesPage"
import SearchDirectorsPage from "./SearchDirectorsPage";
import SearchActorsPage from "./SearchActorsPage";
import ReviewsPage from './ReviewsPage';
import UserPage from './UserPage';
import PersonPage from './PersonPage';
import UserReviewsPage from '../components/User_componets/UserReviews';
import AllAchievements from './AllAchievementsPage';
import UserAchievements from './UserAchievementsPage';
import UserStatistics from '../components/User_componets/UserStatistics';
import FriendsPage from './FriendsPage';
import BlockedPage from './BlockedPage';
import NotificationPage from './NotificationsPage';
import CreateMovieCollection from '../components/CreateMovieCollection_components/CreateMovieCollection';
import NotFoundPage from './NotFoundPage';
import ReviewRepliesPage from './ReviewRepliesPage';
import MovieCollectionPage from './MovieCollectionPage';



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
      {
        path: "/:reviewId/replies",
        element: <ReviewRepliesPage endpointPrefix="Reply" />,
      },
      {
        path: "/movie-collection/:reviewId/replies",
        element: (
          <ReviewRepliesPage endpointPrefix="MovieCollectionReviewReplies" />
        ),
      },
      { path: "user/:userName", element: <UserPage /> },
      { path: "people/:id", element: <PersonPage /> },
      { path: "user/:userName/reviews", element: <UserReviewsPage /> },
      { path: "achievements", element: <AllAchievements /> },
      { path: "user/:userName/friends", element: <FriendsPage /> },
      { path: "user/achievements/:userName", element: <UserAchievements /> },
      { path: "users/statistics/:userName", element: <UserStatistics /> },
      {
        path: "user/:userName/moviecollection/create",
        element: <CreateMovieCollection />,
      },
      { path: "user/:userName/blocked", element: <BlockedPage /> },
      { path: "notifications", element: <NotificationPage /> },
      {
        path: "user/:userName/movieCollection/:id",
        element: <MovieCollectionPage />,
      },

      //Strona 404
      { path: "404", element: <NotFoundPage /> }, //Do przenoszenia w odpowiednich miejscach
      { path: "*", element: <NotFoundPage /> }, //Pod ścieżki typu /test/test/test
    ],
  },
];
export const router = createBrowserRouter(routes);