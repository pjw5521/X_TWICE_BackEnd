import { EntityRepository, Repository } from "typeorm";
import { History } from "../entities/History";
import { HistoryInsertInput } from "../models/HistoryInput";

@EntityRepository(History)
export class HistoryRepository extends Repository<History> {
    
    async registerHistory(newValue: HistoryInsertInput) {
        return await this.insert(newValue);
    }

}