import { EntityRepository, Repository } from "typeorm";
import { History } from "../entities/History";

@EntityRepository(History)
export class HistoryRepository extends Repository<History> {
    
    async registerHistory(newValue: History) {
        return await this.save(newValue,{ transaction: false, reload: false });
    }


}