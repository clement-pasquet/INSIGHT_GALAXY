import express from 'express';
import {planeteDao, Planet, uniformPlanetName} from "./PlaneteDAO.mjs"
import cors from "cors"
import { Key } from './const.mjs';
import { lienSite } from './const.mjs';
import path from 'path'
import multer from 'multer'
import fs from 'fs'
import { fileURLToPath } from 'url';

// Convertir l'URL du fichier en chemin de fichier
const __filename = fileURLToPath(import.meta.url);
// Obtenir le chemin absolu du dossier courant
const __dirname = path.dirname(__filename);

const app = express();
const port = 8090;
const assetsFolder = "assets/"
app.use(cors({
   origin: lienSite
 }));
app.use(express.static('assets'));
const uploadDir = path.join('.', assetsFolder);
 if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir);
 }



// Configurer Multer pour la gestion des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, assetsFolder);
  },
  filename: function (req, file, cb) {
    cb(null, uniformPlanetName(req.params.name)+ ".png");
  }
});

const upload = multer({ storage: storage });


app.listen(port, () => {
    console.log("\x1b[32m Serveur Express en cours d'exécution sur le port\x1b[33m "+port+" \x1b[0m");
  });


// Middleware pour les requêtes entrantes
app.use(express.json()); // Pour parser le corps des requêtes en JSON

// Renvoie toutes les planètes de notre application
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

//Permet de récupérer une planete en fonction d'un nom
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
    const {name,description,rotation_period,orbital_period,diameter,climate,gravity,terrain,surface_water,population} = req.body;
    const newPlanet = {
        name: name,
        description:description,
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

app.get('/vote/:name', (req,res)=> {
   const name = req.params.name;
   const clientIP = req.socket.remoteAddress;
   planeteDao.addVotePlanete(name,clientIP)
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

app.get('/unvote/:name', (req,res)=> {
   const name = req.params.name;
   const clientIP = req.socket.remoteAddress;
   planeteDao.removeVotePlanete(name,clientIP)
   .then((retour)=>{
      if(retour){
         res.status(200).send('Vote enlevé avec succès !')
         return
      }
      res.status(500).send("Le vote n'a pas pu être enlevé")
   })
   .catch(err => {
      console.error(err);
      res.status(500).send("Erreur lors de l'enlevement du vote");
   });
})

//Retourne le nombre de vote pour une planète
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


});

//Retourne le nombre de vote pour une planète
app.get('/allvote', (req,res)=> {
   const clientIP = req.socket.remoteAddress;
   planeteDao.getAllUserVotes(clientIP)
   .then(votes => {
      res.json(votes);
   })
   .catch(err => {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération de la planète');
   });


});



function validateImage(req, res, next) {
   const imageName = req.params.name;
   
   // Vérifier si la planète est dans la base de données
   if (planeteDao.findPlanetByNom(imageName).length != 0) {
      fs.access('assets/' + uniformPlanetName(imageName) + '.png', fs.constants.F_OK, (err) => {
         if (err) {
           next(); 
         } else {
           // Le fichier image existe, envoyer une réponse d'erreur
           res.status(400).send('Image non autorisée !');
         }
       });

   } else {
     res.status(400).send('Image non autorisée !');
   }
 }
 
app.post('/planet/:name',validateImage, upload.single('file'),(req,res) => {
   res.send('Fichier téléchargé avec succès !');

});

app.get('/planet/image/:imageName', (req, res) => {
   const imageName  = uniformPlanetName(req.params.imageName);
   fs.access('assets/'+imageName+'.png', fs.constants.F_OK, (err) => {
      if (err) {
         res.status(400).send('Image non existante !');
      }
      // Envoyer l'image au client
      res.sendFile(`${__dirname}/assets/${imageName }.png`);
   });
    
   
 });

