import { useParams } from "react-router-dom";
import { useState } from "react";
import { UserRelation } from "../models/UserRelation";
import { useUserRelations, deleteRelation } from "../API/RelationApi";
import FriendCard from "../components/Friends_components/FriendCard"
import InfoModal from "../components/SharedModals/InfoModal"
import ApiErrorDisplay from "../components/ApiErrorDisplay";
import SpinnerLoader from "../components/SpinnerLoader";

const FriendsPage = () => {
  const { userName } = useParams();
  const [relations, setRelations] = useState<any>(null);
  const [infoModal, setInfoModal] = useState<{ show: boolean; title: string; message: string; variant: "success" | "danger" | "warning"; }>({ show: false, title: "", message: "", variant: "danger" });
  const { data, isLoading: friendsListLoading, apiError: friendsListError  } = useUserRelations(userName, "Friend");
  const friends = data?.relations ?? [];

  const handleDeleteRelation = async (relationId: string) => {
    try{
      await deleteRelation(relationId, setRelations);

      setRelations((prev: any) => {
        if (!prev) return null;

        const updated = {
          ...prev,
          $values: prev.$values.filter((r: UserRelation) => r.relationId !== relationId),
        };
        return updated;
      });

      // if (userName) {
      //   setLoading(true);
      //   fetchRelationsData(userName, "Friend", setRelations, setError, navigate).finally(() => {
      //     setLoading(false);
      //   });
      // }
    } catch (error) {
      showInfoModal("Błąd", "Nie udało się usunąć relacji — być może już została usunięta. Spróbuj odświeżyć stronę.", "danger");
    }
  };

  const showInfoModal = (title: string, message: string, variant: "success" | "danger" | "warning" = "danger") => {
    setInfoModal({ show: true, title, message, variant });
  };

  if(friendsListLoading) return <SpinnerLoader />

return (
    <div style={{ minHeight: "90vh"}}>
        <h2 style={{ color: "white", textAlign: "center", margin: 0}} className="text-center mb-4">
            Znajomi użytkownika <strong>{userName}</strong>
        </h2>

        <div style={{ color: "white", textAlign: "center", marginLeft: "30px", marginRight: "30px" }}>
          <ApiErrorDisplay apiError={friendsListError}>
            {friends && friends.length > 0 ? (
                <div className="row g-5">
                {friends.map((friend: UserRelation, index: number) => (
                    <div className="col-12 col-md-3" key={index}>
                    <FriendCard friend={friend} onDelete={handleDeleteRelation} />
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-warning fs-5">Brak znajomych</p>
            )}
          </ApiErrorDisplay>
        </div>
        <InfoModal show={infoModal.show} onClose={() => setInfoModal({ ...infoModal, show: false })} title={infoModal.title}message={infoModal.message} variant={infoModal.variant}/>
    </div>
  );

};

export default FriendsPage;