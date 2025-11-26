import { Controller, Get, Param, Post } from "@nestjs/common";
import { PetService } from "../services/pet.service";
import { UserId } from 'src/common/decorator/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('/pet')
@UseGuards(JwtAuthGuard)
export class PetController {
    constructor(
        private readonly petService: PetService
    ){}

    @Get('/state')
    async getPetState(@UserId() userId: number) {
        return this.petService.getState(userId);
    }

    @Post('/feed')
    async feedPet(@UserId() userId: number) {
        return this.petService.feedPet(userId);
    }
}