package com.example.insightfood

import android.R
import android.R.attr.fontStyle
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import android.content.Context
import android.graphics.Color
import androidx.core.content.ContextCompat


class CustomSpinnerAdapter(context: Context, resource: Int, objects: Array<String>) :
    ArrayAdapter<String>(context, resource, objects) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = super.getView(position, convertView, parent) as TextView
        view.textSize = 16f
        view.setTextColor(Color.WHITE)
        return view
    }

    override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = super.getDropDownView(position, convertView, parent) as TextView
        view.setBackgroundColor(ContextCompat.getColor(context, R.color.black))
        view.setTextColor(context.resources.getColorStateList(R.color.white))
        view.gravity = Gravity.CENTER
        return view
    }
}
