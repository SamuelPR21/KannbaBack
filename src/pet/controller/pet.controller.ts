import { Controller, Get, Param, Post } from "@nestjs/common";
import { PetService } from "../services/pet.service";

@Controller('/pet')
export class PetController {
    constructor(
        private readonly petService: PetService
    ){}

    @Get('/state/:userId')
    async getPetState(@Param('userId') userId: number) {
        return this.petService.getState(userId);
    }

    @Post('/:userId/feed')
    async feedPet(@Param('userId') userId: number) {
        return this.petService.feedPet(userId);
    }
}