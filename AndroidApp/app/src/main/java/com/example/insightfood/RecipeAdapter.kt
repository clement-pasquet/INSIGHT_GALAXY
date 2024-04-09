package com.example.insightfood

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.TextView
import com.squareup.picasso.Picasso

class RecipeAdapter(context: Context, items: List<Recipe>): ArrayAdapter<Recipe>( context, 0, items) {

    class ViewHolder {
        lateinit var image: ImageView
        lateinit var title: TextView
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {

        var row = convertView
        val vh: ViewHolder

        if (row == null) {
            row = LayoutInflater.from(parent.context).inflate(R.layout.recipe_item, parent, false)
            vh = ViewHolder()
            vh.image = row.findViewById(R.id.image_recipe)
            vh.title = row.findViewById(R.id.title_recipe)
            row.tag = vh
        }  else {
            vh = row.tag as ViewHolder
        }

        val t = getItem(position)
        if (t!= null) {
            val recetteTitre = vh.title
            val recetteImage = vh.image

            recetteTitre.text = t.title
            Picasso.get().load(t.image).into(recetteImage)


        }
        return row as View
    }

}
