export class Project {
    private _projectId:number|undefined;
    private _clientId:number|undefined;
    private _teamLeads:number[]=[];
    private _teamMembers:number[]=[];
    private _name:string|undefined;
    private _description:string|null|undefined;
    private _disabled:boolean = false;

    
    public get projectId() : number|undefined {
        return this._projectId;
    }
    public set projectId(projectId : number|undefined) {
        this._projectId = projectId;
    }    
    public get clientId() : number|undefined {
        return this._clientId;
    }
    public set clientId(clientId : number|undefined) {
        this._clientId = clientId;
    }  
    public get teamLeads() : number[] {
        return this._teamLeads;
    }
    public set teamLeads(teamLeads : number[]) {
        this._teamLeads = teamLeads;
    }    
    public get teamMembers() : number[] {
        return this._teamMembers;
    }
    public set teamMembers(teamMembers : number[]) {
        this._teamMembers = teamMembers;
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
    public get disabled() : boolean {
        return this._disabled;
    }
    public set disabled(disabled : boolean) {
        this._disabled = disabled;
    }     
    
}