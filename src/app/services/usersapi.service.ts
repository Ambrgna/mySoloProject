import { Injectable } from '@angular/core';
import { User } from '../entities/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestapiService } from './restapi.service';

@Injectable({
  providedIn: 'root'
})
export class UsersapiService {
  private apiUrl: string = "http://localhost:9080/";
  private headers:any;

  constructor(private http: HttpClient, private service: RestapiService) { }

  // Make header for logged in user for HTTP Request
  public login(auth: any){
    const authURL:string = this.apiUrl+"authentication";
    const username = auth.username;
    const password = auth.password;
    this.headers = new HttpHeaders({Authorization: 'Basic '+btoa(username+":"+password)});
    
    const headers = this.headers;
    console.log(username);
    
    sessionStorage.setItem("headers", btoa(username+":"+password));
    this.service.setHeader(this.headers);

    return this.http.get(authURL, {headers, responseType: 'text' as 'json'});
  }

  // Clear header on logged out
  public logout(){
    const url:string = this.apiUrl+"logout";
    
    const headers = this.headers;
    
    sessionStorage.removeItem("userid")
    sessionStorage.removeItem("headers");
    
    this.service.removeHeader();

    return this.http.get(url, {headers, responseType: 'text' as 'json'});
  }

  // Gets Userid from Username
  public async userid(username:string):Promise<string>{
    var uid! :string;
    const usernameURL:string = this.apiUrl+"users/";
    const u:any = await this.http.get<User>(usernameURL+username, { headers: this.headers}).toPromise();
    uid = u.userId.toString();
    return uid;
  }
  // Gets User from Userid
  public getUserById(id:string){
    return this.http.get<User>(this.apiUrl+"users/id/"+id, { headers: this.headers});
  }
  // Gets All Users 
  public getUser(user: string){
    return this.http.get<User>(this.apiUrl+"users/"+user);
  }
  // Adds new User 
  public addUser(user:User){    
    return this.http.post(this.apiUrl+"users", user);
  }
}
