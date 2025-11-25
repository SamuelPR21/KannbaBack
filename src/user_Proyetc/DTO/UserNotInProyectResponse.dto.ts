export class UserNotInProyectResponseDTO {
  id: number;
  username: string;
  nameComlpete: string;

  constructor(user: any) {
    this.id = user.id;
    this.username = user.username;
    this.nameComlpete = user.nameComlpete;
  }
}
