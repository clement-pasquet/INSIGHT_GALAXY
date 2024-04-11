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

    fun getInstructions() {
        val result = client.getRequestResult("$id/analyzedInstructions","")
        val jsonArray = Json.parseToJsonElement(result).jsonArray
        val objectJson = jsonArray[0]
        Log.d("debugRomain result",objectJson.toString())
//        result.drop(1)
//        result.dropLast(1)
        this.instructions =  Json.decodeFromJsonElement(objectJson)
    }

    companion object {
        val FAKE_RECIPE = Recipe(
            mutableListOf(),
            mutableListOf(),
        )
    }
}