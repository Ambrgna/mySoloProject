import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { Project } from 'src/app/entities/project';
import { User } from 'src/app/entities/user';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  private _pdf:any="";
  
  private _client:Client=new Client();
  private _projects: Project[] = [];
  private _routeid:string|null;
  private _canAdd:boolean = false;
  private _canView:boolean = false;
  private userid:number;
 
  constructor(private service: RestapiService, private route:ActivatedRoute,private sanitizer: DomSanitizer){
    this._routeid = this.route.snapshot.paramMap.get('clientid');
    this.getProjects(this._routeid);
    this.getClient(this._routeid);
    const uid = sessionStorage.getItem("userid");
    this.getUser(uid);
    this.userid=(uid!=null) ? parseInt(uid):-1;
  }

  public get pdf() : any {
    return this._pdf;
  }
  public get client() : Client {
    return this._client;
  }  
  public get projects() : Project[] {
    return this._projects;
  }  
  public get routeid() : string|null {
    return this._routeid;
  }
  public get canAdd() : boolean {
    return this._canAdd;
  }
  public get canView() : boolean {
    return this._canView;
  }
  
  public ngOnInit(): void {} 
  
  public getClient(id:string|null): void {
    this.service.getClientById(id).subscribe({
      next: (response: Client) => {
        console.log(response);
        this._canView = (
          response.visibility||response.canView?.includes(this.userid)
          )?true:false;
        console.log("canView",this._canView);
        this._client=response;
        if(this._client.agreementPath!==undefined){
          console.log(this._client.agreementPath);
          this._pdf = this.sanitizer.bypassSecurityTrustResourceUrl(this._client.agreementPath);
        }
      },
    });
  }
  
  public getUser(id:string|null): void {
    if(id!=null){
      this.service.getUserById(id).subscribe({
        next: (response: User) => {
          console.log(response);
          if(response.role=="ROLE_LEAD"){
            this._canAdd=true;
            console.log(this._canAdd);
          }
        },
      });
    }
  }

  public updateProjects(){
    this._projects=[];
    this.getProjects(this._routeid);
  }

  public getProjects(id:string|null): void {
    this.service.getProjectsByClientId(id).subscribe({
      next: (response: Project[]) => {
        console.log(response);
        for(const item of response)
        {
          if(item.disabled == false)
          {
            this._projects.push(item);
          }
        }
        console.log(this._projects);
      },
    });
  }

}
