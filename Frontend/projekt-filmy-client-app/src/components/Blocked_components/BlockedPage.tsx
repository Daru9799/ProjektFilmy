import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserRelation } from "../../models/UserRelation";
import { fetchRelationsData, deleteRelation } from "../../API/relationApi";
import BlockedCardProps from "../../components/Blocked_components/BlockedCard";

const BlockedPage = () => {
  const { userName } = useParams();
  const [relations, setRelations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userName) {
      setLoading(true);
      fetchRelationsData(userName, "Blocked", setRelations, setError).finally(() => {
        setLoading(false);
      });
    }
  }, [userName]);

  const blockedUsers = relations?.$values.filter((relation: UserRelation) => relation.type === "Blocked");

  const handleDeleteRelation = async (relationId: string) => {
    await deleteRelation(relationId, setRelations, setError);

    setRelations((prev: any) => {
      if (!prev) return null;

      const updated = {
        ...prev,
        $values: prev.$values.filter((r: UserRelation) => r.relationId !== relationId),
      };
      return updated;
    });

    if (userName) {
      setLoading(true);
      fetchRelationsData(userName, "Blocked", setRelations, setError).finally(() => {
        setLoading(false);
      });
    }
  };

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <h1 className="error" style={{ color: 'white' }}>{error}</h1>;

  return (
    <>
      <h2 style={{ color: "white", textAlign: "center", margin: 0 }} className="text-center mb-4">
        Zablokowani użytkownicy <strong>{userName}</strong>
      </h2>

      <div style={{ color: "white", textAlign: "center", marginLeft: "30px", marginRight: "30px" }}>
        {blockedUsers && blockedUsers.length > 0 ? (
          <div className="row g-5">
            {blockedUsers.map((blocked: UserRelation, index: number) => (
              <div className="col-12 col-md-3" key={index}>
                <BlockedCardProps blockedUser={blocked} onUnblock={handleDeleteRelation} />
              </div>
            ))}
          </div>
        ) : (
          <p>Brak zablokowanych użytkowników</p>
        )}
      </div>
    </>
  );
};

export default BlockedPage;