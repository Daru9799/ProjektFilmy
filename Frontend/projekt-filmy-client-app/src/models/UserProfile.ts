export interface UserProfile{
    id: string,
    userName: string,
    email: string,
    userRole: userRole,
    reviewsCount: number
}

export enum userRole {
    user=0,
    critic=1,
    mod=2
}