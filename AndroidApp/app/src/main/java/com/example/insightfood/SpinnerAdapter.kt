package com.example.insightfood

import android.R
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import android.content.Context
import android.graphics.Color
import androidx.core.content.ContextCompat

/**
 * Classe personnalisée ArrayAdapter pour afficher une liste déroulante (Spinner) avec un style personnalisé.
 * Cette classe étend ArrayAdapter<String> et surcharge les méthodes getView et getDropDownView pour personnaliser l'affichage des éléments de la liste.
 *
 * @property context Le contexte dans lequel l'adaptateur est utilisé.
 * @property resource L'identifiant de la ressource de la mise en page pour les éléments de la liste.
 * @property objects Les objets à représenter dans la liste déroulante.
 */
class CustomSpinnerAdapter(context: Context, resource: Int, objects: Array<String>) :
    ArrayAdapter<String>(context, resource, objects) {

    /**
     * Surcharge de la méthode getView pour personnaliser l'affichage de l'élément sélectionné dans le Spinner.
     * Cette méthode est appelée pour chaque élément de la liste lors du rendu de la liste.
     *
     * @param position La position de l'élément dans la liste.
     * @param convertView La vue recyclée à remplir.
     * @param parent Le parent auquel la vue sera éventuellement attachée.
     * @return La vue remplie pour l'élément de la liste.
     */
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = super.getView(position, convertView, parent) as TextView
        view.textSize = 16f
        view.setTextColor(Color.WHITE)
        return view
    }

    /**
     * Surcharge de la méthode getDropDownView pour personnaliser l'affichage des éléments dans la liste déroulante du Spinner.
     * Cette méthode est appelée pour chaque élément de la liste lors du rendu de la liste déroulante.
     *
     * @param position La position de l'élément dans la liste.
     * @param convertView La vue recyclée à remplir.
     * @param parent Le parent auquel la vue sera éventuellement attachée.
     * @return La vue remplie pour l'élément de la liste déroulante.
     */
    override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = super.getDropDownView(position, convertView, parent) as TextView
        view.setBackgroundColor(ContextCompat.getColor(context, R.color.black))
        view.setTextColor(context.resources.getColorStateList(R.color.white))
        view.gravity = Gravity.CENTER
        return view
    }
}