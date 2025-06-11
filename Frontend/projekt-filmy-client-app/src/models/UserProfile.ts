export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  userRole: userRole;
  reviewsCount: number;
  isOwner: boolean; //Czy uzytkownik ktory to przeglada jest wlasicicielem profilu
}

export enum userRole {
  user = 0,
  critic = 1,
  mod = 2,
}

export interface UserResponse {
  $values: UserProfile[];
}
