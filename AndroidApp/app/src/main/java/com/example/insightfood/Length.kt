package com.example.insightfood

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import kotlinx.serialization.Serializable

@Serializable
@Parcelize
class Length(
    val number : Int? = null,
    val unit : String? = null
) : Parcelable{

    override fun toString(): String {
        return "$number $unit"
    }
}
