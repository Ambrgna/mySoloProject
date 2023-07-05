import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { Project } from 'src/app/entities/project';
import { User } from 'src/app/entities/user';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.css']
})
export class AddProjectsComponent {

  client!: Client;
  leads: User[] = [];
  members: User[] = [];

  project: Project=new Project();

  editing: boolean = false;
  editid:any;
  userid!:any;
  routeid:string|null;
  action:string="Add";

  projectForm!: FormGroup;

  constructor(private service: RestapiService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {
    this.project=new Project();    
    this.client=new Client();
    
    this.routeid = this.route.snapshot.paramMap.get('clientid');
    
    const headers = localStorage.getItem("headers");
    
    this.getUsers();

    this.getClient(this.routeid);
    
    if(headers == null){
      this.router.navigate(["/login"]);
    }

    this.projectForm = new FormGroup({
      name: new FormControl(this.project?.name, [
        Validators.required
      ]),
      teamLeads: new FormControl(this.project?.teamLeads, [
        Validators.required
      ]),
      teamMembers: new FormControl(this.project?.teamMembers),
      description: new FormControl(this.project?.description)
    });
    this.editid = this.route.snapshot.paramMap.get('projectid');
    console.log(this.editid);
    
    if(this.editid!==undefined&&this.editid!==null){
      this.editing =true;
      this.edit();
    }else{
      this.project=this.projectForm.value;
    }
  }


  get name(): any { return this.projectForm.get('name');}
  get teamLeads(): any { return this.projectForm.get('teamLeads');}
  get teamMembers(): any { return this.projectForm.get('teamMembers');}
  get description(): any { return this.projectForm.get('description');}
  
  getClient(routeid: string | null) {
    this.service.getClientById(routeid).subscribe({
      next: (response) => this.client=response,
      error: (error) => console.log(error),
    });
  }
  
  getUsers(): void {
    this.service.getUsers().subscribe({
      next: (response: User[]) => {
        for(const user of response)
        {
          
          if(user.role == "ROLE_LEAD"){
            this.leads.push(user);
          } else {
            this.members.push(user);
          }
        }
        console.log(this.leads);
        console.log(this.members);
      },
    });
  }

  edit():void{    
    this.action = "Edit";

    this.service.getProjectById(this.editid).subscribe({
      next: (response) => {
        console.log(response);
      this.projectForm.patchValue({
        name: response.name,
        teamLeads: response.teamLeads,
        teamMembers: response.teamMembers,
        description: response.description,
      });
      this.project=this.projectForm.value;
      console.log(this.projectForm.value.teamMembers);
    },
      error: (error) => console.log(error),
    });
  }

  onSubmit() { 
    this.project=this.projectForm.value;
    const link:string = "/main/"+this.routeid+"/projects";
    
    console.log(this.routeid);
    if(this.routeid!==null){
      this.project.clientId = parseInt(this.routeid);
      
    }
    
    console.log(this.project);
      if(this.editing){ 
        this.project.projectId=parseInt(this.editid);
        console.log(this.project);
        this.service.updateProject(this.project).subscribe({
          next: (response) => {
            this.openSnackBar("Project edit successfully");
            this.router.navigate([link]);
        },
          error: (error) => this.openSnackBar("Project edit failed"),
        });
      } else {
        this.service.postProject(this.project).subscribe({
          next: (response) =>
          { 
            console.log(response);
            this.openSnackBar("Project posted successfully");
            this.router.navigate([link]);
          },
          error: (error) => {
            console.log(error);
            this.openSnackBar("Project posted failed");
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