// src/user_Proyetc/DTO/ProyectByUserResponseDTO.dto.ts

export interface TaskPreviewDTO {
  id: number;
  name: string;
}

export class ProyectByUserResponseDTO {
  proyectId: number;
  proyectName: string;
  categoryName: string | null;
  role: string;

  // 👇 NUEVO
  tasksCount: number;
  membersCount: number;
  tasksPreview: TaskPreviewDTO[];

  constructor(partial: Partial<ProyectByUserResponseDTO>) {
    Object.assign(this, partial);
  }
}
