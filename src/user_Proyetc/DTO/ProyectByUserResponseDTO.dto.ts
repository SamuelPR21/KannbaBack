export class ProyectByUserResponseDTO {
    proyectId: number;
    proyectName: string;
    categoryName: string;
    role: string;
  
    constructor(partial: Partial<ProyectByUserResponseDTO>) {
      Object.assign(this, partial);
    }
  }
  