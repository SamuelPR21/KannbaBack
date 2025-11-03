// src/task/DTO/responses/detail-task-proyect.response.dto.ts
export class DetailTaskProyectResponseDTO {
  taskId: number;
  proyectId: number;
  name: string;
  description?: string;
  state: 'BACKLOG' | 'TO_DO' | 'DOING' | 'DONE';
  responsible: {
    userProyectId: number;
    userId: number;
    username: string;
    role: string;
  };

  constructor(partial: Partial<DetailTaskProyectResponseDTO>) {
    Object.assign(this, partial);
  }
}
