package com.example.insightfood

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.activity.result.contract.ActivityResultContract

class ResultatActivityContract : ActivityResultContract<String,String?>() {
    override fun createIntent(context: Context, input: String): Intent {
        return Intent(context,ResultatActivity::class.java).putExtra("result",input)
    }

    override fun parseResult(resultCode: Int, intent: Intent?): String? {
        var res : String? = null

        if (resultCode == Activity.RESULT_OK) {
            res = intent?.extras?.getString("contenu retour")
        }

        return res
    }
}