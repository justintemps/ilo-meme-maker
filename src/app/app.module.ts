import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { MdbModule } from 'mdb-angular-ui-kit';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlPannelComponent } from './control-pannel/control-pannel.component';
import { MemeProvider } from './meme-provider.service';

@NgModule({
  declarations: [AppComponent, CanvasComponent, ControlPannelComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MdbModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [MemeProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
