import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { Project } from 'src/app/entities/project';
import { User } from 'src/app/entities/user';
import { RestapiService } from 'src/app/services/restapi.service';
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.css']
})
export class AddProjectsComponent {

  client!: Client;
  leads: User[] = [];
  members: User[] = [];
  hasAccess:boolean = false;

  owner!:User;

  isOwner:boolean=false;

  project: Project=new Project();

  editing: boolean = false;
  editid:any;
  userid!:any;
  routeid:string|null;
  action:string="Add";

  projectForm!: FormGroup;

  constructor(private userService: UsersapiService,private service: RestapiService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {
    const uid = sessionStorage.getItem("userid");
    if(uid!=null){
      this.userid=parseInt(uid);
    }
    this.project=new Project();    
    this.client=new Client();
    
    this.routeid = this.route.snapshot.paramMap.get('clientid');
    
    const headers = sessionStorage.getItem("headers");
    
    this.getUsers();

    this.getClient(this.routeid);
    
    if(headers == null){
      this.router.navigate(["/login"]);
    }

    this.projectForm = new FormGroup({
      name: new FormControl(this.project?.name, [
        Validators.required
      ]),
      owner: new FormControl(this.project?.owner),
      teamLeads: new FormControl({value: this.project?.teamLeads, disabled: true}, [
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
      this.isOwner=true;
      this.projectForm.controls['teamLeads'].enable();
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
    this.leads = [];
    this.members =[];
    this.service.getUsers().subscribe({
      next: (response: User[]) => {
        for(const user of response)
        {
          if(this.isOwner){
            console.log("test");
            if(user.userId==this.userid){
              
              this.owner=user;
            }
            if(user.role == "ROLE_LEAD"&&user.userId!=this.userid){
              this.leads.push(user);
            } else if(user.role != "ROLE_LEAD") {
              this.members.push(user);
            }
          } else {
            if(user.role == "ROLE_LEAD"){
              this.leads.push(user);
            } else {
              this.members.push(user);
            }
          }
        }
        console.log(this.leads);
        console.log(this.members);
        if(this.isOwner&&!this.editing){          
          this.projectForm.patchValue({
            owner:this.owner.userId,
            teamLeads:[this.owner.userId]
          });
          console.log("value",this.projectForm.value);
        }
      },
    });
    
  }

  edit():void{    
    this.action = "Edit";

    this.service.getProjectById(this.editid).subscribe({
      next: (response) => {
        if(response.teamLeads?.includes(this.userid)||response.owner==this.userid){
          this.getUsers();
          this.hasAccess=true;
          console.log(this.hasAccess);
          console.log(response);
          this.projectForm.patchValue({
            name: response.name,
            owner: response.owner,
            teamLeads: response.teamLeads,
            teamMembers: response.teamMembers,
            description: response.description,
          });
          this.project=this.projectForm.value;
          console.log("teamLeads",response.teamLeads);
          if(this.project.owner==this.userid){
            this.isOwner=true;
            this.projectForm.controls['teamLeads'].enable();
          }
          console.log("isOwner",this.isOwner);
          
        } 
      },
        error: (error) => console.log(error),
      });
  }

  onSubmit() { 
    this.projectForm.controls['teamLeads'].enable();
    console.log("project",this.project.teamLeads);
    this.project=this.projectForm.value;
    console.log("value",this.projectForm.value);
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
        // this.project.teamLeads.push(this.userid);
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