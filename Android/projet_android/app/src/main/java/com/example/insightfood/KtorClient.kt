package com.example.insightfood

import android.util.Log
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

/**
 * Classe représentant le client Ktor pour effectuer des requêtes HTTP.
 * Cette classe utilise le moteur OkHttp et installe plusieurs plugins pour la gestion des délais d'attente, la journalisation et l'observation des réponses.
 */
class KtorClient {
    companion object {
        // URL de base pour les requêtes API
        val BASE_URL = "https://api.spoonacular.com/recipes/"
        // Clés API pour les requêtes
        val apiKeyR = "4ea50b2bfd794af4a7545d9faec33f1e"
        val apiKeyB = "8e13014e5dd64dc8b1d765ce3b0e332f"
        val apiKeyTemp = "4886ff7d281c41559ce07e419f6d1d82"
        // Client Ktor avec configuration
        val kTorClient = HttpClient(OkHttp) {
            // Installation du plugin HttpTimeout pour gérer les délais d'attente
            install(HttpTimeout) {
                requestTimeoutMillis = 15000L
                connectTimeoutMillis = 15000L
                socketTimeoutMillis = 15000L
            }
            // Installation du plugin Logging pour la journalisation
            install(Logging) { /* mode debug */
                logger = object : Logger {
                    override fun log(message: String) {
                        Log.v("Logger Ktor =>", message)
                    }
                }
                level = LogLevel.ALL
            }
            // Installation du plugin ResponseObserver pour observer les réponses
            install(ResponseObserver) { /* mode debug */
                onResponse { response ->
                    Log.d("HTTP status:", "${response.status.value}")
                }
            }
        }

        /**
         * Méthode pour obtenir le résultat d'une requête GET.
         * Cette méthode est bloquante et doit être appelée dans un contexte approprié.
         *
         * @param endpoint Le point de terminaison pour la requête.
         * @param request La requête à effectuer.
         * @return Le résultat de la requête sous forme de chaîne de caractères.
         */
        fun getRequestResult(endpoint : String, request : String) : String {
            lateinit var result : String
            runBlocking(Dispatchers.IO) {
                val response = kTorClient.get("$BASE_URL$endpoint?apiKey=$apiKeyR$request")
                result = response.body<String>()
                Log.d("debugRomain ktor",result)
            }
            return result
        }
    }

    /**
     * Méthode pour obtenir une instance du client Ktor.
     *
     * @return Une instance du client Ktor.
     */
    fun getClient() : KtorClient.Companion {
        return Companion
    }
}