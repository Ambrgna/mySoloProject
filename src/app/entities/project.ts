export class Project {
    projectId:number|undefined;
    clientId:number|undefined;
    owner: number|undefined;
    teamLeads:number[]=[];
    teamMembers:number[]=[];
    name:string|undefined;
    description:string | null | undefined;
    disabled:boolean = false;

    constructor(){
        this.name="";
    }
}