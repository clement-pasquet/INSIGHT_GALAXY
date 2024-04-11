package com.example.insightfood

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

class MainActivity : AppCompatActivity() {

    lateinit var recipeAdapter: ArrayAdapter<Recipe>
    private var companion = KtorClient().getClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val et_search = findViewById<EditText>(R.id.et_search)
        val bt_search = findViewById<Button>(R.id.bt_search)
        val iv_recette = findViewById<ImageView>(R.id.iv_recette)
        val sk_nombre_recette = findViewById<SeekBar>(R.id.sk_nombre_recette)
        val tv_nombre_recette = findViewById<TextView>(R.id.tv_nombre_recette)
        val sp_cuisine = findViewById<Spinner>(R.id.sp_cuisine)

        val optionsArray :Array<String> = resources.getStringArray(R.array.optionsCuisine)

        val spinnerAdapter = CustomSpinnerAdapter(this, R.layout.style_spinner,optionsArray)
        sp_cuisine.adapter = spinnerAdapter
        var sp_cuisine_value = "African"

        //contrat personnalisé
        val resultatActivityContract = registerForActivityResult(ResultatActivityContract()) {

            if (it !== null) {
                Toast.makeText(this,"valeur de retour $it",Toast.LENGTH_SHORT).show()
            }
        }

        //charger l'image de base
        Picasso.get().load("https://cache.cosmopolitan.fr/data/photo/w1200_h630_c17/6f/plat-meconnu-meilleur-plat-au-monde.jpg").into(iv_recette)

        //valeur par défaut du textView au lancement
        tv_nombre_recette.text = "1"

        //valeur par défaut de la SeekBar au lancement
        sk_nombre_recette.max = 10
        sk_nombre_recette.min = 1
        sk_nombre_recette.progress = 1

        //Refléter le changement dans le textView au changement de la valeur de la seekbar
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

        sp_cuisine.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(p0: AdapterView<*>?, p1: View?, p2: Int, p3: Long) {
                sp_cuisine_value = p0?.getItemAtPosition(p2).toString()
            }

            override fun onNothingSelected(p0: AdapterView<*>?) {
                return
            }

        }

        bt_search.setOnClickListener {
            val nom_recette = et_search.text.toString()
            val nombre_recette = sk_nombre_recette.progress
            val cuisine_recette = if (sp_cuisine_value == "None") "" else sp_cuisine_value.lowercase()

            val response = companion.getRequestResult("complexSearch","&titleMatch=$nom_recette&cuisine=$cuisine_recette&number=$nombre_recette&addRecipeInformation=true")
            //val response = companion.getRequestResult(("query=$nom_recette&cuisine=$cuisine_recette&number=$nombre_recette&addRecipeInformation=true"))
            resultatActivityContract.launch(response)
        }

//        var recipeList: MutableList<Recipe> = Recipes.initTaskslist()
//        recipeAdapter = RecipeAdapter(this, recipeList)
//
//        val taskListView = findViewById<ListView>(R.id.list_tasks)
//        taskListView.adapter = recipeAdapter

//        bt_search.setOnClickListener {
//            val content = et_search.text.toString()
//            if (content.isBlank()) {
//                Toast.makeText(this,"le champs de recherche ne doit pas être vide ou ne contenir que des espaces",Toast.LENGTH_LONG).show()
//            }
//            val result = getRequestResult(content)
//            tv_result.setText(result)
//        }
   }

    /*
    * {"results":,"offset":0,"number":10,"totalResults":25}
    * */
}