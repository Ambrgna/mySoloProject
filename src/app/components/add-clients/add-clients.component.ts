import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { User } from 'src/app/entities/user';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-add-clients',
  templateUrl: './add-clients.component.html',
  styleUrls: ['./add-clients.component.css']
})
export class AddClientsComponent {
  private _client!: Client;
  private _users: User[] = [];

  private _userid!:any;
  private _username:string|undefined = "";

  private _hasAccess:boolean = false;
  private _action:string="Add";
  private _imgURL: any;
  private _editing: boolean = false;
  
  private _clientForm!: FormGroup;
  
  private bucketUrl: string = "https://rfsp.s3.us-east-2.amazonaws.com/";
  private editid:any;
  private routeid:string|null;
  private isFiles: boolean = false;
  
  private imagePath: any;
  private filePath: any;
  private isImages: boolean = false;
  private savedAgreementPath: string | undefined;
  private savedlogoPath: string | null | undefined;
  
  constructor(public service: RestapiService, public snackBar: MatSnackBar, public route: ActivatedRoute, public router: Router) {
    this._client=new Client();
    this.routeid = this.route.snapshot.paramMap.get('clientid');
    
    const headers = sessionStorage.getItem("headers");
    this._userid = sessionStorage.getItem("userid");
    this._userid=parseInt(this._userid)
    
    if(headers == null){
      this.router.navigate(["/login"]);
    }

    this.getUsers();

    this._clientForm = new FormGroup({
      name: new FormControl(this._client?.name, [Validators.required]),
      description: new FormControl(this._client?.description),
      visibility: new FormControl(this._client?.visibility, [Validators.required]),
      canView: new FormControl(this._client?.canView, [Validators.required]),
      logoPath: new FormControl(this._client?.logoPath),
      agreementPath: new FormControl(this._client?.agreementPath, [Validators.required]),
    });
    
    this.editid = this.route.snapshot.paramMap.get('clientid');
    console.log(this.editid);
    
    if(this.editid!==undefined&&this.editid!==null){
      this._editing =true;
      this.edit();
    } else {
      this._hasAccess=true
    }
    
  }

  public get client() : Client {
    return this._client;
  }
  public get users() : User[] {
    return this._users;
  }
  public get userid() : any {
    return this._userid;
  }
  public get username() : string|undefined {
    return this._username;
  }
  public get hasAccess() : boolean {
    return this._hasAccess;
  }
  public get action() : string {
    return this._action;
  }
  public get imgURL() : any {
    return this._imgURL;
  }
  public get editing() : boolean {
    return this._editing;
  }
  public get clientForm() : FormGroup {
    return this._clientForm;
  }

  public getUsers(): void {
    this.service.getUsers().subscribe({
      next: (response: User[]) => {
        for(const user of response)
        {
          if(user.userId!=this._userid){
            this._users.push(user);
          } else {
            this._username=user.username;
          }
        }
        console.log(this._users);
      },
    });
  }

  get name(): any { return this.clientForm.get('name');}
  get description(): any { return this.clientForm.get('description');}
  get v(): any { return this.clientForm.get('visibility');}
  get canView(): any { return this.clientForm.get('canView');}
  get logoPath(): any { return this.clientForm.get('logoPath');}
  get agreementPath(): any { return this.clientForm.get('agreementPath');}

  public edit():void{
    this._action = "Edit";

    this._clientForm = new FormGroup({
      name: new FormControl(this._client?.name, [
        Validators.required
      ]),
      description: new FormControl(this._client?.description),
      visibility: new FormControl(this._client?.visibility, [Validators.required]),
      canView: new FormControl(this._client?.canView, [Validators.required]),
      logoPath: new FormControl(this._client?.logoPath),
      agreementPath: new FormControl(this._client?.agreementPath),
    });

    this.service.getClientById(this.editid).subscribe({
      next: (response) => {
      if(response.userId==this._userid){
        this._hasAccess=true;
        this._client=response;
        this.clientForm.patchValue({
          name: response.name,
          visibility: response.visibility,
          canView: response.canView,
          description: response.description
        });
        this.savedAgreementPath=response.agreementPath;
        this.savedlogoPath=response.logoPath;
      }
    },
      error: (error) => console.log(error),
    });
  }
  public visibilityChange(value: boolean):void{
    var usersView:number[]=[];
    if(value){
      usersView=[-1];
    }else{
      usersView=[this._userid];
    }
    this.clientForm.patchValue({
      canView: usersView
    });
    console.log(this.clientForm.value.canView);
  }
  public handleImageUpload(files:any):void{
    var path:any;
    if (files.length === 0){
      return;
    } else {
      this.isImages =true;
    }
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files[0];
    
    reader.readAsDataURL(files[0]); 
  }

  public handleFileUpload(files:any):void{
    if (files.length === 0){
      return;
    } else {
      this.isFiles =true;
    }

    var mimeType = files[0].type;
    if (mimeType.match(/application\/*/) == null) {
      // this.message = "Only PDFs or DOC files are supported.";
      return;
    }

    var reader = new FileReader();
    this.filePath = files[0];
    console.log(this.clientForm.value.agreementPath);

  }
  public upload(filePath:any,itemId:any,date:number,ext:string){
    const file = new FormData(); 
    var name: string;
    if (ext=="jpg"){
      name=itemId+"/logo."+ext;
    } else {
      name=itemId+"/client."+ext;
    }
    
    console.log(name);
    file.append('file', filePath, name);
    
    this.clientForm.patchValue({
      path: this.bucketUrl+name
    });

    this.service.postFile(file,ext).subscribe({
      next: (response) => 
    console.log("Uploaded "+name+" Successfully."),
      error: (error) => 
      console.log("Uploaded "+name+" Failed."),
    });
  }
  public onSubmit() { 
    console.log(this.clientForm.value);
    const defaultImg:string="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";
    var itemId;
    const date =getDate();
    itemId=(this.routeid!=null) ? this.routeid : getDate();
    // itemId=getDate();
    
    this._client=this.clientForm.value;

    if(this.isImages){
      console.log(this.imagePath);
      this.upload(this.imagePath,itemId,date,"jpg");
      this.savedlogoPath=this.bucketUrl+itemId+"/logo.jpg";
      console.log(this._client);
    }

    if(this.isFiles){
      console.log(this.filePath);
      
      this.upload(this.filePath,itemId,date,"pdf");
      this.savedAgreementPath=this.bucketUrl+itemId+"/client.pdf";
    }
    // this.clientForm.value.agreementPath="";
    if(this.routeid!==null){
      this._client.clientId = parseInt(this.routeid);
    }
    this._client.userId=this._userid;
    this._client.agreementPath=this.savedAgreementPath;
    this._client.logoPath=this.savedlogoPath;
    console.log(this._client);
    
      if(this.editing){ 
        this._client.clientId=parseInt(this.editid);
        console.log(this._client);
        this.service.updateClient(this._client).subscribe({
          next: (response) => {
            this.openSnackBar("Client edit successfully");
            this.router.navigate(["/main/"+this._userid+"/clients"]);
        },
          error: (error) => this.openSnackBar("Client edit failed"),
        });
      } else {
        this.service.postClient(this._client).subscribe({
          next: (response) =>
          { 
            console.log(response);
            this.openSnackBar("Client posted successfully");
            this.router.navigate(["/main/"+this._userid+"/clients"]);
          },
          error: (error) => {
            console.log(error);
            this.openSnackBar("Client posted failed");
          },
        });
      }        
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 2000,
    });
  }

} 
function getDate() {
  return Date.now();
}
