package com.example.insightfood

import android.graphics.Paint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.CheckBox
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ListView
import android.widget.TextView
import com.squareup.picasso.Picasso
import java.lang.Exception

/**
 * Activité de détails pour afficher les informations détaillées d'une recette.
 */
class DetailsActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_details)

        // Récupération de la recette à partir de l'intent
        val recipe = intent.extras?.getParcelable<Recipe>("recipe") ?: Recipe.FAKE_RECIPE

        // Initialisation des vues
        val iv_details = findViewById<ImageView>(R.id.iv_details)
        val recette_name_resultat = findViewById<TextView>(R.id.recette_name_details)
        val tv_provenance2 = findViewById<TextView>(R.id.tv_provenance2)
        val tv_temps_preparation2 = findViewById<TextView>(R.id.tv_temps_preparation2)
        val tv_quantite2 = findViewById<TextView>(R.id.tv_quantite2)
        val vegetarienCheckBox = findViewById<CheckBox>(R.id.vegetarienCheckBox)
        val sansGlutenCheckBox = findViewById<CheckBox>(R.id.sansGlutenCheckBox)
        val veganCheckbox = findViewById<CheckBox>(R.id.veganCheckbox)
        val ingredientLL = findViewById<LinearLayout>(R.id.ingredientLL)
        val etapesLL = findViewById<ListView>(R.id.etapesLL)

        // Chargement de l'image de la recette
        Picasso.get().load(recipe.image).into(iv_details)

        // Affichage des informations de la recette
        recette_name_resultat.text = recipe.title
        tv_provenance2.text = try {
            recipe.cuisines[0]
        } catch (e: Exception) {
            resources.getString(R.string.noCuisine)
        }
        tv_temps_preparation2.text = "${recipe.readyInMinutes} ${resources.getString(R.string.min)}"
        tv_quantite2.text = "${recipe.servings} ${resources.getString(R.string.personne)}"

        // Vérification et affichage des régimes alimentaires de la recette
        val diets = recipe.diets
        val isVegetarian = diets.filter { it!!.lowercase().contains("vegetarian") }
        vegetarienCheckBox.isChecked = isVegetarian.isNotEmpty()
        val isGlutenFree = diets.filter { it!!.lowercase().contains("gluten") }
        sansGlutenCheckBox.isChecked = isGlutenFree.isNotEmpty()
        val isVegan = diets.filter { it!!.lowercase().contains("vegan") }
        veganCheckbox.isChecked = isVegan.isNotEmpty()

        // Affichage des ingrédients de la recette
        var compteur = 0
        val alreadyAdded = mutableListOf<String>()
        var horizontalLayout = LinearLayout(this)
        horizontalLayout.layoutDirection = View.LAYOUT_DIRECTION_LTR
        recipe.instructions?.steps?.forEach{
            it.ingredients.forEach {
                if (!alreadyAdded.contains(it.toString())) {
                    if (compteur == 2) {
                        horizontalLayout = LinearLayout(this)
                        horizontalLayout.layoutDirection = View.LAYOUT_DIRECTION_LTR
                        ingredientLL.addView(horizontalLayout)
                        compteur = 0
                    }
                    val textView = TextView(this)
                    textView.text = "• ${it}"
                    val params = LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.MATCH_PARENT
                    )
                    params.weight = 1.0f // Définit un poids égal pour chaque TextView
                    textView.layoutParams = params
                    horizontalLayout.addView(textView)
                    alreadyAdded.add(it.toString())
                    compteur++
                }
            }
        }

        // Affichage des étapes de la recette
        val steps = mutableListOf<String>()
        recipe.instructions?.steps?.forEach {
            if (it.step != null) steps.add("\n${resources.getString(R.string.etape)} : ${it.number}\n${it.step}")
        }
        val aa = ArrayAdapter<String>(this,android.R.layout.simple_list_item_1,steps)
        etapesLL.adapter = aa
    }
}