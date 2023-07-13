export class Client {
    private _clientId:number|undefined;
    private _userId:number|undefined;
    private _name:string|undefined;
    private _description:string|null|undefined=null;
    private _visibility: boolean|null|undefined;
    private _canView:number[]|null|undefined;
    private _logoPath:string|null|undefined;
    private _agreementPath:string|undefined="";
    private _disabled:boolean = false;

    constructor(){
        this._name="";
        this._description="";
    }
    
    public get clientId() : number|undefined {
        return this._clientId;
    }
    public set clientId(clientId : number|undefined) {
        this._clientId = clientId;
    }
    
    public get userId() : number|undefined {
        return this._userId;
    }
    public set userId(userId : number|undefined) {
        this._userId = userId;
    }
    
    public get name() : string|undefined {
        return this._name;
    }
    public set name(name : string|undefined) {
        this._name = name;
    }
    
    public get description() : string|null|undefined {
        return this._description;
    }
    public set description(description : string|null|undefined) {
        this._description = description;
    }
    
    public get visibility() : boolean|null|undefined {
        return this._visibility;
    }
    public set visibility(visibility : boolean|null|undefined) {
        this._visibility = visibility;
    }
    
    public get canView() : number[]|null|undefined {
        return this._canView;
    }
    public set canView(canView : number[]|null|undefined) {
        this._canView = canView;
    }
    
    public get logoPath() : string|null|undefined {
        return this._logoPath;
    }
    public set logoPath(logoPath : string|null|undefined) {
        this._logoPath = logoPath;
    }
    
    public get agreementPath() : string|undefined {
        return this._agreementPath;
    }
    public set agreementPath(agreementPath : string|undefined) {
        this._agreementPath = agreementPath;
    }
    
    public get disabled() : boolean {
        return this._disabled;
    }
    public set disabled(disabled : boolean) {
        this._disabled = disabled;
    }
    
}