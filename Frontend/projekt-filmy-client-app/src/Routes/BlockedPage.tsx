import { useParams } from "react-router-dom";
import { useState } from "react";
import { UserRelation } from "../models/UserRelation";
import { useUserRelations, deleteRelation } from "../API/RelationApi";
import BlockedCardProps from "../components/Blocked_components/BlockedCard";
import InfoModal from "../components/SharedModals/InfoModal"
import SpinnerLoader from "../components/SpinnerLoader";
import ApiErrorDisplay from "../components/ApiErrorDisplay";

const BlockedPage = () => {
  const { userName } = useParams();
  const [relations, setRelations] = useState<any>(null);
  const [infoModal, setInfoModal] = useState<{ show: boolean; title: string; message: string; variant: "success" | "danger" | "warning"; }>({ show: false, title: "", message: "", variant: "danger" });
  const { data, isLoading: blockedListLoading, apiError: blockedListError  } = useUserRelations(userName, "Blocked");
  const blockedUsers = data?.relations ?? [];

  const handleDeleteRelation = async (relationId: string) => {
    try {
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
      //   fetchRelationsData(userName, "Blocked", setRelations, setError, navigate).finally(() => {
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

  if(blockedListLoading) return <SpinnerLoader />

  return (
    <div style={{ minHeight: "90vh"}}>
      <h2 style={{ color: "white", textAlign: "center", margin: 0 }} className="text-center mb-4">
        Zablokowani użytkownicy <strong>{userName}</strong>
      </h2>

      <div style={{ color: "white", textAlign: "center", marginLeft: "30px", marginRight: "30px" }}>
        <ApiErrorDisplay apiError={blockedListError}>
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
        </ApiErrorDisplay>
      </div>
      <InfoModal show={infoModal.show} onClose={() => setInfoModal({ ...infoModal, show: false })} title={infoModal.title}message={infoModal.message} variant={infoModal.variant}/>
    </div>
  );
};

export default BlockedPage;