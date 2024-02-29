//Fichier qui extrait la planète de l'image en enlevant le fond

import cv from 'opencv4nodejs';


// Fonction pour charger l'image à partir de l'URL
async function loadImageFromUrl(url) {
    try {
        // Récupérer les données de l'image à partir de l'URL
        let response = await fetch(url);
        let arrayBuffer = await response.arrayBuffer();
        
        // Convertir les données en tableau d'octets (buffer)
        let bytes = new Uint8Array(arrayBuffer);
        
        // Créer une image à partir des données
        let img = cv.imdecode(bytes);
        
        return img;
    } catch (error) {
        console.error('Erreur lors du chargement de l\'image:', error);
        return null;
    }
}






// Charger l'image de la planète depuis un élément img
let imgElement = loadImageFromUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEhf2In8dCP3Idp92ca1k3GmZQxbxoWB6n-Stz6X9AZ1vI2WcfKoLYHXI6hA&amp;s")
let mat = cv.imread(imgElement);

// Convertir l'image en niveaux de gris
cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);

// Détection des contours
let contours = new cv.MatVector();
let hierarchy = new cv.Mat();
cv.findContours(mat, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

// Dessiner les contours détectés sur une copie de l'image originale
let dst = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
for (let i = 0; i < contours.size(); ++i) {
    let color = new cv.Scalar(255, 255, 255); // Couleur des contours (blanc)
    cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 0);
}

// Afficher l'image avec les contours détectés
cv.imshow('contoursCanvas', dst);

// Libérer la mémoire
mat.delete();
dst.delete();
contours.delete();
hierarchy.delete();
