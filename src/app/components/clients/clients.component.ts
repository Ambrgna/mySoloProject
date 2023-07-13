import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { User } from 'src/app/entities/user';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  private _clients: Client[] = [];
  private userid: number;
  private _user!: User;
  private _routeid: string|null;

  constructor(private service: RestapiService, private route:ActivatedRoute){
    // Gets current logged in user id
    const uid = sessionStorage.getItem("userid");
    this.userid=(uid!=null) ? parseInt(uid):-1;
    // Gets user id for page
    this._routeid = this.route.snapshot.paramMap.get('userid');

    // Gets Clients of user
    this.getClients(this._routeid);
    // Get User info
    this.getUser(uid);
  }
  
  public get clients() : Client[] {
    return this._clients;
  }
  public get user() : User {
    return this._user;
  }  
  public get routeid() : string|null {
    return this._routeid;
  }
  // Refreshes Clients list
  public updateClients(){
    this._clients=[];
    this.getClients(this._routeid);
  }
  // Get User info
  public getUser(id:string|null): void {
    if(id!=null){
      this.service.getUserById(id).subscribe({
        next: (response: User) => {
          this._user=response;
        },
        error: (e) => alert(e.message)
      })
    }
  }
  // Gets list of enabled Clients
  public getClients(id:String|null): void {
    this.service.getClients().subscribe({
      next: (response: Client[]) => {
        for(const client of response){
          var shown=true;

          if(this._routeid!=null){
            const uid = parseInt(this._routeid);
            shown = client.userId==uid;
          }
          
          if(client.disabled == false&&shown&&(client.visibility==true||client.canView?.includes(this.userid))){
            this._clients.push(client)
          }
        }
      },
      error: (e) => alert(e.message)
    })
  }    

}
