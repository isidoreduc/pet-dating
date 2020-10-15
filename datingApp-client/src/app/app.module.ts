import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ValuesComponent } from './values/values.component';

@NgModule({
  declarations: [
    AppComponent,
    ValuesComponent
  ],
  imports: [
    BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
