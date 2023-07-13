import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { Project } from 'src/app/entities/project';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {
  private _clients:Client[]=[];
  private routeid:string|null;
  private userid:number;
 
  constructor(private service: RestapiService, private route:ActivatedRoute,private sanitizer: DomSanitizer){
    this.routeid = this.route.snapshot.paramMap.get('clientid');
    const uid = sessionStorage.getItem("userid");
    this.getClients(uid);
    this.userid=(uid!=null) ? parseInt(uid):-1;
  }

  public get clients() : Client[] {
    return this._clients;
  }  

  public ngOnInit(): void {} 
  
  public getClients(id:string|null): void {
    this.service.getClients().subscribe({
      next: (response: Client[]) => {
        for(const client of response){
          var shown=true;
          
          if(this.routeid!=null){
            const uid = parseInt(this.routeid);
            shown = client.userId==uid;
          }
          
          if(client.disabled == false&&shown&&(client.visibility==true||client.canView?.includes(this.userid))){
            this._clients.push(client)
          }
          console.log(this._clients);
          
        }
      },
      error: (e) => alert(e.message)
    })
  }

}

