// src/task/DTO/responses/create-task-proyect.response.dto.ts
export class CreateTaskProyectResponseDTO {
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

  constructor(partial: Partial<CreateTaskProyectResponseDTO>) {
    Object.assign(this, partial);
  }
}
