import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DestinationOverviewComponent } from './destination-overview/destination-overview.component';
import { DestinationAttractionListComponent } from './destination-attraction-list/destination-attraction-list.component';
import { DestinationAttractionDetailsComponent } from './destination-attraction-details/destination-attraction-details.component';
import { DestinationRestaurantListComponent } from './destination-restaurant-list/destination-restaurant-list.component';
import { DestinationRestaurantDetailsComponent } from './destination-restaurant-details/destination-restaurant-details.component';
import { DestinationHotelListComponent } from './destination-hotel-list/destination-hotel-list.component';
import { DestinationHotelDetailsComponent } from './destination-hotel-details/destination-hotel-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'destination-overview/:destination', component: DestinationOverviewComponent },
  { path: 'destination-attraction-list', component: DestinationAttractionListComponent },
  { path: 'destination-attraction-details', component: DestinationAttractionDetailsComponent },
  { path: 'destination-restaurant-list', component: DestinationRestaurantListComponent },
  { path: 'destination-restaurant-details', component: DestinationRestaurantDetailsComponent },
  { path: 'destination-hotel-list', component: DestinationHotelListComponent },
  { path: 'destination-hotel-details', component: DestinationHotelDetailsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
