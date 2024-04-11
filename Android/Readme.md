# R411 - Développement pour applications mobiles

## Introduction 

Cette application Android a été développée dans le cadre d'un projet d'équipe SAE à l'IUT de Nantes.<br> L'objectif principal de cette application est de permettre aux utilisateurs de rechercher des recettes culinaires en utilisant l'API de Spoonacular.<br>
Inspirée de notre projet web **Insight Galaxy** sur le thème des planètes de Star Wars, **Insight Food** vous propose une expérience de découverte culinaire grâce à l'utilisation de l'API Spoonacular.

## Les vues

Avant de commencer le projet, nous avons décider de modéliser les différentes vues qu'auront accès les différents utilisateurs sur notre application. <br>C'est donc sur le logiciel <a href="https://www.figma.com/">figma</a> que nous avons pu réaliser les vue suivantes :

### Le préloader
A chaque démarrage de notre application nous avons choisi d'afficher une page de chargement.<br>
<img src="img/preloader.png" height="500px"></img>

### Page de recherche 
<img src="img/PageRecherche.png" height="500px"></img>

### Listes des résultats 
Après avoir rechercher une recette, nous obtenons dans une listView la liste de toutes nos résultats
<br><img src="img/RecettesListe.png" height="500px"></img>


### Affichage de la recette 

<br><img src="img/Recette.png" height="500px"></img>


## API SPOONACULAR

Il a fallu par la suite regarder plus en détail la documentation de l'api <a href="https://spoonacular.com/food-api">SPOONACULAR</a>. Cette API possède de nombreux paramètres et il était important de comprendre quels étaient les commandes que nous allions utiliser. 

Pour notre application nous choisirons d'utiliser seulement 2 liens : <br>
Avec : <br>
ID => L'identifiant d'une recette de l'api<br>
KEY => Notre api key<br>
LIMIT => Le nombre maximum de recettes à afficher<br>
NOM => le nom de la recette<br>
PAYS => Le pays originaire de la recette<br>

Ce lien permet de renvoyer une liste de recettes en fonction des critères spécifiés, tels que le nom de la recette, le pays d'origine, et le nombre maximum de recettes à afficher.<br>
https://api.spoonacular.com/recipes/complexSearch?apiKey=KEY$request&titleMatch=NOM&cuisine=PAYS&number=LIMIT&addRecipeInformation=true

Ce lien permet de récupérer les informations détaillées d'une recette spécifique (Ingrédients, étapes de préparations, Restrictions alimentaire) <br>
https://api.spoonacular.com/recipes/ID/analyzedInstructions?apiKey=KEY

## Les différentes Classes


### Nos Adaptateurs

Nous avons développé plusieurs adaptateurs pour gérer l'affichage et l'interaction avec les éléments de l'interface utilisateur dans notre application Insight Food :

**RecipeAdapter**: Ce adaptateur est utilisé pour afficher les résultats de recherche de recettes dans une liste. Il gère l'affichage de chaque item de la liste en utilisant un layout spécifique, permettant ainsi aux utilisateurs de visualiser rapidement les détails de chaque recette.

**RecipeRecyclerAdapter**: Ce adaptateur est utilisé avec un RecyclerView pour gérer et afficher les éléments dans la liste de résultats de recherche. Il offre une gestion efficace des éléments de la liste en utilisant une approche de recyclage, ce qui améliore les performances et l'expérience utilisateur.

**CustomSpinnerAdapter**: Ce adaptateur permet une personnalisation avancée de l'arrière-plan et des couleurs d'un spinner dans notre application. Il offre une flexibilité accrue pour adapter l'apparence du spinner selon les besoins de conception de l'application.

### Nos Classes de Données

Nous avons également créé plusieurs classes de données pour représenter les différentes entités et informations pertinentes dans notre application :

**Equipment**: Cette classe correspond à un équipement utilisé dans une étape de préparation d'une recette, et comprend également la température associée si nécessaire.

**Ingredient**: Cette classe représente un ingrédient utilisé dans une recette, avec son image associée pour une identification facile.

**Length**: Cette classe correspond à une durée, principalement utilisée pour représenter le temps de préparation d'une recette, avec son unité spécifiée.

**Recipe**: Cette classe encapsule les informations essentielles d'une recette, telles que le titre, les ingrédients, les instructions de préparation, etc.

**RecipesList**: Cette classe nous permet de stocker une liste de recettes (`Recipe`), ainsi que des informations sur le nombre total de recettes spécifiées.

**Step**: Cette classe représente une étape individuelle dans la préparation d'une recette. Elle contient les ingrédients nécessaires pour l'étape, les équipements utilisés, ainsi que les instructions détaillées pour cette étape.

**Temperature**: Cette classe représente une température, avec son unité spécifiée si nécessaire.

**RecipeInstructionsResult**: Cette classe permet de stocker le nom d'une recette avec ses différentes étapes de préparation, facilitant ainsi la gestion et l'affichage des instructions de préparation dans notre application.

Ces adaptateurs et classes de données jouent un rôle crucial dans la gestion des données et l'interaction utilisateur dans notre application Insight Food, offrant ainsi une expérience utilisateur fluide et intuitive lors de la recherche et de la préparation de délicieuses recettes culinaires.






