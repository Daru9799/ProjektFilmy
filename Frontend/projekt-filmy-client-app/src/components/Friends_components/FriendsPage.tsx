import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserRelation } from "../../models/UserRelation";
import { fetchRelationsData, deleteFriendRelation } from "../../API/relationApi";
import FriendCard from "../../components/Friends_components/FriendCard"

const FriendsPage = () => {
    const { userName } = useParams();
    const [relations, setRelations] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (userName) {
        setLoading(true);
        fetchRelationsData(userName, setRelations, setError).finally(() => {
            setLoading(false);
      });
    }
    }, [userName]);

  const friends = relations?.$values.filter((relation: UserRelation) => relation.type === "Friend");

  const handleDeleteRelation = async (relationId: string) => {
    await deleteFriendRelation(relationId, setRelations, setError);
    if (userName) {
    setLoading(true);
    fetchRelationsData(userName, setRelations, setError).finally(() => {
      setLoading(false);
    });
  }
  };


  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <h1 className="error" style={{ color: 'white'}}>{error}</h1>;

return (
    <>
        <h2 style={{ color: "white", textAlign: "center", margin: 0 }} className="text-center mb-4">
            Znajomi użytkownika <strong>{userName}</strong>
        </h2>

        <div style={{ color: "white", textAlign: "center", marginLeft: "30px", marginRight: "30px" }}>
            {friends && friends.length > 0 ? (
                <div className="row g-5">
                {friends.map((friend: UserRelation, index: number) => (
                    <div className="col-12 col-md-3" key={index}>
                    <FriendCard friend={friend} onDelete={handleDeleteRelation} />
                    </div>
                ))}
                </div>
            ) : (
                <p>Brak znajomych</p>
            )}
        </div>
    </>
  );

};

export default FriendsPage;