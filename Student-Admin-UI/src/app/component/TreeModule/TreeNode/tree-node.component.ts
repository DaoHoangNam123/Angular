import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ITreeNode } from '../../../models/treeNode.model';
import { StudentNodeService } from '../../../services/studentNode.service';
import { TreeNodeInformationComponent } from '../TreeNodeInformation/tree-node-information.component';
import { TreeTabComponent } from '../TreeTab/tree-tab.component';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ToasterComponent } from '../../Toaster/toaster.component';
import { TreeAttributeComponent } from '../TreeAttribute/tree-attribute.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css'],
  standalone: false,
})
export class TreeNodeComponent implements OnInit, OnDestroy {
  constructor(
    private readonly studentNodeService: StudentNodeService,
    private readonly dialogService: DialogService,
    private readonly dialogWarningService: DialogService
  ) {}
  @ViewChild(TreeNodeInformationComponent) nodeInfor!: TreeNodeInformationComponent;

  public subscription = new Subscription();
  public selectedNode: ITreeNode | null = null;
  public isReadOnly: boolean = true;
  public isDirty: boolean = false;
  public isAttributeDirty: boolean = false;
  public title = '';
  public type = null;

  editNodeDetails() {
    this.isReadOnly = false;

    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Please edit node details',
      content: TreeTabComponent,
      actions: [{ text: 'Cancel' }, { text: 'Save', themeColor: 'primary' }],
      width: '70vw',
      height: 'max-content',
    });
    const treeTab = dialogRef.content.instance as TreeTabComponent;
    treeTab.nodeDetails = this.selectedNode;
    treeTab.isReadOnly = false;

    dialogRef.result.subscribe((result: any) => {
      if (result && result.text === 'Save') {
        this.onClickSaveDialog(treeTab);
      }
      console.log(this.isDirty);
      console.log(this.isAttributeDirty);
      if (result && result.text === 'Cancel' && (this.isDirty || this.isAttributeDirty)) {
        this.onClickCancelDialog(treeTab);
      }
    });
  }

  onClickCancelDialog(component: any) {
    const confirmRef: DialogRef = this.dialogWarningService.open({
      title: 'Please edit node details',
      content: 'Your changes are not saved. Do you want to save?',
      actions: [{ text: 'No' }, { text: 'Yes', themeColor: 'primary' }],
      width: '400',
      height: '200',
    });

    confirmRef.result.subscribe((result: any) => {
      if (result && result.text === 'Yes') {
        this.title = component.nodeInfor.form.get('title')?.value;
        this.type = component.nodeInfor.form.get('type')?.value;
        this.saveNode(component.nodeInfor.form);
      }
    });
  }

  onClickSaveDialog(component: any) {
    if (this.isDirty) {
      this.title = component.nodeInfor.form.get('title')?.value;
      this.type = component.nodeInfor.form.get('type')?.value;
      this.saveNode(component.nodeInfor.form);
    }
  }
  /* 
    Click save node information button 
  */
  saveNode(form: FormGroup) {
    if (this.selectedNode) {
      const title = form.get('title')?.value;
      const type = form.get('type')?.value;
      this.subscription.add(
        this.studentNodeService.onSaveNode(this.selectedNode.id, {
          title,
          type,
        })
      );
    }
  }

  // Lifecycle hooks
  ngOnInit(): void {
    this.subscription.add(
      this.studentNodeService.nodeInformation$.subscribe((node) => {
        this.selectedNode = node;
      })
    );

    this.studentNodeService.isDirty$.subscribe((value) => {
      this.isDirty = value;
    });

    this.studentNodeService.isAttributeDirty$.subscribe((value) => {
      this.isAttributeDirty = value;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
