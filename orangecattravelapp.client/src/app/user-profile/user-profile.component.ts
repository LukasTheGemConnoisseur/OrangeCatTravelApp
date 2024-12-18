
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  userName: string = 'Simba Karuza'; // Default name
  userUsername: string = 'simbaK45678'; // Default username
  aboutMe: string = ''; // Initialize with user's about me data
  emailPreference: boolean = false;
  textPreference: boolean = false;
  bothPreference: boolean = false;
  showEmailInput: boolean = false;
  showTextInput: boolean = false;
  showBothInput: boolean = false;
  emailAddress: string = '';
  phoneNumber: string = '';

  toggleEmailInput() {
    if (!this.showEmailInput) {
      // Show email input and reset others
      this.showEmailInput = true;
      this.showTextInput = false;
      this.showBothInput = false;

      // Update preferences
      this.emailPreference = true;
      this.textPreference = false;
      this.bothPreference = false;
    } else {
      // Hide email input and reset preference
      this.showEmailInput = false;
      this.emailPreference = false;
      this.emailAddress = ''; // Reset email value
    }
  }

  toggleTextInput() {
    if (!this.showTextInput) {
      // Show text input and reset others
      this.showTextInput = true;
      this.showEmailInput = false;
      this.showBothInput = false;

      // Update preferences
      this.textPreference = true;
      this.emailPreference = false;
      this.bothPreference = false;
    } else {
      // Hide text input and reset preference
      this.showTextInput = false;
      this.textPreference = false;
      this.phoneNumber = ''; // Reset text value
    }
  }

  toggleBothInput() {
    if (!this.showBothInput) {
      // Show both inputs and reset others
      this.showBothInput = true;
      this.showEmailInput = false;
      this.showTextInput = false;

      // Update preferences
      this.bothPreference = true;
      this.emailPreference = false;
      this.textPreference = false;
    } else {
      // Hide both inputs and reset preferences
      this.showBothInput = false;
      this.bothPreference = false;
      this.emailAddress = ''; // Reset email value
      this.phoneNumber = ''; // Reset text value
    }
  }

  saveChanges() {
    // Implement save logic (e.g., API call to update preferences)
  }

  cancelChanges() {
    // Implement cancel logic (reset form values if needed)
    this.emailPreference = false;
    this.textPreference = false;
    this.bothPreference = false;
    this.showEmailInput = false;
    this.showTextInput = false;
    this.showBothInput = false;
    this.emailAddress = '';
    this.phoneNumber = '';
  }
}

