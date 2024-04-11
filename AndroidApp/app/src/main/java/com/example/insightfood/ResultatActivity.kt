package com.example.insightfood

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.serialization.json.Json
import kotlinx.serialization.decodeFromString

/**
 * Activité pour afficher les résultats de la recherche de recettes.
 * Cette activité récupère les résultats de la recherche passés via Intent, les décode et les affiche dans un RecyclerView.
 */
class ResultatActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_resultat)

        // Récupération des résultats de la recherche passés via Intent
        val result = intent.extras?.getString("result") as String

        // Décodage des résultats de la recherche en une liste de recettes
        val recipesList = Json{ignoreUnknownKeys = true}.decodeFromString<RecipesList>(result)

        // Récupération des instructions pour chaque recette
        recipesList.results.forEach {
            it.getInstructions()
        }

        // Initialisation du RecyclerView pour afficher les résultats de la recherche
        val rv_resultat = findViewById<RecyclerView>(R.id.rv_resultat)
        rv_resultat.layoutManager = LinearLayoutManager(this)
        val rv_adapter = RecipeRecyclerAdapater(recipesList.results)
        rv_resultat.adapter = rv_adapter
    }
}