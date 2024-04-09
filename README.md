# INSIGHT GALAXY

<img alt="Image de Mars" src="Images/Mars.jpg" width="750px" >

## Notre équipe

Notre équipe est constitué de 5 jeunes développeurs tous élèves au sein de l'IUT de Nantes en suivant un BUT Informatique.<br>
Constitution :
- BERNIER-Justine
- BOURGET-Romain
- LEVY-Bryan
- MALKI-Basma
- PASQUET-Clement


## Description du projet

Ce projet provient d'une Situation d'Apprentissage et d'Évaluation (SAE) de notre formation en BUT Informatique.

Insight Galaxy est un projet qui explore les diverses planètes présentes il y a très longtemps dans une galaxie lointaine, très lointaine... 
Vous l'avez compris, ce projet portera sur l'univers de Star Wars et les planètes décrites dans cet univers. 

Insight Galaxy nous permet de parcourir via l'API REST SWAPI (une API sur l'univers de Star Wars, qui répertorie les planètes, les vaisseaux et les personnages de cette fameuse saga) les différentes planètes. Il sera possible de liker les différentes planètes de cet univers afin d'élire LA planète préférée des téléspectateurs. 

De plus, notre application nous donne la possibilité de proposer l'ajout d'une nouvelle planète sortie de notre imagination. Chaque semaine, le dimanche soir, à la suite d'un vote sur l'ajout des planètes proposées par les différents utilisateurs, la planète la plus votée de la semaine sera ajoutée à l'application !


Insight Galaxy a pour objectif de cultiver la curiosité des gens envers l'univers de Star Wars et de les inciter à découvrir de nouvelles planètes !

## Structure

```
.
├── AndroidApp
├── API
│   ├── assets
│   │   ├── alderaan.png
│   │   ├── aleenminor.png
│   │   └── ...
|   ├── test
|   |   ├── test_PlanetDAO.mjs
│   │   └── test_server.mjs
│   ├── const.mjs
│   ├── launchServ.sh
│   ├── node_modules
│   ├── package.json
│   ├── PlaneteDAO.mjs
│   ├── README.md
│   └── server.mjs
└── Web
    ├── index.html
    ├── launchSite.sh
    ├── public
    └── src
        ├── assets
        ├── Composants
        ├── Controller
        ├── Font
        ├── main.jsx
        ├── Style
        └── View
``` 

*La représentation est simplifiée*

## Adresse de notre site Web

L'adresse est http://localhost:5173/

## Présentation 



## Crédits
Nous utilisons plusieurs API et sources et nous souhaitons les remercier (et préciser que tout ne vient pas de nous) :

- API sur Star wars : [SWAPI](https://swapi.dev/)
- API pour récupérer des couleurs d'images : [API Tineye ](https://services.tineye.com/developers/multicolorengine/api_reference/extract_image_colors)
- Images de nos planètes : Google



## Configuration de la partie TEST

En utilisant mocha,
```
npm install --save-dev mocha
```

Pour affichage de la couverture nous utilisons c8 qui est un dérivé de Istanbul
instalation dans notre projet
```
npm i nyc --save-dev
npm install c8 istanbul-lib-coverage istanbul-reports --save-dev
```

Rajout de Chai ( pour utiliser les fonctions assert ) : 
```
npm install chai
```

Puis rajouter dans package.json
```
  "scripts": {
    ...
    "test": "c8 mocha --timeout 5000 --exit",
    ...
  },
```

https://stackoverflow.com/questions/16633246/code-coverage-with-mocha
https://github.com/laggingreflex/mochista

<br>
<br>
<br>
<a href="./API/README.md">

</a>

[***Une description de notre DAO, et de nos documentations sont disponibles sur le README du dossier /API***](API/README.md)
