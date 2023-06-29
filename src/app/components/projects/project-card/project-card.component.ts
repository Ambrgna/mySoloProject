import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Project } from 'src/app/entities/project';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent {
  @Input() project!: Project;
  userid!: number;
  @Input() isOwner:boolean=false;
  logo:string|undefined;
  date:number= Date.now();
  @Output("updateProjects") updateProjects: EventEmitter<any> = new EventEmitter();

  constructor(private service: RestapiService, private router: Router, public snackBar: MatSnackBar){
    const uid = sessionStorage.getItem("userid");
    if(uid!=null){
      this.userid=parseInt(uid);
    }
  }

  editClient(id : number) {
    const link = "main/"+id+"/p/edit"
    this.router.navigate([link]);
  }

  public deleteClient(id: number): void {
    this.service.deleteClient(id);
  }

  public deleteConfirm(name : string, id : number) {
    if(confirm("Are you sure you want to delete " + name))
    {
      this.service.deleteClient(id).subscribe({
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
