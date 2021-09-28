import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

//interface for Saved-Table-Data
export interface SavedAsteroid {
  id: number;
  name: string;
  distance: string;
  diameter: number;
  date: string;
  details : AsteroidDetails;
  link: string;
  is_favorite : boolean;
}
// Interface vor expanded information
export interface AsteroidDetails {
  id: number;
  potentially_hazardous: string;
  close_approach_date: string;
  relative_velocity: string;
  miss_distance: string;
  is_sentry_object: string;
  orbit_class: string;
}

@Component({
  selector: 'app-saved-asteroids',
  templateUrl: './saved-asteroids.component.html',
  styleUrls: ['./saved-asteroids.component.css'],
  animations: [
    // animation to expand a table row
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed, void => expanded',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ]
})
export class SavedAsteroidsComponent implements OnInit {
  //urls for service requests
  urlInsertAsteroid = 'http://193.197.231.179:3001/InsertAsteroid';
  urlNasaIntegration = 'http://193.197.231.179:3000';
  urlAsteroidsBackend = 'http://193.197.231.179:3001';
  urlUserService = 'http://193.197.231.179:3002';


  expandedElementSavedAsteroids: SavedAsteroid | null;
  @ViewChild(MatSort) sort: MatSort;
  @Output() removeStarEvent = new EventEmitter<SavedAsteroid>();

  ELEMENT_DATA_SAVED_ASTEROID:SavedAsteroid[] = [];
  dataSourceSavedAsteroids = new MatTableDataSource();
  displayedColumnsSavedAsteroids = ['name', 'distance', 'diameter', 'date','link', 'favorite'];
  constructor(private cookie: CookieService, private http: HttpClient) { }

  ngOnInit(): void {

    if(this.isLoggedIn) {
      this.loadSavedAsteroids();
    }
  }

  ngAfterViewInit(){
    if(this.isLoggedIn){
      this.sort.sort(({
        id: this.cookie.get('sort'),
        start: 'asc'
      }) as MatSortable);
    }
    this.dataSourceSavedAsteroids.sort = this.sort;
  }

  async loadSavedAsteroids(){
    var paramArray = '';
    var numberOfAsteroidIds = 0;
    this.ELEMENT_DATA_SAVED_ASTEROID = [];
    // load asteroid id's from user database
    const username = this.cookie.get("userName");
    await this.http.get(this.urlUserService + '/favorite' + '?' + 'userName=' + username, {observe: 'response'}).toPromise()
    .then(
      resp => {
        for(let id in resp.body){
          paramArray = paramArray + '&array=' + resp.body[id];
          numberOfAsteroidIds++;
        }
      }
    );
    
    console.log("PARAMS: " + paramArray);

    // load asteroids from asteroid database
    await this.http.get(this.urlAsteroidsBackend + '/AsteroidInfo?array=zero'+paramArray, {observe: 'response'}).toPromise()
      .then(
        (resp) => {
          var data = resp.body;
          console.log(data);
          var o_class = ''; // Hilfsvariable um orbitklasse zu deklarieren
          for(var i = 1; i <= numberOfAsteroidIds; i++){
            if(data[i] != 'undefined' && data[i] != null){
		          console.log(data[i]);


              if(typeof(data[i].orbit_class) != 'undefined' && typeof(data[i].orbit_class) != null){
                o_class = data[i].orbit_class
              }else{
                o_class = ''
              }

              if(data[i] != null){
                this.ELEMENT_DATA_SAVED_ASTEROID.push(
                  {id: data[i].nasaId,
                  name: data[i].name,
                  distance: data[i].distance,
                  diameter: data[i].diameter,
                  date: data[i].date,
                  link: data[i].link,
                  details: {
                    id: data[i].nasaId,
                    potentially_hazardous : data[i].potentially_hazardous,
                    close_approach_date : data[i].close_approach_date,
                    relative_velocity : data[i].relative_velocity + ' km/s',
                    miss_distance : data[i].miss_distance + ' km',
                    is_sentry_object : data[i].is_sentry_object,
                    orbit_class: o_class
                  },
                  is_favorite: true
                });
              }
            }
          }
          this.dataSourceSavedAsteroids.data = this.ELEMENT_DATA_SAVED_ASTEROID;
          //console.log("dataSource: " + JSON.stringify(this.dataSourceSavedAsteroids));
        }
      );
  }

  // function to set favorite asteroid
  async favorite(asteroid: SavedAsteroid) {
    if (asteroid.is_favorite) {
      asteroid.is_favorite = false;
      if (this.cookie.get('loggedIn') == 'true') {
        // remove favorite to user in database
        const userName = this.cookie.get('userName');
        await this.http
          .put(this.urlUserService+'/removefavorite', {
            userName: userName,
            favorite: asteroid.id,
          })
          .toPromise();
      }
      this.removeStarEvent.emit(asteroid);
    } else {
      asteroid.is_favorite = true;

      if (this.cookie.get('loggedIn') == 'true') {
        // add favorite to user in database
        const username = this.cookie.get('userName');
        await this.http
          .put(this.urlUserService+'/favorite', { userName: username, favorite: asteroid.id })
          .toPromise();
        var data = null;
        if (asteroid.details.orbit_class != '') {
          data = {
            nasaId: asteroid.id,
            name: asteroid.name,
            distance: asteroid.distance,
            diameter: asteroid.diameter,
            date: asteroid.date,
            potentially_hazardous: asteroid.details.potentially_hazardous,
            close_approach_date: asteroid.details.close_approach_date,
            relative_velocity: asteroid.details.relative_velocity,
            miss_distance: asteroid.details.miss_distance,
            is_sentry_object: asteroid.details.is_sentry_object,
            orbit_class: asteroid.details.orbit_class,
          };
        } else {
          data = {
            nasaId: asteroid.id,
            name: asteroid.name,
            distance: asteroid.distance,
            diameter: asteroid.diameter,
            date: asteroid.date,
            potentially_hazardous: asteroid.details.potentially_hazardous,
            close_approach_date: asteroid.details.close_approach_date,
            relative_velocity: asteroid.details.relative_velocity,
            miss_distance: asteroid.details.miss_distance,
            is_sentry_object: asteroid.details.is_sentry_object,
          };
        }

        console.log("DATA: " + data);
        
        // add to asteroids database
        await this.http
          .post(this.urlAsteroidsBackend + '/InsertAsteroid', data, { observe: 'response' })
          .toPromise()
          .catch((err) => {
            console.log(err);
          });
      }
    }
    this.loadSavedAsteroids(); // TODO : Move this out of the function this is not clean code | Remove api call and simple update datasource
  }

  details(link: string) {
    window.open(link, '_blank');
  }

  isLoggedIn(){
    if(this.cookie.get("loggedIn") == "true") {
      return true;
    }
    else {
      return false;
    }
  }

}
