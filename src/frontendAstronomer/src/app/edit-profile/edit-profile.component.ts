import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})

export class EditProfileComponent implements OnInit {
  //urls
  urlUserService = 'http://193.197.231.179:3002';

  fileName = ''; // of image
  e:File = null; // ausgewählte Datei
  sorted = ''; // default sort value
  unit_table =''; // default unit value
  username = this.cookie.get("userName"); // set username
  image = ''; // variable for *ngIf
  image_url = '';



  measurementSystems = ['Metric', 'Imperial'];
  sortingAttributes = ['Name','Distance','Diameter','Date','Favorite'];

  constructor(private router: Router, private http: HttpClient, private cookie : CookieService) {}

  async ngOnInit() {
    const username = this.cookie.get('userName') ;
        this.sorted= this.cookie.get('sort') ;
        this.unit_table= this.cookie.get('unit') ;
        this.image= this.cookie.get('image') ;
        if(this.image=="true"){
          this.image_url = '../../assets/profile_pictures/'+username+'.png';
        }
  }

  onFileSelected(event) {
      this.e = event.target.files[0];
      this.fileName = this.e.name;
  }

  update(){
    // upload profile picture (if one was selected)
    if (this.e) {
      if(this.image == 'true'){
        // Falls bild vorhanden - altes bild löschen
        this.http.delete(this.urlUserService + "/image?userName="+this.username).toPromise();
      }
      // variable zum senden an die Datenbank setzen
      this.image = 'true';

      // cast image to formData Object
      const formData = new FormData();
      formData.append("file", this.e);

      // Post image to UserService
      const upload$ = this.http.post(this.urlUserService + "/upload?userName="+this.username, formData);
      upload$.subscribe();
    }

    // update database values
    this.http.put(this.urlUserService + "/useroption",
      {userName: this.username,
      image: this.image,
      unit: this.unit_table,
      sort: this.sorted}).toPromise()
    .then(
      resp => {
        console.log(resp);
      }
    )
    // refresh cookies
    this.cookie.set('sort', this.sorted);
    this.cookie.set('unit', this.unit_table);
    this.cookie.set('image', this.image);
    this.cookie.set('edit-reload', 'true');
    this.router.navigate(['User-Profile']);
  }

  backToProfile(){
    this.router.navigate(['User-Profile']);
  }

  loadImage(){
    this.http.get(this.urlUserService + "/picture/user", {observe: 'response'}).toPromise()
    .then(
      resp => {
        this.image = resp.body["url"]
        console.log(this.image);

      }
    )
  }
}
