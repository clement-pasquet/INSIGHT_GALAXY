import express from 'express';
import {planeteDao, Planet, uniformPlanetName} from "./PlaneteDAO.mjs"
import cors from "cors"
import { Key, nbPlanetPerDay } from './const.mjs';
import { lienSite } from './const.mjs';
import path from 'path'
import multer from 'multer'
import fs from 'fs'
import { fileURLToPath } from 'url';
import cron from 'node-cron'
import swaggerUi from 'swagger-ui-express'
import swaggerJson from './swagger.json' assert {type: 'json'};




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

app.use(express.static('docs'))
//route pour swagger
app.use('/documentation-route', swaggerUi.serve, swaggerUi.setup(swaggerJson))

app.get('/documentation-js', (req, res) => {
   res.sendFile(__dirname + '/docs/index.html');
});

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


cron.schedule('0 0 21 * * 7', () => { //Tous les dimanches, la planète la plus voté est ajouté à l'api
   planeteDao.getMostVotedPlanet().then(planete => {
      if(planete.length>0){
         planeteDao.findPlanetByNomDB(planete[0].name).then(async planetDb => {
         if (planetDb.length>0){
            let votedPlanet = {...planetDb[0]}

            votedPlanet.type = "Votee"
            await planeteDao.deleteAllWaiting()
            
            planeteDao.addPlanete(new Planet(votedPlanet))
               
         }
         });  
      }
  }).catch(err => {
      console.error(err);
  });
 });

app.listen(port, () => {
    console.log("\x1b[32m Serveur Express en cours d'exécution sur le port\x1b[33m "+port+" \x1b[0m");
  });


// Middleware pour les requêtes entrantes
app.use(express.json()); // Pour parser le corps des requêtes en JSON

// Renvoie toutes les planètes de notre application
app.get('/planet', (req, res) => {
   // #swagger.summary = 'Nos planètes'
   // #swagger.description = 'Renvoie les planètes de star wars + celle ajoutés'
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
   // #swagger.summary = 'Une planète'
   // #swagger.description = 'Renvoie la planète dans une liste sous la forme [planete]'
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

 //Permet de récupérer les votes de toutes les planètes
app.get('/info/vote', (req, res) => {
   // #swagger.summary = 'Liste des votes des planètes ajoutés'
   // #swagger.description = 'Renvoie le nombre actuel de vote pour chaque planète'
   planeteDao.getMostVotedPlanet()
      .then(planet => {
         res.status(200).json(planet); // Envoyer la réponse au format JSON
      })
      .catch(err => {
         console.error(err);
         res.status(500).send('Erreur lors de la récupération des votes');
      });
});


//Ajout d'une planète
 app.post('/planet', (req, res) => {
   // #swagger.summary = "Création d'une nouvelle planète"
   // #swagger.description = "Créé une nouvelle planete si elle n'existe déjà pas"
   /**
 * @swagger
 * /planet:
 *   post:
 *     summary: Create a new planet
 *     tags: [Planet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the planet
 *               description:
 *                 type: string
 *                 description: Description of the planet
 *               rotation_period:
 *                 type: string
 *                 description: Rotation period of the planet
 *               orbital_period:
 *                 type: string
 *                 description: Orbital period of the planet
 *               diameter:
 *                 type: string
 *                 description: Diameter of the planet
 *               climate:
 *                 type: string
 *                 description: Climate of the planet
 *               gravity:
 *                 type: string
 *                 description: Gravity of the planet
 *               terrain:
 *                 type: string
 *                 description: Terrain of the planet
 *               surface_water:
 *                 type: string
 *                 description: Surface water of the planet
 *               population:
 *                 type: string
 *                 description: Population of the planet
 *     responses:
 *       '200':
 *         description: Planet created successfully
 *       '500':
 *         description: Error creating the planet
 *       '501':
 *         description: Error too many planet created today
 */
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
   planeteDao.getNbAddedPlanetToday().then(nb=>{
      if(nb >= nbPlanetPerDay){
         res.status(501).send("Erreur lors de la création de la planète : Trop de planètes ajouté aujourd'hui");

      }else{

         planeteDao.addPlanete(new Planet(newPlanet))
         .then(isCreated => {
         if (isCreated){
               res.status(200).send('Planète ajouté avec succès !')
               console.log('\x1b[32mPlanète ajouté avec succès !\x1b[0m');

         }else{
               res.status(500).send("Erreur lors de la création de la planète : Retour faux de l'ajout d'une planète à la DB");
         }
         })
         .catch(err => {
            console.error(err);
            res.status(500).send('Erreur lors de la création de la planète');
         });
      }
   }).catch(err => {
      console.error(err);
      res.status(500).send('Erreur lors de la création de la planète');
   });
   

   
 });

 app.get('/planet/delete/:key/:name', (req, res) => {
   // #swagger.summary = 'Supprime une planète (ajouté)'
   // #swagger.description = 'Pour les admins, qui connaissent la clé, supprime la planète avec comme nom :name'
    const planetName = req.params.name;
    const keyLink = req.params.key;
    if(keyLink!=Key){
      res.status(403).send('Accès refusé');
      //Répertorier les personnes qui tente de supprimer une planète ? (sécurité)
      return
    }

    planeteDao.deletePlanetsByName(planetName)
       .then(() => {
          res.status(200).send('Planète supprimée avec succès !');
          console.log('\x1b[32mPlanète supprimée avec succès ! \x1b[0m');

       })
       .catch(err => {
          console.error(err);
          res.status(500).send('Erreur lors de la suppression de la planète');
       });
 });

 app.get('/planet/deleteAll/:key', (req, res) => {
   // #swagger.summary = 'Supprime toutes les planètes (ajoutés)'
   // #swagger.description = 'Pour les admins, qui connaissent la clé, supprime toutes les planètes créées par les utilisateurs'
   const keyLink = req.params.key;
   if(keyLink!=Key){
     res.status(403).send('Accès refusé');
     //Répertorier les personnes qui tente de supprimer une planète ? (sécurité)
     return
   }

   planeteDao.deleteAll()
      .then(() => {
         res.status(200).send('Planètes supprimées avec succès !');
         console.log('\x1b[32mToutes les planètes ajoutés ont été supprimées avec succès ! \x1b[0m');

      })
      .catch(err => {
         console.error(err);
         res.status(500).send('Erreur lors de la suppression des planètes');
      });
});



app.post('/vote/:name', (req,res)=> {
   // #swagger.summary = 'Vote pour une planètes'
   // #swagger.description = "Vote pour la planète avec comme nom :name, et enregistre l'adresse ip de la personne lançant la requète"
   // #swagger.parameters['name'] = { in: 'path', description: 'Nom de la planète', required: true, type: 'string' }
   // #swagger.responses[200] = { description: 'Vote effectué avec succès !' }
   // #swagger.responses[400] = { description: 'Le vote n'a pas pu être effectué || Erreur lors de la récupération de la planète || Erreur lors de la récupération de l ip' }
   // #swagger.body = { description: 'Objet qui contient l'adresse ip de l'utilisateur', required: true, type: 'object' }
   
   const name = req.params.name;
   const clientIP = req.body;
   if(clientIP.ip){
      planeteDao.addVotePlanete(name,clientIP.ip)
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
   }else{
      res.status(500).send('Erreur lors de la récupération de l ip');


   }
   
   
})

app.post('/unvote/:name', (req,res)=> {
   // #swagger.summary = "Enlève le vote d'une planètes"
   // #swagger.description = "Enlève le vote pour la planète avec comme nom :name, comme vote ayant comme adresse ip celle de la personne lançant la requète"
   // #swagger.parameters['name'] = { in: 'path', description: 'Nom de la planète', required: true, type: 'string' }
   // #swagger.responses[200] = { description: 'Vote enlevé avec succès !' }
   // #swagger.responses[400] = { description: 'Le vote n'a pas pu être enlevé || Erreur lors de l'enlevement de la planète || Erreur lors de l'enlevement de l ip' }
   // #swagger.body = { description: 'Objet qui contient l'adresse ip de l'utilisateur', required: true, type: 'object' }
   
   const name = req.params.name;
   const clientIP = req.body;
   if(clientIP.ip){
      planeteDao.removeVotePlanete(name,clientIP.ip)
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
   }else{
      res.status(500).send('Erreur lors de la récupération de l ip');

   }
})

//Retourne le nombre de vote pour une planète
app.get('/getvote/:name', (req,res)=> {
   // #swagger.summary = 'Nombre de vote d'une planète'
   // #swagger.description = 'Envoie le nombre de vote pour une planète avec comme nom :name'

   const name = req.params.name;

   planeteDao.getNbVote(name)
   .then((nb)=>{
      res.status(200).send({count:nb})
   })
   .catch(err => {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération de la planète');
   });


});


app.post('/allvote', (req,res)=> {
   // #swagger.summary = 'Récupère tous les votes d'une planètes'
   // #swagger.description = 'Récupère le nombre de votes pour chaque planètes'
   // #swagger.responses[200] = { description: 'Vote enlevé avec succès !' }
   // #swagger.responses[400] = { description: 'Le vote n'a pas pu être enlevé || Erreur lors de l'enlevement de la planète || Erreur lors de l'enlevement de l ip' }
   // #swagger.body = { description: 'Objet qui contient l'adresse ip de l'utilisateur', required: true, type: 'object' }
   

   const clientIP = req.body;
   if(clientIP.ip){
      planeteDao.getAllUserVotes(clientIP.ip)
      .then(votes => {
         res.status(200).json(votes);
      })
      .catch(err => {
         console.error(err);
         res.status(500).send('Erreur lors de la récupération de la planète');
      });
   }else{
      res.status(500).send('Erreur lors de la récupération de l ip');
   }


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
// #swagger.summary = "Ajout de l'image d'une planète"
// #swagger.description = "Télécharge l'image de la planète sur le serveur si elle n'existe déjà pas"
// #swagger.parameters['name'] = { in: 'path', description: 'Nom de la planète', required: true, type: 'string' }
// #swagger.responses[200] = { description: 'Image téléchargée' }
// #swagger.responses[400] = { description: 'Image non autorisée (Déjà présente)' }
// #swagger.definitions['Planet'] = { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, rotation_period: { type: 'string' }, orbital_period: { type: 'string' } } }
// #swagger.body = { description: 'Fichier image de la planète', required: true, type: 'file' }
   res.status(200).send('Fichier téléchargé avec succès !');

});

app.get('/planet/image/:imageName', (req, res) => {
   // #swagger.summary = "Récupère l'image d'une planète"
   // #swagger.description = "Envoie l'image qui correspond à la planète ayant comme nom :imageName"
   const imageName  = uniformPlanetName(req.params.imageName);
   fs.access('assets/'+imageName+'.png', fs.constants.F_OK, (err) => {
      if (err) {
         res.status(400).send('Image non existante !');
      }
      // Envoyer l'image au client
      res.sendFile(`${__dirname}/assets/${imageName }.png`);
   });
    
   
 });

