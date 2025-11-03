// src/task/DTO/responses/list-task-proyect.response.dto.ts
export class ListTaskProyectItemDTO {
  taskId: number;
  name: string;
  state: 'BACKLOG' | 'TO_DO' | 'DOING' | 'DONE';
  responsible: {
    userProyectId: number;
    username: string;
  };

  constructor(partial: Partial<ListTaskProyectItemDTO>) {
    Object.assign(this, partial);
  }
}
