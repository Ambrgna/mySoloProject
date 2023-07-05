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
  clients:Client[]=[];
  routeid:string|null;
  isOwner:boolean = false;
  canView:boolean = false;
  userid:number;
 
  constructor(private service: RestapiService, private route:ActivatedRoute,private sanitizer: DomSanitizer){
    this.routeid = this.route.snapshot.paramMap.get('clientid');
    const uid = localStorage.getItem("userid");
    this.getClients(uid);
    this.userid=(uid!=null) ? parseInt(uid):-1;
  }
  ngOnInit(): void {} 
  
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
            this.clients.push(client)
          }
          console.log(this.clients);
          
        }
      },
      error: (e) => alert(e.message)
    })
  }

}

