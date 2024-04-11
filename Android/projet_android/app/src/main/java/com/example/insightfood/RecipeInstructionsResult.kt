package com.example.insightfood

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import kotlinx.parcelize.RawValue
import kotlinx.serialization.Serializable

/**
 * Classe représentant le résultat des instructions d'une recette.
 * Cette classe est marquée comme Parcelable pour permettre son passage entre les activités via Intent.
 * Elle est également marquée comme Serializable pour permettre sa sérialisation/désérialisation.
 *
 * @property name Le nom des instructions.
 * @property steps La liste des étapes des instructions.
 */
@Serializable
@Parcelize
class RecipeInstructionsResult(
    val name : String?,
    val steps : MutableList<Step>
) : Parcelable{

    /**
     * Surcharge de la méthode toString pour afficher une représentation textuelle des instructions de la recette.
     *
     * @return Une chaîne de caractères représentant les instructions de la recette.
     */
    override fun toString(): String {
        return steps.toString()
    }
}