import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentNodeService } from '../../../services/studentNode.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tree-node-information',
  templateUrl: './tree-node-information.component.html',
  styleUrls: ['./tree-node-information.component.css'],
  standalone: false,
})
export class TreeNodeInformationComponent implements OnInit, OnDestroy {
  constructor(
    private readonly studentNodeService: StudentNodeService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.form.valueChanges.subscribe(() => {
      this.studentNodeService.setIsDirty(!!this.form.dirty);
    });
  }
  public form: FormGroup = new FormGroup({
    title: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required),
  });
  public types = [
    { id: 1, name: 'Folder' },
    { id: 0, name: 'File' },
  ];
  public subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.studentNodeService.nodeInformation$.subscribe((node) => {
        this.form.patchValue({
          title: node?.title,
          type: node?.type,
        });
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
