package com.example.insightfood

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import kotlinx.serialization.Serializable

@Serializable
@Parcelize
class Step(
    val equipment : MutableList<Equipment?>,
    val ingredients : MutableList<Ingredient?>,
    val length : Length? = null,
    val number : Int? = null,
    val step : String? = null
) : Parcelable{

    override fun toString(): String {
        return "$step"
        //${equipment} ${ingredients} $length $ $number
    }
}
