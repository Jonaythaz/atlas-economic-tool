import type { WorkflowState } from '@atlas/types';

export class WorkflowError extends Error {
	readonly type = 'workflow-error';

	readonly severity: Severity;

	constructor(severity: Severity, message?: string, options?: ErrorOptions) {
		super(message, options);
		this.severity = severity;
	}
}

type Severity = Extract<WorkflowState, 'blocked' | 'failed'>;
