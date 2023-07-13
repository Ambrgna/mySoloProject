import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {
  private _clients:Client[]=[];
  private userid:number;
 
  constructor(private service: RestapiService, private route:ActivatedRoute,private sanitizer: DomSanitizer){
    // Gets current user id to find what projects to display
    const uid = sessionStorage.getItem("userid");
    // Gets list of clients that user is part of
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
          // Limit list to only clients with shared with user 
          if(client.disabled == false&&(client.visibility==true||client.canView?.includes(this.userid))){
            this._clients.push(client)
          }
          console.log(this._clients);
        }
      },
      error: (e) => alert(e.message)
    })
  }

}

