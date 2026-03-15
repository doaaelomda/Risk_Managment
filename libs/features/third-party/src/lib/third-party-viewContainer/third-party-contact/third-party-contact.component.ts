import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from '../../contact-list/contact-list.component';

@Component({
  selector: 'lib-third-party-contact',
  imports: [CommonModule,ContactListComponent],
  templateUrl: './third-party-contact.component.html',
  styleUrl: './third-party-contact.component.scss',
})
export class ThirdPartyContactComponent {

}
