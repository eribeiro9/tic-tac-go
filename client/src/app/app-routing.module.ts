import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { PlayComponent } from './components/play/play.component';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: HomeComponent,
}, {
  path: 'lobby',
  component: LobbyComponent,
}, {
  path: 'play',
  component: PlayComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
