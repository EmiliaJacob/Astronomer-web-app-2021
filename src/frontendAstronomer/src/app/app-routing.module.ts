import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AsteroidsSearchComponent} from './asteroids-search/asteroids-search.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {FireballComponent} from './fireball/fireball.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {AppComponent} from './app.component'

const routes: Routes = [
  {path: 'Asteroids-Search', component: AsteroidsSearchComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'User-Profile', component: UserProfileComponent},
  {path: 'fireball', component: FireballComponent},
  {path: 'edit-profile', component: EditProfileComponent},
  {path: '',  component: AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
