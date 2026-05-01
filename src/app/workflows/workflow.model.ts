export interface Workflow {
  id: string;
  name: string;
  createdAt: string;
}

export type CreateWorkflowRequest = Pick<Workflow, 'name'>;
export type UpdateWorkflowRequest = Partial<Omit<Workflow, 'id'>>;
