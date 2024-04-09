package com.example.insightfood
import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Recipe(
    val title : String,
    val image : String?
) : Parcelable {
}