import { DeepPartial, EntityRepository, Repository } from "typeorm";
import { Picture } from "../entities/Picture";

@EntityRepository(Picture)
export class PictureRepository extends Repository<Picture> {
    
    async saveWithOptions(newValue: Picture){
        return await this.save(newValue,{ transaction: false, reload: false });
    }

    async registerSale(price: number, token_id: string){
        const picture: DeepPartial<Picture> = {
            token_id,
            picture_price: price,
            picture_state: "판매토큰"
        };

        /* picture.token_id = token_id
        picture.picture_price = price
        picture.picture_state = "판매토큰" // 영어로 바꿈 */

        return await this.save(picture, { transaction: false, reload: false })
    }

    async cancleSale(token_id: string){
        const picture = new Picture();

        picture.token_id = token_id
        picture.picture_price = 0
        picture.picture_state = "보유토큰"

        return await this.save(picture, { transaction: false, reload: false })
    }

    async getList(user_num: number, state: string) {
        
        const qb = this.createQueryBuilder("picture") 
            .where("picture.user_num = :user_num")
            .andWhere("picture.picture_state = :state")
            .setParameters({
                user_num,
                state
            }) // 여기서 picture. 없어도 되는지 

        return await qb.getMany();
    }

    // 사진 검색하기 (사진 이름이랑 제목만 ?  )
    async search(keyword: string) {
        const alias = "picture"
        
        const qb = this.createQueryBuilder(alias)
            .select([`${alias}.picture_url`, `${alias}.picture_title`])
            .where(`${alias}.picture_title LIKE :keyword`)
            .orWhere(`${alias}.picture_info LIKE :keyword`)
            .orWhere(`${alias}.picture_category LIKE :keyword`)
            .setParameters({
                keyword: `%${keyword}%`
            })

        return await qb.getMany();
    }



}