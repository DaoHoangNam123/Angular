import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { StudentNodeService } from '../../../services/studentNode.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ITreeNode } from '../../../models/treeNode.model';
import { APP_CONSTANTS } from '../../../constants/app.constants';

interface NodeType {
  id: number;
  name: string;
}

@Component({
  selector: 'app-tree-node-information',
  templateUrl: './tree-node-information.component.html',
  styleUrls: ['./tree-node-information.component.css'],
  standalone: false,
})
export class TreeNodeInformationComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public types: NodeType[] = [
    { id: APP_CONSTANTS.TREE_NODE_TYPES.FOLDER, name: 'Folder' },
    { id: APP_CONSTANTS.TREE_NODE_TYPES.FILE, name: 'File' },
  ];
  public isDirty = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly studentNodeService: StudentNodeService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.form = this.createForm({});
  }

  private createForm(form: any): FormGroup {
    return new FormGroup({
      title: new FormControl(form?.title ?? '', [Validators.required]),
      type: new FormControl(form?.type ?? null, Validators.required),
      id: new FormControl(form?.id ?? '', Validators.required),
    });
  }

  private setupFormChangeListener(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((form) => {
      this.studentNodeService.setNodeForm(form);
      this.studentNodeService.setIsDirty(this.form.dirty);
    });
  }

  public resetForm(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.studentNodeService.setIsDirty(false);
  }

  public updateForm(node: ITreeNode | null): void {
    if (node) {
      this.form = this.createForm(node);
      this.setupFormChangeListener();
    } else {
      this.resetForm();
    }
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.studentNodeService.nodeInformation$.subscribe((nodeInformation) => {
      this.updateForm(nodeInformation);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
