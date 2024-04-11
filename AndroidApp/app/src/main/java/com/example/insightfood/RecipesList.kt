package com.example.insightfood

import kotlinx.serialization.Serializable

/**
 * Classe représentant une liste de recettes.
 * Cette classe est marquée comme Serializable pour permettre sa sérialisation/désérialisation.
 *
 * @property results La liste des recettes.
 * @property offset L'offset utilisé pour la pagination des résultats.
 * @property number Le nombre de résultats retournés.
 * @property totalResults Le nombre total de résultats disponibles.
 */
@Serializable
class RecipesList(
    val results : MutableList<Recipe>,
    val offset : Int,
    val number : Int,
    val totalResults : Int
) {

    /**
     * Surcharge de la méthode toString pour afficher une représentation textuelle de la liste de recettes.
     * Cette méthode crée une liste de chaînes de caractères à partir des recettes et l'ajoute à la représentation textuelle.
     *
     * @return Une chaîne de caractères représentant la liste de recettes.
     */
    override fun toString(): String {
        var recipes : MutableList<String> = mutableListOf()
        for (i in results) {
            recipes.add(i.toString())
        }

        return "$recipes, $offset, $number, $totalResults"
    }
}