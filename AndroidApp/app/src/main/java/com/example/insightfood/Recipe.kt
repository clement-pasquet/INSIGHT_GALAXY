package com.example.insightfood

import android.os.Parcelable
import android.util.Log
import kotlinx.parcelize.Parcelize
import kotlinx.parcelize.RawValue
import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.decodeFromJsonElement

/**
 * Classe représentant une recette.
 * Cette classe est marquée comme Parcelable pour permettre son passage entre les activités via Intent.
 * Elle est également marquée comme Serializable pour permettre sa sérialisation/désérialisation.
 *
 * @property cuisines La liste des cuisines associées à la recette.
 * @property diets La liste des régimes alimentaires associés à la recette.
 * @property id L'identifiant unique de la recette.
 * @property image L'URL de l'image de la recette.
 * @property readyInMinutes Le temps de préparation de la recette en minutes.
 * @property servings Le nombre de portions de la recette.
 * @property title Le titre de la recette.
 * @property instructions Les instructions de la recette.
 */
@Serializable
@Parcelize
data class Recipe(
    val cuisines : MutableList<String?>,
    val diets : MutableList<String?>,
    val id : Int? = null,
    val image : String? = null,
    val readyInMinutes : Int? = null,
    val servings : Int? = null,
    val title : String? = null,
    var instructions : RecipeInstructionsResult? = null
) : Parcelable {

    @Transient
    val client = KtorClient().getClient()

    /**
     * Méthode pour obtenir les instructions de la recette.
     * Cette méthode effectue une requête HTTP pour obtenir les instructions et les stocke dans la propriété instructions.
     */
    fun getInstructions() {
        val result = client.getRequestResult("$id/analyzedInstructions","")
        val jsonArray = Json.parseToJsonElement(result).jsonArray
        val objectJson = jsonArray[0]
        Log.d("debugRomain result",objectJson.toString())
        this.instructions =  Json.decodeFromJsonElement(objectJson)
    }

    /**
     * Objet compagnon pour la classe Recipe.
     * Cet objet contient une recette factice qui peut être utilisée lorsque aucune recette n'est disponible.
     */
    companion object {
        val FAKE_RECIPE = Recipe(
            mutableListOf(),
            mutableListOf(),
        )
    }
}