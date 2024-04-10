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

class KtorClient {
    companion object {
        val BASE_URL = "https://api.spoonacular.com/recipes/"
        val apiKeyR = "4ea50b2bfd794af4a7545d9faec33f1e"
        val apiKeyB = "8e13014e5dd64dc8b1d765ce3b0e332f"
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
        fun getRequestResult(endpoint : String, request : String) : String {
            lateinit var result : String
            runBlocking(Dispatchers.IO) {
                val response = kTorClient.get("$BASE_URL$endpoint?apiKey=$apiKeyB$request")
                result = response.body<String>()
                Log.d("debugRomain ktorSize",result.length.toString())
                Log.d("debugRomain ktor",result)
            }
            return result
        }
    }

    fun getClient() : KtorClient.Companion {
        return Companion
    }
}