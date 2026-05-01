import { DatePipe } from '@angular/common';
import { Component, HostBinding, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { Workflow } from './workflows/workflow.model';
import { WorkflowService } from './workflows/workflow.service';

@Component({
  selector: 'app-root',
  imports: [Button, DatePipe, Dialog, InputText, ReactiveFormsModule, TableModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly themeStorageKey = 'flowable-workflow-theme';
  private readonly workflowService = inject(WorkflowService);

  protected readonly title = signal('flowable-workflow');
  protected readonly isDarkTheme = signal(this.getInitialTheme());
  protected readonly workflows = signal<Workflow[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly showAddWorkflowDialog = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly workflowName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(80)]
  });

  ngOnInit(): void {
    this.loadWorkflows();
  }

  @HostBinding('class.dark-theme')
  protected get darkThemeClass(): boolean {
    return this.isDarkTheme();
  }

  protected toggleTheme(): void {
    this.isDarkTheme.update((isDark) => {
      const nextTheme = !isDark;
      this.storeTheme(nextTheme);

      return nextTheme;
    });
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

    if (this.workflowName.invalid || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.workflowService.createWorkflow({ name: this.workflowName.value.trim() }).subscribe({
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

  private getInitialTheme(): boolean {
    try {
      const storedTheme = globalThis.localStorage?.getItem(this.themeStorageKey);

      if (storedTheme) {
        return storedTheme === 'dark';
      }

      return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  }

  private storeTheme(isDark: boolean): void {
    try {
      globalThis.localStorage?.setItem(this.themeStorageKey, isDark ? 'dark' : 'light');
    } catch {
      // Theme persistence is optional; the toggle still works without storage access.
    }
  }
}
