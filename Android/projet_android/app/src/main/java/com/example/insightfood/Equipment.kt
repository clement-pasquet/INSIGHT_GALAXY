package com.example.insightfood

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import kotlinx.serialization.Serializable

/**
 * Classe représentant un équipement utilisé dans une recette.
 * Cette classe est marquée comme Parcelable pour permettre son passage entre les activités via Intent.
 * Elle est également marquée comme Serializable pour permettre sa sérialisation/désérialisation.
 *
 * @property id L'identifiant unique de l'équipement.
 * @property image L'URL de l'image de l'équipement.
 * @property localizedName Le nom localisé de l'équipement.
 * @property name Le nom de l'équipement.
 * @property temperature La température à laquelle l'équipement doit être utilisé, si applicable.
 */
@Serializable
@Parcelize
class Equipment(
    val id : Int? = null,
    val image : String? = null,
    val localizedName : String? = null,
    val name : String? = null,
    val temperature : Temperature? = null
) : Parcelable{

    /**
     * Surcharge de la méthode toString pour afficher une représentation textuelle de l'équipement.
     * Si une température est définie pour l'équipement, elle est incluse dans la représentation textuelle.
     *
     * @return Une chaîne de caractères représentant l'équipement.
     */
    override fun toString(): String {
        return "$name ${temperature ?: ""}"
    }
}