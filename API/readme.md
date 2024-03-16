# Serveur Express

Ce serveur nous permet l'interraction avec notre API SWAPI et notre base de données.

En lançant le script ```launch.sh``` cela nous permet de lancer le serveur express ainsi que sa base de données.

## Accèder au serveur et ces données

Le serveur express nous permet via des liens, intéragir avec notre dao (qui lui récupére les données de l'API et de notre base de données)

```/planet``` : Nous renvoie la liste de toutes les planètes de notre applications (SWAPI + BD)<br>
```/planet/nomPlanet``` : Nous renvoie la planète qui possède le nom exacte de **nomPlanet** <br>

Une requète **post** avec ```/planet``` avec dans le body une planete (en objet json) nous permet l'ajout d'une nouvelle proposition de planète <br>


```/planet/delete/ApiKey/nomPlanet``` : Nous permet de supprimer une des planete de notre base de données, avec **ApiKey** une clé unique et secrète et **nomPlanet** le nom de la planète à supprimer <br>

```/planete/deleteAll/ApiKey``` : Nous permet de supprimer toutes les planètes de notre base de données, avec **ApiKey** une clé unique et secrète 