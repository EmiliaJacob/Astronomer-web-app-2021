import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // urls
  urlUserService = 'http://193.197.231.179:3002';

  // initialization of the fields for the registration
  userName = '';
  userEmail = '';
  userPassword = '';

  // variable for ngIf
  user_exists=false;

  hide = true;
  constructor(private cookie : CookieService, private http: HttpClient, private router: Router) {}


  ngOnInit(): void {
  }

  // function for the users registration
  post_user(): void {

    this.http.post(this.urlUserService + '/register', {userName: this.userName, password: this.userPassword, email: this.userEmail},{observe: 'response'}).toPromise()
      .then(
        resp => {
          // Success
          if(resp.status == 200){
            this.user_exists = false;
            // set cookies
            this.cookie.set("userName", this.userName);
            this.cookie.set("loggedIn", "true");
            this.cookie.set("userEmail", resp.body['email']);
            this.userName = '';
            this.userEmail = '';
            this.userPassword = '';
          }
          // route to user profile
          this.router.navigate(['User-Profile']);
        })
      .catch((error) =>{
        console.log(error.status)
        //this.userName='Username already exists!';
        this.user_exists = true;
      })
  }

}
