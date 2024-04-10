package com.example.insightfood

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView

class DetailsActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_details)

        val tv_details = findViewById<TextView>(R.id.resultat_tv_titre)

        tv_details.text = intent.extras?.getParcelable<Recipe>("recipe").toString()
    }
}