package com.example.insightfood

import kotlinx.serialization.Serializable

@Serializable
class RecipesList(
    val results : MutableList<Recipe>,
    val offset : Int,
    val number : Int,
    val totalResults : Int
) {

    override fun toString(): String {
        var recipes : MutableList<String> = mutableListOf()
        for (i in results) {
            recipes.add(i.toString())
        }

        return "$recipes, $offset, $number, $totalResults"
    }
}