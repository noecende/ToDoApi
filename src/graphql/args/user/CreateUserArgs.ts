import { ArgsType, Field } from "type-graphql";
import { Unique } from "../../../rules/Unique";
import { User } from "../../types/User";


@ArgsType()
export class CreateUserArgs implements Partial<User>{
    
    @Field()
    name: string

    @Field()
    lastname: string

    @Field()
    @Unique('user', 'email', {message: "El correo electrónico ya está en uso."})
    email: string

    @Field()
    password: string
} 