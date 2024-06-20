
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
    this.showEmailInput = this.emailPreference;
    if (!this.emailPreference) {
      this.emailAddress = ''; // Reset email input value if checkbox is unchecked
    }
  }

  toggleTextInput() {
    this.showTextInput = this.textPreference;
    if (!this.textPreference) {
      this.phoneNumber = ''; // Reset text input value if checkbox is unchecked
    }
  }

  toggleBothInput() {
    this.showBothInput = this.bothPreference;
    if (!this.bothPreference) {
      this.emailAddress = ''; // Reset email input value if checkbox is unchecked
      this.phoneNumber = ''; // Reset text input value if checkbox is unchecked
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

