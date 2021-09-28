import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-fireball',
  templateUrl: './fireball.component.html',
  styleUrls: ['./fireball.component.css']
})
export class FireballComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    console.log('was here')
  }
  goToLink(){
    const siteurl = "http://193.197.231.179:4200/assets/map.html";
    window.open(siteurl, "_blank");
  }

}
