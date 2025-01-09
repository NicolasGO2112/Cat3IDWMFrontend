export interface LogginDto {
    mail:     string;
    password: string;
}
export interface RegisterDto {
    mail:     string;
    password: string;
}
export interface Auth {
    roles(roles: any): unknown;
    id: number;
    name: string;
    email: string;
    token: string;
}