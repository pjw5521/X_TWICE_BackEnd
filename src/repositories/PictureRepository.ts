import { validate } from "class-validator";
import { DeepPartial, EntityRepository, Repository } from "typeorm";
import { Picture } from "../entities/Picture";
import { BadRequestError } from "../error";
import { GetPagnation } from "../models/PageQuery";
import { PictureSaleInput, ViewBycategoryQuery } from "../models/PictureInput";
import { GetMyListQuery } from "../models/UserQuery";

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

    //사진 상세 정보 보기 
    async viewPicture(picture_num: number){

        const alias = "picture" 

        const qb1 = this.createQueryBuilder(alias) 
            .where(`${alias}.picture_num = :picture_num`)
            .setParameters({
                picture_num
            }) 

        return await qb1.getMany();
    }

    // 조회수 증가 
    async updateCount(picture_num: number){
        const qb = this.createQueryBuilder()
            .update(Picture)
            .set({
                picture_count: () => "`picture_count` + 1"
            })
            .where("picture_num = :picture_num")
            .setParameters({
                picture_num
            })

        return await qb.execute();
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
            .orderBy(`${alias}.picture_price`, "ASC") // 높은 가격 순, 낮은 가격 순 나누기 
            .skip(first)
            .take(last)

        return await qb.getMany();
    }

    // 카테고리 별로 사진 보기
    async viewByCategory(query: ViewBycategoryQuery) {
        const alias = "picture"
        
        const errors = await validate(query);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        const { category, first, last } = query;

        const qb = this.createQueryBuilder(alias)
            .select([`${alias}.picture_url`, `${alias}.picture_title`])
            .where(`${alias}.picture_category = :category`)
            .setParameters( { category } )
            .skip(first)
            .take(last)
            
        return await qb.getMany();
    }

    // 인기순으로 사진보기
    async viewByPopularity(query: GetPagnation) {
        const alias = "picture"
        
        const errors = await validate(query);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        const { first, last } = query;

        const qb = this.createQueryBuilder(alias)
            .select([`${alias}.picture_url`, `${alias}.picture_title`])
            .orderBy(`${alias}.picture_count`, "ASC")
            .skip(first)
            .take(last)
            
        return await qb.getMany();
    }

}