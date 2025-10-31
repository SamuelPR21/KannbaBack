export class UserByProyectResponseDTO {
    userProyectId: number;
    userId: number;
    userName: string;
    email: string;
    role: string;
  
    constructor(partial: Partial<UserByProyectResponseDTO>) {
      Object.assign(this, partial);
    }
  }
  