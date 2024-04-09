package com.example.insightfood

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logger
import io.ktor.client.plugins.logging.Logging
import io.ktor.client.plugins.observer.ResponseObserver
import io.ktor.client.request.get
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking

class MainActivity : AppCompatActivity() {

    lateinit var recipeAdapter: ArrayAdapter<Recipe>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val et_search = findViewById<EditText>(R.id.et_search)
        val bt_search = findViewById<Button>(R.id.bt_search)
        val tv_result = findViewById<EditText>(R.id.tv_result)
        val list_view = findViewById<ListView>(R.id.list_tasks)

        var recipeList: MutableList<Recipe> = Recipes.initTaskslist()
        recipeAdapter = RecipeAdapter(this, recipeList)

        val taskListView = findViewById<ListView>(R.id.list_tasks)
        taskListView.adapter = recipeAdapter

        bt_search.setOnClickListener {
            val content = et_search.text.toString()
            if (content.isBlank()) {
                Toast.makeText(this,"le champs de recherche ne doit pas être vide ou ne contenir que des espaces",Toast.LENGTH_LONG).show()
            }
            val result = getRequestResult(content)
            tv_result.setText(result)
        }
    }

    /*
    * {"results":,"offset":0,"number":10,"totalResults":25}
    * */

    //permet d'instancier un client Ktor pour faire des requêtes internet
    companion object {
        val kTorClient = HttpClient(OkHttp) {
            install(HttpTimeout) {
                requestTimeoutMillis = 15000L
                connectTimeoutMillis = 15000L
                socketTimeoutMillis = 15000L
            }
            install(Logging) { /* debug mode */
                logger = object : Logger {
                    override fun log(message: String) {
                        Log.v("Logger Ktor =>", message)
                    }
                }
                level = LogLevel.ALL
            }
            install(ResponseObserver) { /* debug mode */
                onResponse { response ->
                    Log.d("HTTP status:", "${response.status.value}")
                }
            }
        }
        fun getRequestResult(name : String) : String {
            lateinit var result : String
            runBlocking(Dispatchers.IO) {
                val response = kTorClient.get("https://api.spoonacular.com/recipes/complexSearch?query=$name&apiKey=4ea50b2bfd794af4a7545d9faec33f1e")
                result = response.body<String>()
            }
            return result
        }
    }
}