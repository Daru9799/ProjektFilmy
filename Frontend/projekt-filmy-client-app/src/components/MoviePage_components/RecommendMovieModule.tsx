import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { Movie } from "../../models/Movie";
import { Recommendation } from "../../models/Recommendation";
import { fetchRecommendByMovieId } from "../../API/MovieRecommendAPI";
import { fetchMoviesListByIds } from "../../API/movieApi";
import RecommendListModule from "../MovieRecommend_componets/RecommendListModule";

interface Props {
  movieId: string | undefined,
}

const RecommendMovieModule = ({movieId}:Props) => {
	const [movieList, setMovieList] = useState<Movie[]>([]);
	const [recommendList, setRecommendList ] = useState<Recommendation[]>([]);
	const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
	const [pageInfo, setPageInfo] = useState({
		totalItems: 0,
		pageNumber: 1,
		pageSize: 2,
		totalPages: 1,
	});

	const [open, setOpen] = useState(false);

	useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Pobierz rekomendacje (z await!)
        const recommendations = await fetchRecommendByMovieId(
          movieId,
          pageInfo.pageNumber,
          pageInfo.pageSize,
					setPageInfo,
					setError
        );
        setRecommendList(recommendations);
        // 2. Wyodrębnij ID polecanych filmów
        const recommendedMovieIds = recommendations.map(
          (rec: Recommendation) => rec.recommendedMovieId
        );

        // 3. Pobierz pełne informacje o filmach
        if (recommendedMovieIds.length > 0) {
          await fetchMoviesListByIds(
            pageInfo.pageNumber,
            pageInfo.pageSize,
            recommendedMovieIds,
            setMovieList
          );
        } else {
          setMovieList([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId,pageInfo.pageNumber]);

  return (
    <div className="m-4">
      <div className="d-grid gap-2 col-3 mx-auto my-2">
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="recommend-movie-list"
          aria-expanded={open}
          className="btn btn-light"
        >
          Rekomendacje
        </Button>
      </div>

      <Collapse in={open}>
        <div id="recommend-movie-list">
          <RecommendListModule movieList={movieList} />
        </div>
        {/* Moduł do paginacji w tym miejscu */}
      </Collapse>
    </div>
  );
}

export default RecommendMovieModule;
