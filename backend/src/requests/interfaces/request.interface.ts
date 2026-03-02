import { RequestStatus } from '../enums/request-status.enum';

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
