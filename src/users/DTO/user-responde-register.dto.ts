import {PetResponseDTO} from "../../pet/DTO/petResponse.dto"

export class UserRespondeRegisterDTO {
    id: number;
    username: string;
    nameComlpete: string;
    email: string;
    pet: PetResponseDTO;
}