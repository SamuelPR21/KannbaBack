import { TaskPersonal } from "../../Entities/task-personal.entity";
import { TaskPersonalResponseDto } from "../taskPersonal/task-personal-response.dto"    ;

export class TaskPersonalMapper {
  static toResponse(entity: TaskPersonal): TaskPersonalResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      userId: entity.user.id,
      stateId: entity.state.id,
    };
  }

  static toResponseList(entities: TaskPersonal[]): TaskPersonalResponseDto[] {
    return entities.map(e => this.toResponse(e));
  }
}
