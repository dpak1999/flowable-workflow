import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

import { Workflow } from './workflow.model';
import { WorkflowService } from './workflow.service';

@Component({
  selector: 'app-workflow-details',
  imports: [Button, DatePipe, RouterLink],
  templateUrl: './workflow-details.component.html',
  styleUrl: './workflow-details.component.scss'
})
export class WorkflowDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly workflowService = inject(WorkflowService);

  protected readonly workflow = signal<Workflow | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Workflow ID is missing.');
      return;
    }

    this.isLoading.set(true);

    this.workflowService.getWorkflow(id).subscribe({
      next: (workflow) => {
        this.workflow.set(workflow);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load this workflow.');
        this.isLoading.set(false);
      }
    });
  }
}
