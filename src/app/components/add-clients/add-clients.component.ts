import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-add-clients',
  templateUrl: './add-clients.component.html',
  styleUrls: ['./add-clients.component.css']
})
export class AddClientsComponent {
  bucketUrl: string = "https://rfsp.s3.us-east-2.amazonaws.com/";

  client!: Client;
  
  control = new FormControl();

  editing: boolean = false;
  editid:any;
  userid!:any;
  routeid:string|null;
  action:string="Add";
  isFiles: boolean = false;

  clientForm!: FormGroup;
  
  public imagePath: any;
  imgURL: any;
  isImages: boolean = false;
  savedAgreementPath: string | undefined;
  savedlogoPath: string | null | undefined;
  
  constructor(private service: RestapiService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {
    this.client=new Client();
    this.routeid = this.route.snapshot.paramMap.get('clientid');
    
    const headers = sessionStorage.getItem("headers");
    this.userid = sessionStorage.getItem("userid");
    
    if(headers == null){
      this.router.navigate(["/login"]);
    }

    this.clientForm = new FormGroup({
      name: new FormControl(this.client?.name, [
        Validators.required
      ]),
      description: new FormControl(this.client?.description),
      imgPath: new FormControl(this.client?.logoPath),
      agreementPath: new FormControl(this.client?.agreementPath, [
        Validators.required
      ]),
    });
    this.editid = this.route.snapshot.paramMap.get('clientid');
    console.log(this.editid);
    
    if(this.editid!==undefined&&this.editid!==null){
      this.editing =true;
      this.edit();
    }
    
  }

  get name(): any { return this.clientForm.get('name');}
  get description(): any { return this.clientForm.get('description');}
  get logoPath(): any { return this.clientForm.get('logoPath');}
  get agreementPath(): any { return this.clientForm.get('agreementPath');}
  
  edit():void{
    this.action = "Edit";

    this.clientForm = new FormGroup({
      name: new FormControl(this.client?.name, [
        Validators.required
      ]),
      description: new FormControl(this.client?.description),
      logoPath: new FormControl(this.client?.logoPath),
      agreementPath: new FormControl(this.client?.agreementPath),
    });

    this.service.getClientById(this.editid).subscribe({
      next: (response) => {
      this.client=response;
      this.clientForm.patchValue({
        name: response.name,
        description: response.description,
        // logoPath: response.logoPath,
        // agreementPath: response.agreementPath
      });
      this.savedAgreementPath=response.agreementPath;
      this.savedlogoPath=response.logoPath;
    },
      error: (error) => console.log(error),
    });
  }
  
  handleImageUpload(files:any):void{
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

  handleFileUpload(files:any):void{
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
    this.clientForm.value.agreementPath = files[0];
    console.log(this.clientForm.value.agreementPath);

  }
  upload(filePath:any,itemId:any,date:number,ext:string){
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
  onSubmit() { 
    const defaultImg:string="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";
    var itemId;
    const date =getDate();
    itemId=(this.routeid!=null) ? this.routeid : getDate();
    // itemId=getDate();
    
    this.client=this.clientForm.value;

    if(this.isImages){
      this.upload(this.imagePath,itemId,date,"jpg");
      this.savedlogoPath=this.bucketUrl+itemId+"/logo.jpg";
      console.log(this.client);
    }

    if(this.isFiles){
      this.upload(this.clientForm.value.agreementPath,itemId,date,"pdf");
      this.savedAgreementPath=this.bucketUrl+itemId+"/client.pdf";
    }
    // this.clientForm.value.agreementPath="";
    if(this.routeid!==null){
      this.client.clientId = parseInt(this.routeid);
    }
    this.client.userId=parseInt(this.userid);
    this.client.agreementPath=this.savedAgreementPath;
    this.client.logoPath=this.savedlogoPath;
    console.log(this.client);
    
      if(this.editing){ 
        this.client.clientId=parseInt(this.editid);
        console.log(this.client);
        this.service.updateClient(this.client).subscribe({
          next: (response) => {
            this.openSnackBar("Client edit successfully");
            this.router.navigate(["/main/clients"]);
        },
          error: (error) => this.openSnackBar("Client edit failed"),
        });
      } else {
        this.service.postClient(this.client).subscribe({
          next: (response) =>
          { 
            console.log(response);
            this.openSnackBar("Client posted successfully");
            this.router.navigate(["/main/clients"]);
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
