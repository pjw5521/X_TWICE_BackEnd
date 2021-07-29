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

        const { user_id } = newValue;
        // return await this.save(newValue, { transaction: false, reload: false });
        const user = this.findOne({ user_id })

        if (!user) {
            return await this.insert(newValue);
        }

        throw new BadRequestError('이미 등록된 사용자입니다')
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
        params.user_id = id;
        
        const qb = this.createQueryBuilder(user)
            .where(`${user}.user_id = :user_id`)
            .setParameters(params);

        return await qb.getOne();
    }

    async getOneById(user_id: string) {
        const errors = await validate(user_id);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }
        
        const user = 'user';

        const params: QueryDeepPartialEntity<User> = {};
        params.user_id = user_id;
        
        const qb = this.createQueryBuilder(user)
            .where(`${user}.user_id = :user_id`)
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