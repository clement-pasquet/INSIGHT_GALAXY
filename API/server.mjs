import express from 'express';
import {planeteDao, Planet } from "./PlaneteDAO.mjs"
import cors from "cors"
import { Key } from './const.mjs';
import { lienSite } from './const.mjs';


const app = express();
const port = 8090;

app.use(cors({
   origin: lienSite
 }));
 


app.listen(port, () => {
    console.log("\x1b[32m Serveur Express en cours d'exécution sur le port\x1b[33m "+port+" \x1b[0m");
  });


// Middleware pour les requêtes entrantes
app.use(express.json()); // Pour parser le corps des requêtes en JSON

// Exemple de route
app.get('/planet', (req, res) => {
    planeteDao.findPlanets()
       .then(planet => {
          res.json(planet); // Envoyer la réponse au format JSON
       })
       .catch(err => {
          console.error(err);
          res.status(500).send('Erreur lors de la récupération de la planète');
       });
 });

//Permet de récupérer les planete en fonction d'un nom (renvoie les planètes qui contienne ce nom)
app.get('/planet/:name', (req, res) => {
    const planetName = req.params.name;
    planeteDao.findPlanetByNom(planetName)
       .then(planet => {
          res.json(planet); // Envoyer la réponse au format JSON
       })
       .catch(err => {
          console.error(err);
          res.status(500).send('Erreur lors de la récupération de la planète');
       });
 });


//Ajout d'une planète
 app.post('/planet', (req, res) => {
    const {name,rotation_period,orbital_period,diameter,climate,gravity,terrain,surface_water,population} = req.body;
    const newPlanet = {
        name: name,
        rotation_period: rotation_period,
        orbital_period: orbital_period,
        diameter: diameter,
        climate: climate,
        gravity: gravity,
        terrain: terrain,
        surface_water: surface_water,
        population: population,
        type: "En attente"
      };

    planeteDao.addPlanete(new Planet(newPlanet))
       .then(isCreated => {
        if (isCreated){
            res.send('Planète ajouté avec succès !')
            console.log('\x1b[32mPlanète ajouté avec succès !\x1b[0m');

        }else{
            res.status(500).send("Erreur lors de la création de la planète : Retour faux de l'ajout d'une planète à la DB");
        }
       })
       .catch(err => {
          console.error(err);
          res.status(500).send('Erreur lors de la création de la planète');
       });
 });

 app.get('/planet/delete/:key/:name', (req, res) => {
    const planetName = req.params.name;
    const keyLink = req.params.key;
    if(keyLink!=Key){
      res.status(403).send('Accès refusé');
      //Répertorier les personnes qui tente de supprimer une planète ? (sécurité)
      return
    }

    planeteDao.deletePlanetsByName(planetName)
       .then(() => {
          res.send('Planète supprimée avec succès !');
          console.log('\x1b[32mPlanète supprimée avec succès ! \x1b[0m');

       })
       .catch(err => {
          console.error(err);
          res.status(500).send('Erreur lors de la suppression de la planète');
       });
 });

 app.get('/planet/deleteAll/:key', (req, res) => {
   const keyLink = req.params.key;
   if(keyLink!=Key){
     res.status(403).send('Accès refusé');
     //Répertorier les personnes qui tente de supprimer une planète ? (sécurité)
     return
   }

   planeteDao.deleteAll()
      .then(() => {
         res.send('Planètes supprimées avec succès !');
         console.log('\x1b[32mToutes les planètes ajoutés ont été supprimées avec succès ! \x1b[0m');

      })
      .catch(err => {
         console.error(err);
         res.status(500).send('Erreur lors de la suppression des planètes');
      });
});

app.put('/planet', (req, res) => {
   const {name,rotation_period,orbital_period,diameter,climate,gravity,terrain,surface_water,population} = req.body;
   const newPlanet = {
       name: name,
       rotation_period: rotation_period,
       orbital_period: orbital_period,
       diameter: diameter,
       climate: climate,
       gravity: gravity,
       terrain: terrain,
       surface_water: surface_water,
       population: population,
       type: "En attente"
     };

   planeteDao.addPlanete(new Planet(newPlanet))
      .then(isCreated => {
       if (isCreated){
           res.send('Planète ajouté avec succès !')
           console.log('\x1b[32mPlanète ajouté avec succès !\x1b[0m');

       }else{
           res.status(500).send("Erreur lors de la création de la planète : Retour faux de l'ajout d'une planète à la DB");
       }
      })
      .catch(err => {
         console.error(err);
         res.status(500).send('Erreur lors de la création de la planète');
      });
});

app.get('/vote/:name/:token', (req,res)=> {
   const name = req.params.name;
   const token = req.params.token;

   planeteDao.addVotePlanete(name,token)
   .then((retour)=>{
      if(retour){
         res.status(200).send('Vote effectué avec succès !')
         return
      }
      res.status(500).send("Le vote n'a pas pu être effectué")
   })
   .catch(err => {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération de la planète');
   });
})

app.get('/getvote/:name', (req,res)=> {
   const name = req.params.name;

   planeteDao.getNbVote(name)
   .then((nb)=>{
      res.json({count:nb})
   })
   .catch(err => {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération de la planète');
   });


})

