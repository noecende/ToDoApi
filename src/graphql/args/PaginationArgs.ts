import { Min } from "class-validator"
import { ArgsType, Field, Int } from "type-graphql"

@ArgsType()
export class PaginationArgs {

    @Field(type => Int, { nullable:true})
    @Min(0)
    offset?: number

    @Field(type => Int)
    @Min(1)
    limit: number
}