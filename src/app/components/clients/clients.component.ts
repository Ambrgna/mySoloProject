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
  clients: Client[] = [];
  userid: number;
  user!: User;
  routeid: string | null;

  constructor(private service: RestapiService, private route:ActivatedRoute){
    const uid = sessionStorage.getItem("userid");
    this.userid=(uid!=null) ? parseInt(uid):-1;
    this.routeid = this.route.snapshot.paramMap.get('userid');

    this.getClients(this.routeid);

    this.getUser(uid);
    
  }

  updateClients(){
    this.clients=[];
    this.getClients(this.routeid);
  }

  public getClients(id:String|null): void {
    this.service.getClients().subscribe({
      next: (response: Client[]) => {
        for(const client of response){
          var shown=true;

          if(this.routeid!=null){
            const uid = parseInt(this.routeid);
            shown = client.userId==uid;
          }
          
          if(client.disabled == false&&shown&&(client.visibility==true||client.canView?.includes(this.userid))){
            this.clients.push(client)
          }
        }
      },
      error: (e) => alert(e.message)
    })
  }
  public getUser(id:string|null): void {
    if(id!=null){
      this.service.getUserById(id).subscribe({
        next: (response: User) => {
          this.user=response;
        },
        error: (e) => alert(e.message)
      })
    }
  }

}
