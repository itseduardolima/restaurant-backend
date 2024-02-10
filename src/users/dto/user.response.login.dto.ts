import { Expose } from "class-transformer"

export class UserResponseLoginDto {

    @Expose()
    user_id: string

    @Expose()
    user_name: string

    @Expose()
    user_email: string

    @Expose()
    user_phone: string

    @Expose()
    user_created_date: Date

    @Expose()
    user_update_date: Date

}