export interface User {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    token?: string;

    isDeleting?: boolean;
    roles?: string[];
}