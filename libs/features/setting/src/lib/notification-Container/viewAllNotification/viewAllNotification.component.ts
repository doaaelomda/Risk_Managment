import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'lib-view-all-notification',
  imports: [CommonModule],
  templateUrl: './viewAllNotification.component.html',
  styleUrl: './viewAllNotification.component.scss',
})
export class ViewAllNotificationComponent {
  breadCrumb:any

  notifications = [
    {
      id: 1,
      title: 'New Feature Available',
      description:
        'Check out the latest updates in the application.Check out the latest updates in the application.',
      avatar: 'images/icons/notify.svg',
      isRead: false,
      time: '2 hours ago',
      user: 'Webflow 101',
    },
    {
      id: 2,
      title: 'New Feature Available',
      description:
        'Check out the latest updates in the application.Check out the latest updates in the application.',
      avatar: 'images/icons/notify.svg',
      isRead: false,
      time: '2 hours ago',
      user: 'Webflow 101',
    },
    {
      id: 3,
      title: 'New Feature Available',
      description:
        'Check out the latest updates in the application.Check out the latest updates in the application.',
      avatar: 'images/icons/notify.svg',
      isRead: false,
      time: '2 hours ago',
      user: 'Webflow 101',
    },
    {
      id: 4,
      title: 'New Feature Available',
      description:
        'Check out the latest updates in the application.Check out the latest updates in the application.',
      avatar: 'images/icons/notify.svg',
      isRead: false,
      time: '2 hours ago',
      user: 'Webflow 101',
    },
    {
      id: 5,
      title: 'New Feature Available',
      description:
        'Check out the latest updates in the application.Check out the latest updates in the application.',
      avatar: 'images/icons/notify.svg',
      isRead: false,
      time: '2 hours ago',
      user: 'Webflow 101',
    },

    {
      id: 6,
      title: 'New Feature Available',
      description:
        'Check out the latest updates in the application.Check out the latest updates in the application.',
      avatar: 'images/icons/notify.svg',
      isRead: false,
      time: '2 hours ago',
      user: 'Webflow 101',
    },
  ];
}
