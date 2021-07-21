import { validate } from "class-validator";
import { DeepPartial, EntityRepository, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { User } from "../entities/User";
import { UserInsertInput, UserUpdateInput } from "../models/UserInput";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async insertWithOptions(newValue: UserInsertInput) {
        const errors = await validate(newValue);

        if (errors.length > 0) {
            // console.log("errors")
            throw new Error('')
        }

        return await this.save(newValue, { transaction: false, reload: false });
    }

    async updateWithOptions(updateValue: UserUpdateInput) {
        const errors = await validate(updateValue);

        // console.log(errors.toString());

        if (errors.length > 0) {
            throw new Error('')
        }

        return await this.save(updateValue, { transaction: false, reload: false })
    }

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