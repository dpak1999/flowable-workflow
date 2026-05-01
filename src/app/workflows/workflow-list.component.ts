import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { Workflow } from './workflow.model';
import { WorkflowService } from './workflow.service';

@Component({
  selector: 'app-workflow-list',
  imports: [Button, DatePipe, Dialog, InputText, ReactiveFormsModule, TableModule],
  templateUrl: './workflow-list.component.html',
  styleUrl: './workflow-list.component.scss'
})
export class WorkflowListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly workflowService = inject(WorkflowService);

  protected readonly workflows = signal<Workflow[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly deletingWorkflowId = signal<string | null>(null);
  protected readonly showAddWorkflowDialog = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly workflowName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(80)]
  });

  ngOnInit(): void {
    this.loadWorkflows();
  }

  protected openAddWorkflowDialog(): void {
    this.workflowName.reset('');
    this.showAddWorkflowDialog.set(true);
  }

  protected closeAddWorkflowDialog(): void {
    this.showAddWorkflowDialog.set(false);
  }

  protected saveWorkflow(): void {
    this.workflowName.markAsTouched();
    const workflowName = this.workflowName.value.trim();

    if (!workflowName || this.workflowName.invalid || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.workflowService.createWorkflow({ name: workflowName }).subscribe({
      next: (workflow) => {
        this.workflows.update((workflows) => [...workflows, workflow]);
        this.isSaving.set(false);
        this.showAddWorkflowDialog.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not create the workflow. Check that the local JSON server is running.');
        this.isSaving.set(false);
      }
    });
  }

  protected openWorkflow(workflow: Workflow): void {
    void this.router.navigate(['/workflow', workflow.id]);
  }

  protected deleteWorkflow(workflow: Workflow, event: MouseEvent): void {
    event.stopPropagation();

    if (this.deletingWorkflowId()) {
      return;
    }

    this.deletingWorkflowId.set(workflow.id);
    this.errorMessage.set('');

    this.workflowService.deleteWorkflow(workflow.id).subscribe({
      next: () => {
        this.workflows.update((workflows) => workflows.filter((item) => item.id !== workflow.id));
        this.deletingWorkflowId.set(null);
      },
      error: () => {
        this.errorMessage.set('Could not delete the workflow. Check that the local JSON server is running.');
        this.deletingWorkflowId.set(null);
      }
    });
  }

  private loadWorkflows(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.workflowService.getWorkflows().subscribe({
      next: (workflows) => {
        this.workflows.set(workflows);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load workflows. Start the local JSON server with npm run server.');
        this.isLoading.set(false);
      }
    });
  }
}
