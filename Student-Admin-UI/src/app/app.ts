import { Component, ViewEncapsulation } from '@angular/core';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { DrawerItem, DrawerSelectEvent, KENDO_LAYOUT } from '@progress/kendo-angular-layout';
import {
  SVGIcon,
  bellIcon,
  calendarIcon,
  envelopeLinkIcon,
  inboxIcon,
  menuIcon,
  starOutlineIcon,
} from '@progress/kendo-svg-icons';
import { ContentComponent } from './content/content';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  imports: [KENDO_LAYOUT, ContentComponent, KENDO_BUTTONS],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.css'],
})
export class AppComponent {
  public selected = 'Inbox';
  public menuSvg: SVGIcon = menuIcon;

  public items: Array<DrawerItem> = [
    { text: 'Inbox', svgIcon: inboxIcon, selected: true },
    { separator: true },
    { text: 'Notifications', svgIcon: bellIcon },
    { text: 'Calendar', svgIcon: calendarIcon },
    { separator: true },
    { text: 'Attachments', svgIcon: envelopeLinkIcon },
    { text: 'Favourites', svgIcon: starOutlineIcon },
  ];

  public onSelect(ev: DrawerSelectEvent): void {
    this.selected = ev.item.text;
  }
}
