import { validate } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { History } from "../entities/History";
import { BadRequestError } from "../error";

@EntityRepository(History)
export class HistoryRepository extends Repository<History> {
    
    async registerHistory(newValue: History){

        return await this.save(newValue,{ transaction: false, reload: false });
    }

    async getHistory(user_num: number) {
        
        const qb = this.createQueryBuilder("history")// find one 물어보기
            .where("history.user_num = :user_num", { user_num: user_num })
        
        return await qb.getMany();
    }

}