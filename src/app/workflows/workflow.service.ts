import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateWorkflowRequest, UpdateWorkflowRequest, Workflow } from './workflow.model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private readonly http = inject(HttpClient);
  private readonly workflowsUrl = 'http://localhost:3000/workflows';

  getWorkflows(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(this.workflowsUrl);
  }

  createWorkflow(request: CreateWorkflowRequest): Observable<Workflow> {
    return this.http.post<Workflow>(this.workflowsUrl, {
      name: request.name,
      status: 'draft',
      owner: 'Workflow team',
      updatedAt: new Date().toISOString()
    });
  }

  updateWorkflow(id: string, request: UpdateWorkflowRequest): Observable<Workflow> {
    return this.http.patch<Workflow>(`${this.workflowsUrl}/${id}`, {
      ...request,
      updatedAt: new Date().toISOString()
    });
  }

  deleteWorkflow(id: string): Observable<Workflow> {
    return this.http.delete<Workflow>(`${this.workflowsUrl}/${id}`);
  }
}
