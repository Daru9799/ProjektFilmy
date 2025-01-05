export interface User{
    userId:string,
    userName:string,
    email:string,
    userRole:userRole,
}

export enum userRole {
    user=1,
    critic=2,
    mod=3
    }