export class User {
    private _userId: number|undefined;
    private _username: string|undefined;
    private _password: string|undefined;
    private _role: string|undefined;
    
    public get userId() : number|undefined {
        return this._userId;
    }
    public set userId(userId : number|undefined) {
        this._userId = userId;
    }
    public get username() : string|undefined {
        return this._username;
    }
    public set username(username : string|undefined) {
        this._username = username;
    }
    public get password() : string|undefined {
        return this._password;
    }
    public set password(password : string|undefined) {
        this._password = password;
    }
    public get role() : string|undefined {
        return this._role;
    }
    public set clierolentId(role : string|undefined) {
        this._role = role;
    }
}
