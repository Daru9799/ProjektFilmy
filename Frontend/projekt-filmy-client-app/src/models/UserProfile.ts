export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  userRole: userRole;
  reviewsCount: number;
  isOwner: boolean; //Czy uzytkownik ktory to przeglada jest wlasicicielem profilu
  isGoogleUser: boolean; //Czy user jest logowany przez konto google
}

export enum userRole {
  user = 0,
  critic = 1,
  mod = 2,
}

export interface UserResponse {
  $values: UserProfile[];
}
