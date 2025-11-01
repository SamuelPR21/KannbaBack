// src/task/DTO/responses/update-task-proyect.response.dto.ts
export class UpdateTaskProyectResponseDTO {
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

  constructor(partial: Partial<UpdateTaskProyectResponseDTO>) {
    Object.assign(this, partial);
  }
}
