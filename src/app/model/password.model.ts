export interface PasswordModel {
    id: string;
    url: string;
    username: string;
    password: string;
}

export type PasswordListItem = Omit<PasswordModel, 'password'>
export type PasswordCreateModel = Omit<PasswordModel, 'id'>;
