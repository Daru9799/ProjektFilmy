
// Może być wykorzystywany do recenzji filmu i recenzji kolekcji filmowej
export interface Reply {
    replyId: string;
    comment: string;
    date: string;
    username: string;
    userId: string;
    reviewId: string;
    isOwner: boolean;
}

export interface ReplyResponse {
  $values: Reply[];
}