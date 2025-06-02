import { RouteObject, createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../components/Home_componets/HomePage';
import MoviePage from '../components/MoviePage_components/MoviePage';
import SearchMoviesPage from "../components/SearchMovies_componets/SearchMoviesPage"
import SearchDirectorsPage from "../components/SearchDirectors_componets/SearchDirectorsPage";
import SearchActorsPage from "../components/SearchActors_componets/SearchActorsPage";
import ReviewsPage from '../components/review_components/ReviewsPage';
import UserPage from '../components/User_componets/UserPage';
import PersonPage from '../components/SearchDirectors_componets/PersonPage';
import UserReviewsPage from '../components/User_componets/UserReviews';
import NotificationTestPage from '../components/TEST_COMPONENTS/NotificationTestPage';
import AllAchievements from '../components/Achievements_components/AllAchievements';
import UserAchievements from '../components/Achievements_components/UserAchievements';
import UserStatistics from '../components/User_componets/UserStatistics';
import FriendsPage from '../components/Friends_components/FriendsPage';



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
      { path: "/user/:userName", element: <UserPage /> },
      { path: "/people/:id", element: <PersonPage /> },
      { path: "/user/:userName/reviews", element: <UserReviewsPage /> },
      { path: "/notifications", element: <NotificationTestPage/>},
      { path: "/achievements", element:<AllAchievements/>},
      { path: "/user/:userName/friends", element: <FriendsPage /> },
      { path: "/user-achievements/:userName",element:<UserAchievements/>},
      { path: "users/statistics/:userName", element:<UserStatistics/>}
    ],
  },
];
  export const router = createBrowserRouter(routes);