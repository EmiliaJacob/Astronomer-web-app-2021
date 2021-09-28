import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import {Router} from '@angular/router'
import {HttpClient} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
})
export class AppComponent {

  // deault profile pic
  pic = "../assets/profile_picture.png"
  image ='';


  constructor(public cookie: CookieService, private datePipe: DatePipe, private http: HttpClient, private router: Router){}


  async ngOnInit() {

    // Do not Edit:
    const username = this.cookie.get("userName");

    // If user is logged in and has a profile picture: load image; else load default profile picture
    if(this.cookie.get("loggedIn") == "true"){
        if(this.cookie.get("image") == "true"){
          this.pic = '../../assets/profile_pictures/'+username+'.png';

        }else{
          this.pic= "../assets/profile_picture.png";
        }
    }
    // Nach dem login wird die Seite neu geladen um das Profilbild zu setzen, dafür wird das login cookie gesetzt
    if(this.cookie.get('login') == '1'){
      console.log('Was here');
      this.cookie.delete('login');

      // nach dem editieren von einem profil wird die seite neu geladen, um das profil bild zu laden
    }else if(this.cookie.get('edit-reload') == 'true'){
      this.router.navigate(['User-Profile']);
      this.cookie.delete('edit-reload');

    }else{
      this.router.navigate(['Asteroids-Search']);
    }
  }

  user(){
    if(this.cookie.get("loggedIn") == "true"){
      this.router.navigate(['User-Profile']);
    }else{
      this.router.navigate(['login']);
    }
  }

  startpage(){
    this.router.navigate(['Asteroids-Search']);
  }

  fireball(){
    // const siteurl = "http://localhost:4200/assets/map.html";
    // window.open(siteurl, "_blank");
    this.router.navigate(['fireball']);
  }

  logout(){
    this.cookie.delete("userName");
    this.cookie.delete("loggedIn");
    this.cookie.delete("userEmail");
    this.cookie.delete("sort");
    this.cookie.delete("unit");
    this.cookie.delete("image");
    //this.router.navigate(['login']);

    window.location.reload();
  }
}
