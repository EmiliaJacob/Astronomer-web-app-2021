import { HttpClient } from '@angular/common/http';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  username = this.cookie.get("userName");
  useremail = this.cookie.get("userEmail");

  sorted = '';
  unit_table = '';
  image = 'false';
  image_url = '';

  constructor(private router: Router, private cookie: CookieService, private http: HttpClient) { }



  ngOnInit() {
    // get variables from cookies
    const username = this.cookie.get('userName') ;
        this.sorted= this.cookie.get('sort') ;
        this.unit_table= this.cookie.get('unit') ;
        this.image= this.cookie.get('image') ;
        if(this.image=="true"){
          this.image_url = '../../assets/profile_pictures/'+username+'.png';
        }
  }

  logout(){
    // delete all cookies
    this.cookie.delete("userName");
    this.cookie.delete("loggedIn");
    this.cookie.delete("userEmail");
    this.cookie.delete("sort");
    this.cookie.delete("unit");
    this.cookie.delete("image");
    this.router.navigate(['login']);

  }

  change(){
    this.router.navigate(['edit-profile']);
  }

}
