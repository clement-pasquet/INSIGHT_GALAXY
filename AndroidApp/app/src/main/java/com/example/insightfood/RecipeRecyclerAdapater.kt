package com.example.insightfood

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.squareup.picasso.Picasso

/**
 * Classe personnalisée RecyclerView.Adapter pour afficher une liste de recettes.
 * Cette classe étend RecyclerView.Adapter<RecipeRecyclerAdapater.RecipeViewHolder> et surcharge les méthodes nécessaires pour personnaliser l'affichage des éléments de la liste.
 *
 * @property list La liste des recettes à afficher.
 */
class RecipeRecyclerAdapater(private val list: MutableList<Recipe>) :
    RecyclerView.Adapter<RecipeRecyclerAdapater.RecipeViewHolder>() {

    /**
     * Classe interne ViewHolder pour optimiser le rendu des éléments de la liste.
     * Cette classe contient des références aux vues qui doivent être remplies pour chaque élément de la liste.
     */
    class RecipeViewHolder(val view : View) : RecyclerView.ViewHolder(view) {
        val iv_resultat = view.findViewById<ImageView>(R.id.iv_resultat)
        val recette_name_resultat = view.findViewById<TextView>(R.id.recette_name_resultat)
        val tv_resultat_no_result = view.findViewById<TextView>(R.id.tv_resultat_no_result)
        val iv_quantite = view.findViewById<ImageView>(R.id.iv_quantite)
        val iv_temps_preparation = view.findViewById<ImageView>(R.id.iv_temps_preparation)
        val iv_provenance = view.findViewById<ImageView>(R.id.iv_provenance)
        val tv_provenance = view.findViewById<TextView>(R.id.tv_provenance2)
        val tv_temps_preparation = view.findViewById<TextView>(R.id.tv_temps_preparation)
        val tv_quantite = view.findViewById<TextView>(R.id.tv_quantite)
    }

    /**
     * Surcharge de la méthode getItemCount pour retourner le nombre d'éléments dans la liste.
     *
     * @return Le nombre d'éléments dans la liste.
     */
    override fun getItemCount(): Int {
        return list.size
    }

    /**
     * Surcharge de la méthode onCreateViewHolder pour créer un nouveau ViewHolder.
     * Cette méthode est appelée lorsque le RecyclerView a besoin d'un nouveau ViewHolder pour représenter un élément.
     *
     * @param parent Le ViewGroup dans lequel le nouveau View sera ajouté après qu'il est lié à une position d'adaptateur.
     * @param viewType Le type de vue de la nouvelle vue.
     * @return Un nouveau ViewHolder qui contient une vue pour l'élément.
     */
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecipeViewHolder {
        val layout = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.recipe_item,parent,false)
        return RecipeViewHolder(layout)
    }

    /**
     * Surcharge de la méthode onBindViewHolder pour lier les données à un ViewHolder.
     * Cette méthode est appelée par RecyclerView pour afficher les données à la position spécifiée.
     *
     * @param holder Le ViewHolder à mettre à jour pour représenter le contenu de l'élément à la position donnée dans l'ensemble de données.
     * @param position La position de l'élément dans l'ensemble de données de l'adaptateur.
     */
    override fun onBindViewHolder(holder: RecipeViewHolder, position: Int) {
        val recipe = list[position]
        val ressources = holder.view.context.resources
        Picasso.get().load(recipe.image).into(holder.iv_resultat)
        holder.recette_name_resultat.text = recipe.title
        holder.tv_temps_preparation.text = "${recipe.readyInMinutes} ${ressources.getString(R.string.min)}"
        holder.tv_quantite.text = "${recipe.servings} ${ressources.getString(R.string.personne)}"
        holder.tv_provenance.text = try {recipe.cuisines[0].toString()} catch (e : Exception) { ressources.getString(R.string.noCuisine) }

        // Lorsque l'utilisateur clique sur un élément de la liste, une nouvelle activité est lancée pour afficher les détails de la recette.
        holder.view.setOnClickListener {
            val intent = Intent(holder.view.context,DetailsActivity::class.java).putExtra("recipe",recipe)
            holder.view.context.startActivity(intent)
        }
    }
}