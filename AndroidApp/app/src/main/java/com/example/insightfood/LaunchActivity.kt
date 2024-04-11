package com.example.insightfood

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import androidx.appcompat.app.AppCompatActivity

class LaunchActivity: AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.ic_launcher_background_layout) // Définit le layout de l'activité qui est ic_launcher_background_layout

        // Utilise un Handler pour retarder l'exécution de la main activity
        Handler().postDelayed({
            val intent = Intent(this, MainActivity::class.java) // Crée un Intent pour démarrer MainActivity
            startActivity(intent) // Démarre MainActivity
            finish() // Termine l'activité LaunchActivity
        }, 2000) // Délai de 2000 millisecondes (2 secondes)
    }
}
