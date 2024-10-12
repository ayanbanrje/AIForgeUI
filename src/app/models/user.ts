export class User {
    auth_time: number;
    email: string;
    exp: number;
    iat: number;
    phone_number: string;
    username: string;
    constructor(user) {
        this.auth_time = user.auth_time;
        this.email = user.email;
        this.exp = user.exp;
        this.iat = user.iat;
        this.phone_number = user.phone_number;
        this.username = user.username;
    }
}
