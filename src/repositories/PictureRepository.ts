import { validate } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { Picture } from "../entities/Picture";
import { BadRequestError } from "../error";

@EntityRepository(Picture)
export class PictureRepository extends Repository<Picture> {
    
    async registerPicture(newValue: Picture){

        return await this.save(newValue,{ transaction: false, reload: false });
    }

    async registerSale(price: number, token_id: string){
        const picture = new Picture();

        picture.token_id = token_id
        picture.picture_price = price
        picture.picture_state = "판매토큰"

        return await this.save(picture, { transaction: false, reload: false })
    }

    async updateState(token_id: string){
        const picture = new Picture();

        picture.token_id = token_id
        picture.picture_price = 0
        picture.picture_state = "보유토큰"

        return await this.save(picture, { transaction: false, reload: false })
    }

    async getTokeninfo(user_num: number, state: string) {
        
        const qb = this.createQueryBuilder("picture") 
            .where("picture.user_num = :user_num AND ", { user_num: user_num })
            .andWhere("picture.picture_state = :state", { state: state }) // 여기서 picture. 없어도 되는지 

        return await qb.getMany();
    }

    // 사진 검색하기 (사진 이름이랑 제목만 ?  )
    async Search(keyword: string) {
        
        const qb = this.createQueryBuilder("picture")
            .select(['picture_url', 'picture_title'])
            .where("picture.picture_title ILIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("picture.picture_info ILIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("picture.picture_category ILIKE :keyword", { keyword: `%${keyword}%` })

        return await qb.getMany();

    }



}