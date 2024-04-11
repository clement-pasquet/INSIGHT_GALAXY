package com.example.insightfood

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.squareup.picasso.Picasso

class RecipeRecyclerAdapater(private val list: MutableList<Recipe>) :
    RecyclerView.Adapter<RecipeRecyclerAdapater.RecipeViewHolder>() {

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

    override fun getItemCount(): Int {
        return list.size
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecipeViewHolder {
        val layout = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.recipe_item,parent,false)
        return RecipeViewHolder(layout)
    }

    override fun onBindViewHolder(holder: RecipeViewHolder, position: Int) {
        val recipe = list[position]
        Picasso.get().load(recipe.image).into(holder.iv_resultat)
        holder.recette_name_resultat.text = recipe.title
        holder.tv_temps_preparation.text = recipe.readyInMinutes.toString() + " min"
        holder.tv_quantite.text = recipe.servings.toString() + " personne(s)"
        holder.tv_provenance.text = try {recipe.cuisines[0].toString()} catch (e : Exception) {"No cuisine"}

        holder.view.setOnClickListener {
            val intent = Intent(holder.view.context,DetailsActivity::class.java).putExtra("recipe",recipe)
            holder.view.context.startActivity(intent)
        }
}
}