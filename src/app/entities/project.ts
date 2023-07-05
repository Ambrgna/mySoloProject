export class Project {
    projectId:number|undefined;
    clientId:number|undefined;
    teamLeads:number[]|undefined;
    teamMembers:number[]|undefined;
    name:string|undefined;
    description:string | null | undefined;
    disabled:boolean = false;

    constructor(){
        this.name="";
    }
}