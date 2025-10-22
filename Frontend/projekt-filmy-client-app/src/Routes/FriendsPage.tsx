import { useParams } from "react-router-dom";
import { UserRelation } from "../models/UserRelation";
import { useUserRelations, useDeleteRelation } from "../API/RelationApi";
import FriendCard from "../components/Friends_components/FriendCard"
import ApiErrorDisplay from "../components/ApiErrorDisplay";
import SpinnerLoader from "../components/SpinnerLoader";
import ActionPendingModal from "../components/SharedModals/ActionPendingModal";

const FriendsPage = () => {
  const { userName } = useParams();
  //Api
  const { data, isLoading: friendsListLoading, apiError: friendsListError  } = useUserRelations(userName, "Friend");
  const friends = data?.relations ?? [];
  //Mutacje
  const { mutate: deleteFromFriends, isPending: isDeletingFromFriends, error: deleteFromFriendsError } = useDeleteRelation();

  const handleDeleteRelation = async (relationId: string) => {
    deleteFromFriends(relationId);
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
        <ActionPendingModal show={isDeletingFromFriends} message="Trwa usuwanie użytkownika ze znajomych..."/>
    </div>
  );

};

export default FriendsPage;