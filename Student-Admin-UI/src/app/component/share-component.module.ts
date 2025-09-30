import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StudentGridComponent } from './StudentGrid/student-grid.component';
import { ToasterComponent } from './Toaster/toaster.component';
import { StudentPopupComponent } from './StudentPopup/student-popup.component';
import { StudentFormComponent } from './StudentForm/student-form.component';
import { HeaderComponent } from './Header/header.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { TreeNodeComponent } from './TreeModule/TreeNode/tree-node.component';
import { TreeNodeInformationComponent } from './TreeModule/TreeNodeInformation/tree-node-information.component';
import { TreeAttributeComponent } from './TreeModule/TreeAttribute/tree-attribute.component';
import { TreeViewComponent } from './TreeModule/TreeView/tree-view.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TreeTabComponent } from './TreeModule/TreeTab/tree-tab.component';
@NgModule({
  declarations: [
    StudentGridComponent,
    ToasterComponent,
    StudentPopupComponent,
    StudentFormComponent,
    HeaderComponent,
    TreeViewComponent,
    TreeNodeComponent,
    TreeNodeInformationComponent,
    TreeAttributeComponent,
    TreeTabComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    GridModule,
    InputsModule,
    LabelModule,
    NotificationModule,
    TreeViewModule,
    MatTabsModule,
  ],
  exports: [
    StudentGridComponent,
    ToasterComponent,
    StudentPopupComponent,
    StudentFormComponent,
    HeaderComponent,
    TreeViewComponent,
    TreeNodeComponent,
    TreeNodeInformationComponent,
    TreeAttributeComponent,
    TreeTabComponent,
  ],
})
export class SharedComponentModule {}
