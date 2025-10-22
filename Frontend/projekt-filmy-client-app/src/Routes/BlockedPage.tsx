import { useParams } from "react-router-dom";
import { UserRelation } from "../models/UserRelation";
import { useUserRelations, useDeleteRelation } from "../API/RelationApi";
import BlockedCardProps from "../components/Blocked_components/BlockedCard";
import SpinnerLoader from "../components/SpinnerLoader";
import ApiErrorDisplay from "../components/ApiErrorDisplay";
import ActionPendingModal from "../components/SharedModals/ActionPendingModal";

const BlockedPage = () => {
  const { userName } = useParams();
  const { data, isLoading: blockedListLoading, apiError: blockedListError  } = useUserRelations(userName, "Blocked");
  const blockedUsers = data?.relations ?? [];
  //Mutacje
  const { mutate: deleteFromFriends, isPending: isDeletingFromFriends, error: deleteFromFriendsError } = useDeleteRelation();

  const handleDeleteRelation = async (relationId: string) => {
    deleteFromFriends(relationId);
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
      <ActionPendingModal show={isDeletingFromFriends} message="Trwa usuwanie użytkownika z zablokowanych..."/>
    </div>
  );
};

export default BlockedPage;