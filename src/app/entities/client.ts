export class Client {
    clientId:number|undefined;
    userId:number|undefined;
    name:string|undefined;
    agreementPath:string|undefined;
    disabled:boolean = false;

    constructor(name:string){
        this.name=name;
    }
}
