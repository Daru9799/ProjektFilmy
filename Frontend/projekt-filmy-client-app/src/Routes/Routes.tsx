import { RouteObject, createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../components/Home_componets/HomePage';
import MoviePage from '../components/MoviePage_components/MoviePage';
import SearchMoviesPage from "../components/SearchMovies_componets/SearchMoviesPage"
import SearchDirectorsPage from "../components/SearchDirectors_componets/SearchDirectorsPage";
import SearchActorsPage from "../components/SearchActors_componets/SearchActorsPage";
import ReviewsPage from '../components/review_components/ReviewsPage';
import UserPage from '../components/User_componets/UserPage';
import DirectorPage from '../components/SearchDirectors_componets/DirectorPage';
import ActorPage from '../components/SearchActors_componets/ActorPage';
import UserReviewsPage from '../components/User_componets/UserReviews';
import NotificationTestPage from '../components/TEST_COMPONENTS/NotificationTestPage';
import AllAchievements from '../components/Achievements_components/AllAchievements';



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
      { path: "/actor/:actorId", element: <ActorPage /> },
      { path: "/director/:directorId", element: <DirectorPage /> },
      { path: "/user/:userName/reviews", element: <UserReviewsPage /> },
      { path: "/notifications", element: <NotificationTestPage/>},
      { path: "/achievements", element:<AllAchievements/>}
    ],
  },
];
  export const router = createBrowserRouter(routes);