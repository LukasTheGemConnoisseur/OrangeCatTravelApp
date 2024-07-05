import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttractionService {

  private attractions = [
    { Id: 1, Name: 'Attraction 1', Description: 'Description 1', ImageUrl: 'https://picsum.photos/400/300?random=1', Review: 'Review 1' },
    { Id: 2, Name: 'Attraction 2', Description: 'Description 2', ImageUrl: 'https://picsum.photos/400/300?random=2', Review: 'Review 2' },
    { Id: 3, Name: 'Attraction 3', Description: 'Description 3', ImageUrl: 'https://picsum.photos/400/300?random=3', Review: 'Review 3' },
    { Id: 4, Name: 'Attraction 4', Description: 'Description 4', ImageUrl: 'https://picsum.photos/400/300?random=4', Review: 'Review 4' },
    { Id: 5, Name: 'Attraction 5', Description: 'Description 5', ImageUrl: 'https://picsum.photos/400/300?random=5', Review: 'Review 5' },
    { Id: 6, Name: 'Attraction 6', Description: 'Description 6', ImageUrl: 'https://picsum.photos/400/300?random=6', Review: 'Review 6' },
    { Id: 7, Name: 'Attraction 7', Description: 'Description 7', ImageUrl: 'https://picsum.photos/400/300?random=7', Review: 'Review 7' },
    { Id: 8, Name: 'Attraction 8', Description: 'Description 8', ImageUrl: 'https://picsum.photos/400/300?random=8', Review: 'Review 8' },
    { Id: 9, Name: 'Attraction 9', Description: 'Description 9', ImageUrl: 'https://picsum.photos/400/300?random=9', Review: 'Review 9' },
    { Id: 10, Name: 'Attraction 10', Description: 'Description 10', ImageUrl: 'https://picsum.photos/400/300?random=10', Review: 'Review 10' }
  ];

  constructor() { }

  getAttractions(page: number, pageSize: number): Observable<any[]> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagedAttractions = this.attractions.slice(startIndex, endIndex);
    return of(pagedAttractions);
  }
}
