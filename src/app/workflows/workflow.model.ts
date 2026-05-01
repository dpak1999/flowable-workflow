export interface Workflow {
  id: string;
  name: string;
  status: 'draft' | 'active';
  owner: string;
  updatedAt: string;
}

export type CreateWorkflowRequest = Pick<Workflow, 'name'>;
export type UpdateWorkflowRequest = Partial<Omit<Workflow, 'id'>>;
