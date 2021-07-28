import { EntityRepository, Repository } from "typeorm";
import { History } from "../entities/History";

@EntityRepository(History)
export class HistoryRepository extends Repository<History> {
    
    async registerHistory(newValue: History) {
        return await this.save(newValue,{ transaction: false, reload: false });
    }

    async getHistory(user_num1: number) {
        const alias = "history"

        const qb = this.createQueryBuilder(alias) // find one 물어보기
            .where(`${alias}.user_num1 = :user_num1`)
            .setParameters({ 
                user_num1: user_num1
            })
        
        return await qb.getMany();
        // return await this.findOne(user_num);
    }

}