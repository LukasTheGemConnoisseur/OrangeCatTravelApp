import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'; // Import RouterModule and Routes
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SuggestedTravelDestinationsComponent } from './suggested-travel-destinations/suggested-travel-destinations.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CarouselComponent } from './carousel/carousel.component';
import { DestinationOverviewComponent } from './destination-overview/destination-overview.component';
import { DestinationAttractionListComponent } from './destination-attraction-list/destination-attraction-list.component';
import { ChunkPipe } from './chunk.pipe';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'destination-overview', component: DestinationOverviewComponent },
  { path: 'destination-attraction-list', component: DestinationAttractionListComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    SearchBarComponent,
    SuggestedTravelDestinationsComponent,
    UserProfileComponent,
    CarouselComponent,
    DestinationOverviewComponent,
    DestinationAttractionListComponent,
    ChunkPipe
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule.forRoot(routes), FormsModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
