import { Routes } from '@angular/router';

import { WorkflowDetailsComponent } from './workflows/workflow-details.component';
import { WorkflowListComponent } from './workflows/workflow-list.component';

export const routes: Routes = [
  {
    path: '',
    component: WorkflowListComponent
  },
  {
    path: 'workflow/:id',
    component: WorkflowDetailsComponent
  }
];
