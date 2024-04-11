package com.example.insightfood

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import kotlinx.serialization.Serializable

/**
 * Classe représentant une température.
 * Cette classe est marquée comme Parcelable pour permettre son passage entre les activités via Intent.
 * Elle est également marquée comme Serializable pour permettre sa sérialisation/désérialisation.
 *
 * @property number Le nombre représentant la température.
 * @property unit L'unité de mesure de la température.
 */
@Serializable
@Parcelize
class Temperature(
    val number : Float? = null,
    val unit : String? = null
) : Parcelable{

    /**
     * Surcharge de la méthode toString pour afficher une représentation textuelle de la température.
     *
     * @return Une chaîne de caractères représentant la température.
     */
    override fun toString(): String {
        return "$number $unit"
    }
}