import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'my-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './content.html',
  styleUrls: ['./content.css'],
})
export class ContentComponent {
  @Input() selectedItem?: string;
}
