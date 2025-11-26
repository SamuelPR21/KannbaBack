// src/task/DTO/taskPersonal/task-personal-response.dto.ts

export class TaskPersonalResponseDto {
  id: number;
  name: string;
  description: string;
  userId: number;
  stateId: number;
  // Nombre del estado en formato enum del backend
  stateName: 'BACKLOG' | 'TO_DO' | 'DOING' | 'DONE';
}
