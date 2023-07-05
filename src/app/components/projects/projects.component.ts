import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { Project } from 'src/app/entities/project';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  pdf:any="";
  
  client:Client=new Client();
  projects: Project[] = [];
  routeid:string|null;
  isOwner:boolean = false;
  userid:number | undefined;
 
  constructor(private service: RestapiService, private route:ActivatedRoute,private sanitizer: DomSanitizer){
    this.routeid = this.route.snapshot.paramMap.get('clientid');
    this.getProjects(this.routeid);
    this.getClient(this.routeid);
    const uid = localStorage.getItem("userid");
    if(uid!=null){
      this.userid=parseInt(uid);
    }
  }
  ngOnInit(): void {} 
  
  public getClient(id:string|null): void {
    this.service.getClientById(id).subscribe({
      next: (response: Client) => {
        console.log(response);
        this.client=response;
        if(response.userId==this.userid){
          this.isOwner=true;
          console.log(this.isOwner);
        }
        if(this.client.agreementPath!==undefined){
          console.log(this.client.agreementPath);
          this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.client.agreementPath);
        }
      },
    });
  }

  updateProjects(){
    this.projects=[];
    this.getProjects(this.routeid);
  }

  public getProjects(id:string|null): void {
    this.service.getProjectsByClientId(id).subscribe({
      next: (response: Project[]) => {
        console.log(response);
        for(const item of response)
        {
          if(item.disabled == false)
          {
            this.projects.push(item);
          }
        }
        console.log(this.projects);
      },
    });
  }

}
