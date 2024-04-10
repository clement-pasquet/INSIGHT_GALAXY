package com.example.insightfood

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import kotlinx.parcelize.RawValue
import kotlinx.serialization.Serializable

@Serializable
@Parcelize
class RecipeInstructionsResult(
    val name : String?,
    val steps : MutableList<Step>
) : Parcelable{

    override fun toString(): String {
        return steps.toString()
    }
}