import { Component, NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { fr_FR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { DashBoardComponent } from './dashboard/dashboard.component';
import { PlaylistComponent } from './playlist/playlist.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/devices', pathMatch: 'full'},
  { path: 'devices', component: DashBoardComponent },
  { path: 'devices/:id/playlist', component: PlaylistComponent },
];

registerLocaleData(fr);

@NgModule({
  declarations: [
    AppComponent,
    DashBoardComponent,
    PlaylistComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NzTableModule,
    NzUploadModule,
    NzModalModule,
    NzGridModule,
    NzIconModule,
    NzButtonModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    { provide: NZ_I18N, useValue: fr_FR },
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
