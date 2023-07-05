export class Client {
    clientId:number|undefined;
    userId:number|undefined;
    name:string|undefined;
    description:string|null|undefined=null;
    visibility: boolean|null|undefined;
    canView:number[]|null|undefined;
    logoPath:string|null|undefined;
    agreementPath:string|undefined="";
    disabled:boolean = false;

    constructor(){
        this.name="";
        this.description="";
    }
}