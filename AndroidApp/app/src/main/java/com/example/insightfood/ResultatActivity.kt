package com.example.insightfood

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.serialization.json.Json
import kotlinx.serialization.decodeFromString

class ResultatActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_resultat)

        var recipes : Recipe? = null

        val result = intent.extras?.getString("result") as String
        val recipesList = Json{ignoreUnknownKeys = true}.decodeFromString<RecipesList>(result)

        recipesList.results.forEach {
            it.getInstructions()
        }

        Log.d("debugRomain instructions",recipesList.toString())

        val rv_resultat = findViewById<RecyclerView>(R.id.rv_resultat)
        rv_resultat.layoutManager = LinearLayoutManager(this)
        val rv_adapter = RecipeRecyclerAdapater(recipesList.results)
        rv_resultat.adapter = rv_adapter
    }
}