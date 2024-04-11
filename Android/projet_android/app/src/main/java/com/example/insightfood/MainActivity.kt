package com.example.insightfood

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.SeekBar
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import com.squareup.picasso.Picasso

/**
 * Activité principale de l'application.
 * Cette activité permet à l'utilisateur de rechercher des recettes en fonction de différents critères.
 */
class MainActivity : AppCompatActivity() {

    // Client Ktor pour les requêtes HTTP
    private var companion = KtorClient().getClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialisation des vues
        val et_search = findViewById<EditText>(R.id.et_search)
        val bt_search = findViewById<Button>(R.id.bt_search)
        val iv_recette = findViewById<ImageView>(R.id.iv_recette)
        val sk_nombre_recette = findViewById<SeekBar>(R.id.sk_nombre_recette)
        val tv_nombre_recette = findViewById<TextView>(R.id.tv_nombre_recette)
        val sp_cuisine = findViewById<Spinner>(R.id.sp_cuisine)

        // Options pour le spinner de cuisine
        val optionsArray :Array<String> = resources.getStringArray(R.array.optionsCuisine)

        // Adapter pour le spinner de cuisine
        val spinnerAdapter = CustomSpinnerAdapter(this, R.layout.style_spinner,optionsArray)
        sp_cuisine.adapter = spinnerAdapter
        var sp_cuisine_value = "African"

        // Chargement de l'image par défaut
        Picasso.get().load("https://cache.cosmopolitan.fr/data/photo/w1200_h630_c17/6f/plat-meconnu-meilleur-plat-au-monde.jpg").into(iv_recette)

        // Valeur par défaut du TextView au lancement
        tv_nombre_recette.text = "1"

        // Valeur par défaut de la SeekBar au lancement
        sk_nombre_recette.max = 10
        sk_nombre_recette.min = 1
        sk_nombre_recette.progress = 1

        // Mise à jour du TextView lorsque la valeur de la SeekBar change
        sk_nombre_recette.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener{
            override fun onProgressChanged(p0: SeekBar?, p1: Int, p2: Boolean) {
                tv_nombre_recette.text = p1.toString()
            }

            override fun onStartTrackingTouch(p0: SeekBar?) {
                return
            }

            override fun onStopTrackingTouch(p0: SeekBar?) {
                return
            }

        })

        // Mise à jour de la valeur de la cuisine lorsque l'élément sélectionné dans le spinner change
        sp_cuisine.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(p0: AdapterView<*>?, p1: View?, p2: Int, p3: Long) {
                sp_cuisine_value = p0?.getItemAtPosition(p2).toString()
            }

            override fun onNothingSelected(p0: AdapterView<*>?) {
                return
            }

        }

        // Lancement de la recherche lorsque le bouton de recherche est cliqué
        bt_search.setOnClickListener {
            val nom_recette = et_search.text.toString()
            val nombre_recette = sk_nombre_recette.progress
            val cuisine_recette = if (sp_cuisine_value == "None") "" else sp_cuisine_value.lowercase()

            val response = companion.getRequestResult("complexSearch","&titleMatch=$nom_recette&cuisine=$cuisine_recette&number=$nombre_recette&addRecipeInformation=true")
            val intent = Intent(this,ResultatActivity::class.java).putExtra("result",response)
            startActivity(intent)
        }
    }
}