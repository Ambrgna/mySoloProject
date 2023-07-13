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
  private apiUrl: string = "http://localhost:9080";
  private headers:any;

  constructor(private http: HttpClient) { 
    // Gets header of logged in user for HTTP Request
    this.headers = new HttpHeaders({Authorization: 'Basic '+sessionStorage.getItem("headers")});
    console.log("headers",this.headers);
  }  
  // Changes header if needed 
  public setHeader(headers:HttpHeaders): void {
    this.headers=headers;
    console.log("headers",this.headers);
  }
  // Removes header 
  public removeHeader(): void {
    this.headers = new HttpHeaders();
    console.log("headers",this.headers);
  }
  // Gets All Users 
  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
  // Gets User from Userid
  public getUserById(id:string){
    return this.http.get<User>(`${this.apiUrl}/users/id/${id}`, { headers: this.headers});
  }
  // Gets All Clients 
  public getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`)
  }
  // Gets All Clients with Userid
  public getClientsByUserId(id:string): Observable<Client[]> {
      return this.http.get<Client[]>(`${this.apiUrl}/clients/userid/${id}`)
  }
  // Gets Client from Clientid
  public getClientById(id:string|null): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/${id}`)
  }
  // Adds new Client 
  public postClient(client: Client) {
    return this.http.post(`${this.apiUrl}/clients`, client, { headers: this.headers});
  }
  // Update Client 
  public updateClient(client: Client) {
    console.log("headers",this.headers);
    
    return this.http.put(`${this.apiUrl}/clients`, client, { headers: this.headers});
  }
  // Disable Client 
  public deleteClient(id : number){
    return this.http.delete(`${this.apiUrl}/clients/${id}`, { headers: this.headers, responseType: 'text'});
  }
  // Gets All Projects with ClientId
  public getProjectsByClientId(id:string|null): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/${id}/projects`)
  }
  // Gets Project from Projectsid
  public getProjectById(id:string|null): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`)
  }
  // Adds new Project
  public postProject(project:Project) { 
    return this.http.post(`${this.apiUrl}/projects`, project, { headers: this.headers});
  }
  // Update Project 
  public updateProject(project:Project) {
    return this.http.put(`${this.apiUrl}/projects`, project, { headers: this.headers});
  }
  // Disable Project
  public deleteProject(id : number) {
    return this.http.delete(`${this.apiUrl}/projects/${id}`, { headers: this.headers, responseType: 'text'});
  }

  // Upload file to S3 Bucket
  public postFile(file: any,type:string) {
    return this.http.post(`${this.apiUrl}/upload/${type}`, file, { headers: this.headers, responseType: 'text'});
  }
  
}
