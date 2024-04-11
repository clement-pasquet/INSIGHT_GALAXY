package com.example.insightfood

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import kotlinx.serialization.Serializable

/**
 * Classe représentant un ingrédient utilisé dans une recette.
 * Cette classe est marquée comme Parcelable pour permettre son passage entre les activités via Intent.
 * Elle est également marquée comme Serializable pour permettre sa sérialisation/désérialisation.
 *
 * @property id L'identifiant unique de l'ingrédient.
 * @property image L'URL de l'image de l'ingrédient.
 * @property localizedName Le nom localisé de l'ingrédient.
 * @property name Le nom de l'ingrédient.
 */
@Serializable
@Parcelize
class Ingredient(
    val id : Int? = null,
    val image : String? = null,
    val localizedName : String? = null,
    val name : String? = null
) : Parcelable{

    /**
     * Surcharge de la méthode toString pour afficher une représentation textuelle de l'ingrédient.
     *
     * @return Une chaîne de caractères représentant l'ingrédient.
     */
    override fun toString(): String {
        return "$name"
    }
}