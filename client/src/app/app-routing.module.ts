import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { PlayComponent } from './components/play/play.component';
import { PostgameComponent } from './components/postgame/postgame.component';

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
}, {
  path: 'postgame',
  component: PostgameComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
