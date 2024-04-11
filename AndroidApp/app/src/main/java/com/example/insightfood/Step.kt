package com.example.insightfood

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import kotlinx.serialization.Serializable

/**
 * Classe représentant une étape d'une recette.
 * Cette classe est marquée comme Parcelable pour permettre son passage entre les activités via Intent.
 * Elle est également marquée comme Serializable pour permettre sa sérialisation/désérialisation.
 *
 * @property equipment La liste des équipements nécessaires pour cette étape.
 * @property ingredients La liste des ingrédients nécessaires pour cette étape.
 * @property length La durée de cette étape, si applicable.
 * @property number Le numéro de cette étape dans la séquence d'étapes.
 * @property step La description de cette étape.
 */
@Serializable
@Parcelize
class Step(
    val equipment : MutableList<Equipment?>,
    val ingredients : MutableList<Ingredient?>,
    val length : Length? = null,
    val number : Int? = null,
    val step : String? = null
) : Parcelable{

    /**
     * Surcharge de la méthode toString pour afficher une représentation textuelle de l'étape.
     *
     * @return Une chaîne de caractères représentant l'étape.
     */
    override fun toString(): String {
        return "$step"
    }
}