import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../entities/client';
import { Project } from '../entities/project';
import { User } from '../entities/user';

@Injectable({
  providedIn: 'root'
})
export class RestapiService {
  apiUrl: string = "http://localhost:9080";
  headers:any;
  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({Authorization: 'Basic '+localStorage.getItem("headers")});
    console.log("headers",this.headers);
  }  
  
  public getHeader(headers:HttpHeaders): void {
    this.headers=headers;
    console.log("headers",this.headers);
  }

  public removeHeader(): void {
    this.headers = new HttpHeaders();
    console.log("headers",this.headers);
  }


  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
  
  public getUserById(id:string){
    return this.http.get<User>(`${this.apiUrl}/users/id/${id}`, { headers: this.headers});
  }

  public getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`)
  }

  public getClientsByUserId(id:string): Observable<Client[]> {
      return this.http.get<Client[]>(`${this.apiUrl}/clients/userid/${id}`)
    }

  public getClientById(id:string|null): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/${id}`)
  }
  
  public postClient(client: Client) {
    return this.http.post(`${this.apiUrl}/clients`, client, { headers: this.headers});
  }

  public updateClient(client: Client) {
    console.log("headers",this.headers);
    
    return this.http.put(`${this.apiUrl}/clients`, client, { headers: this.headers});
  }

  public deleteClient(id : number){
    return this.http.delete(`${this.apiUrl}/clients/${id}`, { headers: this.headers, responseType: 'text'});
  }


  public getProjectsByClientId(id:string|null): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/${id}/projects`)
  }

  public getProjectById(id:string|null): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`)
  }
  
  public postProject(project:Project) { 
    return this.http.post(`${this.apiUrl}/projects`, project, { headers: this.headers});
  }

  public updateProject(project:Project) {
    return this.http.put(`${this.apiUrl}/projects`, project, { headers: this.headers});
  }
  
  public deleteProject(id : number) {
    return this.http.delete(`${this.apiUrl}/projects/${id}`, { headers: this.headers, responseType: 'text'});
  }

  
  public postFile(file: any,type:string) {
    return this.http.post(`${this.apiUrl}/upload/${type}`, file, { headers: this.headers, responseType: 'text'});
  }
  
}
