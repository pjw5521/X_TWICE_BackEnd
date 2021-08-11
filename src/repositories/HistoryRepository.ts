import { EntityRepository, Repository } from "typeorm";
import { History } from "../entities/History";
import { HistoryInsertInput } from "../models/HistoryInput";
import { GetPagnation } from "../models/PageQuery";

@EntityRepository(History)
export class HistoryRepository extends Repository<History> {
    
    async registerHistory(newValue: HistoryInsertInput) {
        return await this.insert(newValue);
    }

    async getHistory(user_num1: number, query: GetPagnation) {
        const alias = "history"

        const { first, last } = query;

        const qb = this.createQueryBuilder(alias) 
            .where(`${alias}.user_num1 = :user_num1`)
            .setParameters({ 
                user_num1: user_num1
            })
            .skip(first)
            .take(last)
        
        return await qb.getManyAndCount();
        // return await this.findOne(user_num);

    }
}