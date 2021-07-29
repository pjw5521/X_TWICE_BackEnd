import { validate } from "class-validator";
import { DeepPartial, EntityRepository, Repository } from "typeorm";
import { Picture } from "../entities/Picture";
import { BadRequestError } from "../error";
import { PictureSaleInput } from "../models/PictureInput";
import { GetMyListQuery, GetPagnation } from "../models/UserQuery";

@EntityRepository(Picture)
export class PictureRepository extends Repository<Picture> {
    
    async saveWithOptions(newValue: Picture){
        return await this.save(newValue,{ transaction: false, reload: false });
    }

    async registerSale( newValue: PictureSaleInput){
        const errors = await validate(newValue);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        const { token_id, picture_price } = newValue;

        const picture: DeepPartial<Picture> = {
            token_id,
            picture_price,
            picture_state: "N"
        };

        return await this.save(picture, { transaction: false, reload: false })
    }

    async cancleSale(token_id: string){
        const picture: DeepPartial<Picture> = {
            token_id,
            picture_state: "Y"
        };

        return await this.save(picture, { transaction: false, reload: false })
    }

    async getMyList(user_num: number, query: GetMyListQuery){
        const errors = await validate(query);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        const alias = "picture" 

        const { state, first, last } = query;

        const qb = this.createQueryBuilder(alias) 
            .where(`${alias}.user_num = :user_num`)
            .andWhere(`${alias}.picture_state = :state`)
            .setParameters({
                user_num,
                state
            }) 
            .skip(first)
            .take(last)

        return await qb.getMany();
    }

    // 키워드로 사진 검색하기
    async getListByKeywords(keyword: string, query: GetPagnation) {
        const errors = await validate(query);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        const alias = "picture"
        
        const { first, last } = query;
        
        const qb = this.createQueryBuilder(alias)
            .select([`${alias}.picture_url`, `${alias}.picture_title`])
            .where(`${alias}.picture_title LIKE :keyword`)
            .orWhere(`${alias}.picture_info LIKE :keyword`)
            .orWhere(`${alias}.picture_category LIKE :keyword`)
            .setParameters({
                keyword: `%${keyword}%`
            })
            .skip(first)
            .take(last)

        return await qb.getMany();
    }

    // 가격순으로 사진 보기
    async viewByPrice(query: GetPagnation) {
        const errors = await validate(query);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        const alias = "picture"
        
        const { first, last } = query;
        
        const qb = this.createQueryBuilder(alias)
            .select([`${alias}.picture_url`, `${alias}.picture_title`])
            .orderBy(`${alias}.price`, "ASC")
            .skip(first)
            .take(last)

        return await qb.getMany();
    }

    // 카테고리 별로 사진 보기
    async viewByCategory() {
        const alias = "picture"
        
        const qb = this.createQueryBuilder(alias)
            .select([`${alias}.picture_url`, `${alias}.picture_title`])
            .groupBy(`${alias}.picture_category`)
            
        return await qb.getMany();
    }

}