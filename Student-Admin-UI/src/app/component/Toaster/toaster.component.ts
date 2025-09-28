import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  NotificationRef,
  NotificationService,
  NotificationSettings,
} from '@progress/kendo-angular-notification';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css'],
  standalone: false,
})
export class ToasterComponent {
  @ViewChild('notification', { read: TemplateRef })
  public notificationTemplate!: TemplateRef<any>;
  public notificationReference!: NotificationRef;
  public state: NotificationSettings = {
    content: 'Your data has been saved.',
    type: { style: 'success', icon: true },
    animation: { type: 'slide', duration: 400 },
    hideAfter: 5000,
    position: { horizontal: 'right', vertical: 'bottom' },
  };

  constructor(private readonly notificationService: NotificationService) {}

  public close(): void {
    this.notificationReference.hide();
  }

  public showNotification(
    style: 'none' | 'success' | 'warning' | 'error' | 'info' | undefined,
    content: string
  ): void {
    this.state.content = content;
    this.state.type = { style, icon: true };
    this.notificationService.show(this.state);
  }
}
