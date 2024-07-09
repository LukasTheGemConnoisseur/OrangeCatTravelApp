import { Component, OnInit } from '@angular/core';
import { AttractionService } from '../attraction.service';



@Component({
  selector: 'app-destination-attraction-list',
  templateUrl: './destination-attraction-list.component.html',
  styleUrls: ['./destination-attraction-list.component.css']
})
export class DestinationAttractionListComponent implements OnInit {
  attractions: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  destinationName: string = 'Wisconsin Dells'; // Default name
  showFilters: boolean = false;
  filters: any = {
    filter1: '',
    filter2: ''
  };

  constructor(private attractionService: AttractionService) { }

  ngOnInit(): void {
    this.loadAttractions();
  }

  loadAttractions(): void {
    this.attractionService.getAttractions(this.currentPage, this.pageSize).subscribe((data: any[]) => {
      this.attractions = [...this.attractions, ...data];
    });
  }

  loadMore(): void {
    this.currentPage++;
    this.loadAttractions();
  }
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    // Add logic to filter attractions based on the filters
    console.log('Applying filters:', this.filters);
    this.showFilters = !this.showFilters;
    // Example: Filter attractions locally
    // this.attractions = this.attractions.filter(attraction => {
    //   return attraction.name.includes(this.filters.filter1) &&
    //          attraction.description.includes(this.filters.filter2);
    // });
  }
}
