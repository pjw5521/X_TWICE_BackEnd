import { EntityRepository, Repository } from "typeorm";
import { History } from "../entities/History";
import { HistoryInsertInput } from "../models/HistoryInput";
import { GetPagnation } from "../models/PageQuery";

@EntityRepository(History)
export class HistoryRepository extends Repository<History> {
    
    async registerHistory(newValue: HistoryInsertInput) {
        return await this.insert(newValue);
    }

    async getHistory(user_num: number, query: GetPagnation) {
        const alias = "history"

        const { first, last } = query;

        const qb = this.createQueryBuilder(alias) 
            .leftJoinAndSelect(`${alias}.user2`, "user2")
            .leftJoinAndSelect(`${alias}.user1`, "user1")
            .where(`${alias}.user_num1 = :user_num`)
            .orWhere(`${alias}.user_num2 = :user_num`)
            .setParameters({ 
                user_num: user_num
            })
            .skip(first)
            .take(last)
        
        return await qb.getManyAndCount();
        // return await this.findOne(user_num);

    }

    async getUser2(user_num1: number, token_id : string) {
        const alias = "history"

        const qb = this.createQueryBuilder("history")
            .leftJoinAndSelect("history.user2", "user2")
            .where(`history.user_num1 = :user_num1`)
            .andWhere(`token_id = :token_id`)
            .andWhere(`user2.user_num = history.user_num2`)
            .setParameters({ 
                user_num1: user_num1,
                token_id: token_id
            })

        return await qb.getManyAndCount();
        // return await this.findOne(user_num);
    }
}