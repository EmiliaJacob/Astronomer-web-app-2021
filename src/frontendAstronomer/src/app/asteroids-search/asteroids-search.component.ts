import { Component, OnInit, ViewChild, AfterViewInit,} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger,} from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';
import { SavedAsteroidsComponent } from '../saved-asteroids/saved-asteroids.component';
import { CookieService } from 'ngx-cookie-service';

// interface for Search-Table-Data
export interface Asteroid {
  id: number;
  name: string;
  distance: string;
  diameter: string;
  date: string;
  link: string;
  details: AsteroidDetails;
  is_favorite: boolean;
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

// interface for additional data from second API (SBDB)
export interface AdditionalData {
  orbit_class: string;
}

// interface for "Search by ID" table
export interface Dates {
  date_time: string;
  relative_velocity: string;
  miss_distance: string;
  orbiting_body: string;
}

@Component({
  selector: 'app-asteroids-search',
  templateUrl: './asteroids-search.component.html',
  styleUrls: ['./asteroids-search.component.css'],
  providers: [DatePipe],
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
  ],

})

export class AsteroidsSearchComponent implements OnInit, AfterViewInit {
  // For updating star in saved asterois table:
  // https://angular.io/guide/component-interaction#parent-calls-an-viewchild
  @ViewChild(SavedAsteroidsComponent) savedAsteroids;

  //urls for service requests
  urlInsertAsteroid = 'http://193.197.231.179:3001/InsertAsteroid';
  urlNasaIntegration = 'http://193.197.231.179:3000';
  urlAsteroidsBackend = 'http://193.197.231.179:3001';
  urlUserService = 'http://193.197.231.179:3002';

  // result array for http requests
  asteroids: any = [];
  additionalData = '';

  // variables for searching by dates
  myDate = new Date();
  startDate = new Date();
  endDate = new Date();
  startDate_string = ''; // notwendig für die darstellung
  endDate_string = ''; // notwendig für die darstellung
  startDate_api = '';
  date_string: string;

  // variables for searching by ID
  searchId = '';
  idSearch = false;


  // variables for table of asteroid search data
  ELEMENT_DATA: Asteroid[] = [];
  displayedColumns = ['name', 'distance', 'diameter', 'date', 'link'];
  columnsToDisplay = [ // seperat wegen favorites
    'name',
    'distance',
    'diameter',
    'date',
    'link',
    'favorite',
  ];

  dataSource = new MatTableDataSource();
  expandedElement: Asteroid | null;

  @ViewChild('sorter1') sorter1: MatSort;


  // variables for Additional data
  out: string;

  // variables for table with dates (for "search by id")
  dataSourceDates = [];
  ELEMENT_DATA_DATES: Dates[] = [];
  displayedColumnsDates = [
    'date_time',
    'relative_velocity',
    'miss_distance',
    'orbiting_body',
  ];

  // favorite asteroids of user
  favorites = [];

// Everything for the saved asteroids table !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

///////////////////////////////////////////////////////////////////////////////////////////////////////////////7

  constructor(
    private cookie: CookieService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private router: Router
  ) {
    // default date as String for the 'Search by Timespan' input fileds
    this.startDate_string = this.datePipe.transform(
      this.startDate,
      'yyyy-MM-dd'
    );
    this.endDate_string = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    this.date_string = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }

  async ngOnInit() {
    this.date_string = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    //Load asteroids of today!----------------------------------------------------------------
    //request API
    this.http
      .get(this.urlNasaIntegration + '/nasa/neo/' + this.date_string + '/' + this.date_string)
      .toPromise()
      .then(async (res) => {
        // Success
        this.asteroids = res['near_earth_objects'];

        // get favorites of user
        await this.getFavorites();

        // get data
        this.asteroids[this.date_string].forEach((element) => {
          this.getAdditionalData(element);
        });
      });

  }

  ngAfterViewInit() {
    // Set default sort from user
    if (this.cookie.get('loggedIn') == 'true') {
      this.sorter1.sort(({
        id: this.cookie.get('sort'),
        start: 'asc'
      }) as MatSortable);

    }
    this.dataSource.sort = this.sorter1;
  }

  // Removes filled star from main table
  // called by app-child saved asteroids
  removeStarFromMainTable(asteroid:any) {
      for(let i = 0; i < this.ELEMENT_DATA.length; i++) { // TODO: maybe you can alter the datasource directly
        if(this.ELEMENT_DATA[i].id == asteroid.id) {
          this.ELEMENT_DATA[i].is_favorite = false;
          break;
        }
      }
      this.dataSource.data = this.ELEMENT_DATA;
  }

  // request userService to get Array with favorites
  async getFavorites() {
    this.favorites = [];
    // is user logged in?
    if (this.cookie.get('loggedIn') == 'true') {
      const userName = this.cookie.get('userName');
      await this.http.get(this.urlUserService + '/favorite?userName=' + userName, {observe: 'response'})
        .toPromise()
        .then((resp) => {
          for (let id in resp.body) {
            this.favorites.push(resp.body[id]);
          }
        });
    }
  }

  async getAdditionalData(element: Object) {
    // get name from Asteroid to request sbdb API
    this.out = element['name'].replace(/\s/g, '');
    this.out = this.out.replace('(', '');
    this.out = this.out.replace(')', '');
    console.log(this.out);

    // request API for additional Data
    // Note: Es muss kein Eintrag für diesen Asteroid vorhanden sein!
    // TODO: Bug, läuft zu schnell
    await this.http
      .get(this.urlNasaIntegration + '/nasa/sbdb/spk/' + this.out, {
        observe: 'response',
      })
      .toPromise()
      .then((resp) => {
        if (resp.status == 200) {
          console.log(resp);
          if (resp != undefined) {
            if(resp.body['object'] != undefined){
              this.additionalData = resp.body['object']['orbit_class']['name'];
            }else{
              this.additionalData = '';
            }
          } else {
            this.additionalData = '';
          }
        } else {
          console.log(resp);
          this.additionalData = '';
        }
        this.loadDataSource(element);
        // load data to html
        this.dataSource.data = this.ELEMENT_DATA;
      });
  }

  // Add the data to an Array for the table
  loadDataSource(element: Object) {
    var distance = '';
    var diameter = '';
    var miss_distance = '';

    // get default unit:
    if (this.cookie.get('loggedIn') == 'true') {
      if (this.cookie.get('unit') == 'miles') {
        distance =
          element['close_approach_data'][0]['miss_distance']['miles'] +
          ' miles';
        diameter =
          element['estimated_diameter']['miles']['estimated_diameter_max'] +
          ' miles';
      } else {
        distance =
          element['close_approach_data'][0]['miss_distance']['kilometers'] +
          ' km';
        diameter =
          element['estimated_diameter']['meters']['estimated_diameter_max'] +
          ' m';
      }
    } else {
      distance =
        element['close_approach_data'][0]['miss_distance']['kilometers'] +
        ' km';
      diameter =
        element['estimated_diameter']['meters']['estimated_diameter_max'] +
        ' m';
    }

    // Add asteroid data to ELEMENT_DATA-Array
    this.ELEMENT_DATA.push({
      id: element['id'],
      name: element['name'],
      distance: distance,
      diameter: diameter,
      date: element['close_approach_data'][0]['close_approach_date_full'],
      link: element['nasa_jpl_url'],
      details: {
        id: element['id'],
        potentially_hazardous: element['is_potentially_hazardous_asteroid'],
        close_approach_date:
          element['close_approach_data'][0]['close_approach_date_full'],
        relative_velocity:
          element['close_approach_data'][0]['relative_velocity'][
            'kilometers_per_second'
          ] + ' km/s',
        miss_distance:
          element['close_approach_data'][0]['miss_distance']['kilometers'] +
          ' km',
        is_sentry_object: element['is_sentry_object'],
        orbit_class: this.additionalData,
      },
      is_favorite: this.favorites.includes(element['id']),
    });
  }

  //  function to search asteroids by timespan
  getTimespan() {
    // to hide card with dates-column (just visible when you search by id)
    this.idSearch = false;

    // prepare date strings
    var startDate_api = '';
    var endDate_api = '';
    this.startDate = new Date(this.startDate_string);
    this.endDate = new Date(this.endDate_string);
    startDate_api = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    endDate_api = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');

    // get number of days
    var diff = Math.floor(
      (Date.UTC(
        this.endDate.getFullYear(),
        this.endDate.getMonth(),
        this.endDate.getDate()
      ) -
        Date.UTC(
          this.startDate.getFullYear(),
          this.startDate.getMonth(),
          this.startDate.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );

    // request API
    this.http
      .get(this.urlNasaIntegration+'/nasa/neo/' + startDate_api + '/' + endDate_api)
      .toPromise()
      .then(async (res) => {
        // Success
        this.asteroids = res['near_earth_objects'];
        this.ELEMENT_DATA = [];

        // load table data from api
        var date = startDate_api;

        for (var i = 0; i <= diff; i++) {
          // for each day load data source:
          await this.asteroids[date].forEach((element) => {
            this.getAdditionalData(element);
          });

          // set day +1 to get the array of this day
          this.startDate.setDate(this.startDate.getDate() + 1);
          date = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
        }
        // load to html
        this.dataSource.data = this.ELEMENT_DATA;
      });
  }

  // function to search an asteroid by id
  searchById() {
    this.http
      .get(this.urlNasaIntegration+'/nasa/lookup/' + this.searchId)
      .toPromise()
      .then((res) => {

        // Success
        this.asteroids = res;
        this.ELEMENT_DATA = [];

        // load table data from api
        this.getAdditionalData(this.asteroids);

        // load to html
        this.dataSource.data = this.ELEMENT_DATA;

        // load table data for close approach dates
        this.idSearch = true;
        this.asteroids['close_approach_data'].forEach((element) => {
          {
            this.ELEMENT_DATA_DATES.push({
              date_time: element['close_approach_date_full'],
              relative_velocity:
                element['relative_velocity']['kilometers_per_second'] + ' km/s',
              miss_distance: element['miss_distance']['kilometers'] + ' km',
              orbiting_body: element['orbiting_body'],
            });
          }
        });
        this.dataSourceDates = this.ELEMENT_DATA_DATES;
      });
  }

  // function to set favorite asteroid
  async favorite(asteroid: Asteroid) {
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
      this.removeStarFromMainTable(asteroid);
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
            link: asteroid.link,
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
            link: asteroid.link,
            potentially_hazardous: asteroid.details.potentially_hazardous,
            close_approach_date: asteroid.details.close_approach_date,
            relative_velocity: asteroid.details.relative_velocity,
            miss_distance: asteroid.details.miss_distance,
            is_sentry_object: asteroid.details.is_sentry_object,
          };
        }

        // add to asteroids database
        await this.http
          .post(this.urlAsteroidsBackend + '/InsertAsteroid', data, { observe: 'response' })
          .toPromise()
          .catch((err) => {
            console.log(err);
          });
      }
    }
    this.savedAsteroids.loadSavedAsteroids(); // start method from child component
  }

  // open jpk pages
  details(link: string) {
    window.open(link, '_blank');
  }
}
