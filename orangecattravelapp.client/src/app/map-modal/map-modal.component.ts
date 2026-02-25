import { Component, Input, ViewChild, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMapsService, MapMarker } from '../services/google-maps.service';

declare var bootstrap: any;
declare var google: any;

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.css']
})
export class MapMapModalComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer') mapContainer: any;
  @Input() mainAttractionLat: number = 0;
  @Input() mainAttractionLng: number = 0;
  @Input() mainAttractionName: string = '';
  @Input() markers: MapMarker[] = [];
  @Output() markerClicked = new EventEmitter<MapMarker>();

  map: any = null;
  mapMarkers: any[] = [];
  infoWindows: any[] = [];
  selectedMarker: MapMarker | null = null;
  modalInstance: any;
  mapInitialized: boolean = false;

  constructor(private googleMapsService: GoogleMapsService) { }

  ngAfterViewInit(): void {
    // Don't initialize map yet, wait for input data
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When lat/lng inputs change and we have valid coordinates, initialize the map
    if ((changes['mainAttractionLat'] || changes['mainAttractionLng']) &&
      this.mainAttractionLat !== 0 &&
      this.mainAttractionLng !== 0 &&
      this.mapContainer &&
      !this.mapInitialized) {
      this.initializeMap();
    }

    // If markers change after map is initialized, refresh the nearby markers
    if (changes['markers'] && this.mapInitialized && !changes['markers'].firstChange) {
      // Clear existing nearby markers (but keep the main attraction marker)
      this.mapMarkers.slice(1).forEach(marker => marker.setMap(null));
      this.mapMarkers = this.mapMarkers.slice(0, 1); // Keep only the main marker
      this.addNearbyMarkers();
    }
  }

  private initializeMap(): void {
    if (!this.mapContainer || this.mapInitialized) return;

    // Small delay to ensure the container is ready
    setTimeout(() => {
      const mapOptions: any = {
        zoom: 14,
        center: { lat: this.mainAttractionLat, lng: this.mainAttractionLng },
        mapTypeId: 'roadmap'
      };

      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
      this.mapInitialized = true;

      console.log('Map initialized:', this.map);

      // Add main attraction marker
      this.addMainAttractionMarker();

      // Add nearby location markers
      this.addNearbyMarkers();
    }, 100);
  }

  private addMainAttractionMarker(): void {
    if (!this.map) return;

    const mainMarker = new google.maps.Marker({
      position: { lat: this.mainAttractionLat, lng: this.mainAttractionLng },
      map: this.map,
      title: this.mainAttractionName,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' // Red marker for main attraction
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div><strong>${this.mainAttractionName}</strong></div>`
    });

    mainMarker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, mainMarker);
      this.infoWindows.push(infoWindow);
    });

    this.mapMarkers.push(mainMarker);
    console.log('Main marker added');
  }

  private addNearbyMarkers(): void {
    if (!this.map) return;

    console.log('Adding nearby markers:', this.markers.length);

    this.markers.forEach(marker => {
      /*console.log('Creating marker:', marker);*/

      // Build the description with additional info
      let infoContent = `<div><strong>${marker.title}</strong><br>${marker.description}`;

      if (marker.type === 'restaurant' && marker.foodType) {
        infoContent += `<br><strong>Cuisine:</strong> ${marker.foodType}`;
      }

      infoContent += '</div>';

      const googleMarker = new google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: this.map,
        title: marker.title,
        icon: this.getMarkerIcon(marker.type)
      });

      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });

      googleMarker.addListener('click', () => {
        this.closeAllInfoWindows();
        infoWindow.open(this.map, googleMarker);
        this.infoWindows.push(infoWindow);
        this.selectedMarker = marker;
        this.markerClicked.emit(marker);
      });

      this.mapMarkers.push(googleMarker);
    });

    /*console.log('Total markers added:', this.mapMarkers.length);*/
  }

  private getMarkerIcon(type: 'attraction' | 'restaurant' | 'hotel'): string {
    const icons: Record<string, string> = {
      attraction: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      restaurant: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      hotel: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
    };
    return icons[type];
  }

  /**
   * Close all open info windows
   */
  private closeAllInfoWindows(): void {
    this.infoWindows.forEach(infoWindow => {
      infoWindow.close();
    });
    this.infoWindows = [];
  }

  /**
   * Handle backdrop click - close modal if clicking outside the content
   */
  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Only close if clicking directly on the modal backdrop (the outer div)
    if (target.id === 'mapModal') {
      this.closeModal();
    }
  }

  openModal(): void {
    const modalElement = document.getElementById('mapModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);

      // Listen for modal shown event to trigger map resize
      modalElement.addEventListener('shown.bs.modal', () => {
        if (this.map) {
          console.log('Triggering map resize');
          google.maps.event.trigger(this.map, 'resize');
          // Re-center the map after resize
          this.map.setCenter({ lat: this.mainAttractionLat, lng: this.mainAttractionLng });
        }
      });

      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
}
