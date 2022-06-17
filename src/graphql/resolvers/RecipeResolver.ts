import { Arg, Query, Resolver } from "type-graphql";
import { Recipe } from "../types/Recipe";

@Resolver(Recipe)
export class RecipeResolver {

    @Query(returns => Recipe)
    async recipe(@Arg("id") id: number) {

        return {
            id: 1,
            title: "Receta de prueba",
            description: "Una receta de prueba",
            creationDate: Date.now(),
            ingredients: ['canela', 'chocolate']
        }
    }

}