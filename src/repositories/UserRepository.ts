import { validate } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { User } from "../entities/User";
import { BadRequestError } from "../error";
import { UserInsertInput, UserUpdateInput } from "../models/UserInput";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async insertWithOptions(newValue: UserInsertInput) {
        const errors = await validate(newValue);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        return await this.save(newValue, { transaction: false, reload: false });
    }

    async updateWithOptions(updateValue: UserUpdateInput) {
        const errors = await validate(updateValue);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
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

    async getUserListByName(user_account: string) {
        const userAlias = 'user';

        const qb = this.createQueryBuilder(userAlias)
            .where(`${userAlias}.user_account like :user_account`)
            .setParameters({
                user_account: `%${user_account}%`
            })
            .orderBy(`${userAlias}.user_account`, 'DESC')
            .limit(5);
        
        return await qb.getMany();
    }

}