import { EntityRepository, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { User } from "../entities/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async getOne(id: string) {
        const user = 'user';

        const params: QueryDeepPartialEntity<User> = {};
        params.user_account = id;
        
        const qb = this.createQueryBuilder(user)
            .where(`${user}.user_account = :user_account`)
            .setParameters(params);

        return await qb.getOne();
    }

    async getUserListByName(name: string) {
        const userAlias = 'user';

        const qb = this.createQueryBuilder(userAlias)
            .where(`${userAlias}.name like :name`)
            .setParameters({
                name: `%${name}%`
            })
            .orderBy(`${userAlias}.num`, 'DESC')
            .limit(5);
        
        return await qb.getMany();
    }

}