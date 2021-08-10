import { validate } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { User } from "../entities/User";
import { BadRequestError } from "../error";
import { GetPagnation } from "../models/PageQuery";
import { UserInsertInput, UserUpdateInput } from "../models/UserInput";
import { GetMyListQuery } from "../models/UserQuery";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async insertWithOptions(newValue: UserInsertInput) {
        const { user_id } = newValue;
        // return await this.save(newValue, { transaction: false, reload: false });
        const user = await this.findOne({ user_id })

        if (user) {
            throw new BadRequestError('이미 등록된 사용자입니다')
        }

        return await this.insert(newValue);
    }

    async updateWithOptions(updateValue: UserUpdateInput) {
    
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
        
        const user = 'user';

        const params: QueryDeepPartialEntity<User> = {};
        params.user_id = user_id;
        
        const qb = this.createQueryBuilder(user)
            .where(`${user}.user_id = :user_id`)
            .setParameters(params);

        return await qb.getOne();
    }

    async getUserListByName(user_id: string) {
        const userAlias = 'user';

        const qb = this.createQueryBuilder(userAlias)
            .where(`${userAlias}.user_id like :user_id`)
            .setParameters({
                user_id: `%${user_id}%`
            })
            .orderBy(`${userAlias}.user_id`, 'DESC')
            .limit(5);
        
        return await qb.getMany();
    }

    async getMyList(user_id: string, query: GetMyListQuery){   

        const { state, first, last } = query;

        const qb = this.createQueryBuilder("user")
            .leftJoinAndSelect("user.pictures", "picture")
            .where(`user.user_id = :user_id`)
            .andWhere(`picture.picture_state = :state`)
            .setParameters({
                user_id,
                state
            }) 
            .skip(first)
            .take(last)

        return await qb.getManyAndCount();
    }

    async getHistory(user_num1: number, query: GetPagnation) {
        const { first, last } = query;

        const qb = this.createQueryBuilder("user") 
            .leftJoinAndSelect("user.histories1", "history")
            .where("user.user_num = :user_num1")
            .setParameters({ 
                user_num1: user_num1
            })
            .skip(first)
            .take(last)
        
        return await qb.getMany();
        // return await this.findOne(user_num);

    }

}