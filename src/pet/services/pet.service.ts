import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Pet } from "../entities/pet.entity";
import { PetFeed } from "../entities/pet-feed.entity";
import { User } from "src/users/users.entity";
import { TaskHistoryService } from "src/task_history/task-history.service";


@Injectable()
export class PetService {
    constructor(
        @InjectRepository(Pet)
        private readonly petRepo: Repository<Pet>,
        @InjectRepository(PetFeed)
        private readonly petFeedRepo: Repository<PetFeed>,
        private readonly taskHistoryService: TaskHistoryService,
    ){}

    private getDayRange(){
        const start = new Date();
        start.setHours(0,0,0,0);
        const end = new Date();
        end.setHours(23,59,59,999);
        return {start, end};
    }

    async save(pet: Pet) {
        return this.petRepo.save(pet);
    }
    
    async getPetByUserId(userId: number)  {

        const pet = await this.petRepo.findOne({where: {user: {id: userId}}});
        if (!pet) throw new NotFoundException('Pet not found for this user');

        return pet;
    }

    async getState(userId: number) {
        const {start, end} = this.getDayRange();

        const doneCount = await this.taskHistoryService.countDoneTodayByUser(userId)
        const fedCount = await this.petFeedRepo.count({
            where: {
                user: {id: userId},
                fedAt: Between(start, end)
            }as any
        })

        const consumed  = fedCount

        const computedState = consumed === 0 ? 'MUERTO' : consumed >5 ? 'FELIZ' : 'HAMBRIENTO';
        
        return {
            state: computedState,
            doneCount,
            fedCount:consumed
        }
    }


    async feedPet(userId: number) {
        const pet = await this.getPetByUserId(userId);

        const {start, end} = this.getDayRange();
        const doneCount = await this.taskHistoryService.countDoneTodayByUser(userId)

        const fedCount = await this.petFeedRepo.count({
            where: {
                user: {id: userId},
                fedAt: Between(start, end)
            }as any
        })

        if (doneCount <= fedCount) {
            throw new BadRequestException('No tienes mas tareass hechas hoy para alimentar a tu mascota');
        }

        const feed = this.petFeedRepo.create({
            pet,
            user: {id: userId} as User,
        })
        await this.petFeedRepo.save(feed);


        const newFed = fedCount + 1;
        pet.state = newFed === 0 ? 'MUERTO' : newFed >5 ? 'FELIZ' : 'HAMBRIENTO';

        await this.petRepo.save(pet);

        return{
            message: 'Mascota alimentada correctamente',
            petState: pet.state,
            fedCount: newFed,
            doneCount
        }
    }

    async createPetForUser(user: User) {
        const pet = this.petRepo.create({
            type: 'GATO',
            state: 'HAMBRIENTO',
            date_creation: new Date(),
            user: user, 
        });
    
        return await this.petRepo.save(pet);
    }
    
      
}