import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Project } from 'src/app/entities/project';
import { User } from 'src/app/entities/user';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
  @Input() project!: Project;
  userid!: number;
  leads:string[] = [];
  members:string[] = [];
  @Input() isOwner:boolean=false;
  canEdit:boolean=false;
  canRemove:boolean=false;
  logo:string|undefined;
  date:number= Date.now();
  @Output("updateProjects") updateProjects: EventEmitter<any> = new EventEmitter();

  constructor(private service: RestapiService, private router: Router, public snackBar: MatSnackBar){
    const uid = sessionStorage.getItem("userid");
    if(uid!=null){
      this.userid=parseInt(uid);
    }
  }
  ngOnInit(): void {
    console.log(this.project);
    if(this.project.name!==undefined){
      this.logo=this.project.name.toUpperCase().split("")[0];
    }    
    this.getUsers(this.project.teamLeads,this.project.teamMembers);
    if(this.project.teamLeads!==undefined){
      this.canEdit=(this.project.teamLeads.includes(this.userid));
      console.log("canEdit",this.canEdit);
    }
    this.canRemove=(this.project.owner==this.userid);
  }

  getUsers(l_ids:any,m_ids:any): void {
    for(var id of l_ids){
      id = id.toString();
      this.service.getUserById(id).subscribe({
        next: (response) => {
            if(response.username !== undefined){
              this.leads.push(response.username);
            }
        },
      });
    }
    for(var id of m_ids){
      id = id.toString();
      this.service.getUserById(id).subscribe({
        next: (response) => {
            if(response.username !== undefined){
              this.members.push(response.username);
            }
        },
      });
    }
  }

  editClient(pid : number,cid : number) {
    const link = "main/"+cid+"/"+pid+"/p/edit"
    this.router.navigate([link]);
  }

  public deleteClient(id: number): void {
    this.service.deleteClient(id);
  }

  public deleteConfirm(name : string, id : number) {
    if(confirm("Are you sure you want to delete " + name))
    {
      this.service.deleteProject(id).subscribe({
        next: (response) => {
          console.log(response);
          this.updateProjects.emit();
          this.openSnackBar(name+" deleted successfully");
        },
        error: (error) => {
          console.log(error);
          this.openSnackBar(name+" deleted failed");
        }
      });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 2000,
      });
  }
}