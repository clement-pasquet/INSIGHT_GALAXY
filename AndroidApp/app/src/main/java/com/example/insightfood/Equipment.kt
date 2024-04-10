package com.example.insightfood

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import kotlinx.serialization.Serializable

@Serializable
@Parcelize
class Equipment(
    val id : Int? = null,
    val image : String? = null,
    val localizedName : String? = null,
    val name : String? = null,
    val temperature : Temperature? = null
) : Parcelable{

    override fun toString(): String {
        return "$name ${temperature ?: ""}"
    }
}
