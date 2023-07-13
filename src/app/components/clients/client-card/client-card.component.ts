import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.css']
})
export class ClientCardComponent implements OnInit {
  private _client!: Client;
  private userid!: number;
  private _isOwner:boolean=false;
  private _logo:string|undefined;
  @Output("updateClients") private updateClients: EventEmitter<any> = new EventEmitter();

  constructor(private service: RestapiService, private router: Router, public snackBar: MatSnackBar){
    // Gets current user id
    const uid = sessionStorage.getItem("userid");
    if(uid!=null){
      this.userid=parseInt(uid);
    }
  }
  
  public get client() : Client {
    return this._client;
  }
  @Input() public set client(client : Client) {
    this._client = client;
  }  
  public get isOwner() : boolean {
    return this._isOwner;
  }  
  public get logo() : string|undefined {
    return this._logo;
  }
  
  public ngOnInit(): void {
    // Make card logo
    if(this._client.name!==undefined){
      this._logo=this._client.name.toUpperCase().split("")[0];
    }   
    // Find if the user made the client
    if(this._client.userId==this.userid){
      this._isOwner=true;
    }
  }

  // Router link for editing
  public editClient(id : number) {
    const link = "main/"+id+"/c/edit"
    this.router.navigate([link]);
  }

  // Call Delete service
  public deleteClient(id: number): void {
    this.service.deleteClient(id);
  }

  // Call Delete action
  public deleteConfirm(name : string, id : number) {
    if(confirm("Are you sure you want to delete " + name))
    {
      this.service.deleteClient(id).subscribe({
        next: (response) => {
          console.log(response);
          this.updateClients.emit();
          this.openSnackBar(name+" deleted successfully");
        },
        error: (error) => {
          console.log(error);
          this.openSnackBar(name+" deleted failed");
        }
      });
    }
  }

  // Alert to confirm task to user 
  public openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 2000,
      });
  }
}
