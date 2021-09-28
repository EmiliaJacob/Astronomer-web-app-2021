import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import {AppComponent} from '../app.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // urls for backend requests
  urlUserService = 'http://193.197.231.179:3002'

  // variables to login
  userName = '';
  userPassword = '';
  passwordCheck = true;

  // hide password
  hide = true;
  constructor(private router: Router, private http: HttpClient, private cookie: CookieService) {}


  ngOnInit(): void {
  }

  register(){
    this.router.navigate(['register']);
  }

  login(){
    const params = "userName="+this.userName+"&userPassword="+this.userPassword;
    this.http.get(this.urlUserService + '/login?' + params, {observe: 'response'}).toPromise()
    .then(
      async resp => {
        // Success
        if(resp.status == 200){
          // Set cookies
          this.cookie.set("userName", this.userName);
          this.cookie.set("loggedIn", "true");
          this.cookie.set("userEmail", resp.body['result'].email);
          this.cookie.set("sort", resp.body['result'].sort);
          this.cookie.set("unit", resp.body['result'].unit);
          this.cookie.set("image", resp.body['result'].image);

          this.userName = '';
          this.userPassword = '';
        }
        this.passwordCheck = true;
        // cookie to load profile picture in mat-toolbar
        this.cookie.set('login', '1');
        // reload to load profile picture in mat-toolbar
        this.router.navigate(['Asteroids-Search']);
        //window.location.reload();

      })
    .catch((error) =>{
      console.log(error.status)
      this.userPassword = '';
      this.passwordCheck = false;
    });


  }
}
