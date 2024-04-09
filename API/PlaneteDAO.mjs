"use strict";
import {HttpsProxyAgent} from 'https-proxy-agent';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fetch from 'node-fetch';


/**
 * Classe représentant une Planete.
 */
export class Planet {
    name ;
    description;
    rotation_period;
    orbital_period;
    diameter;
    climate;
    gravity;
    terrain;
    surface_water;
    population;
    type;

    constructor(obj) {
        //declare et instancie les attribut en recopiant ceux de obj
        Object.assign(this, obj);
    }    
}


const mongoServer = await MongoMemoryServer.create();
//connexion
const url = mongoServer.getUri()

//Un schema de la table planetes permetant de typer les données dans mongo
const optionsPlanet = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ['name'],
            properties: {
                identifiant: {
                    bsonType: "string",
                    description: "Identifiant de la planete"
                },
                name: {
                    bsonType: "string",
                    description: "Nom de la planete"
                },
                description: {
                    bsonType : "string",
                    description: "Description de la planete"
                },
                rotation_period:{
                    bsonType: "string",
                    description: "Periode de rotation de la planete en heure"
                },
                orbital_period: {
                    bsonType:"string",
                    description: "Nombre de jour d'un orbite autour de son étoile local"
                },
                diameter:{
                    bsonType:"string",
                    description: "Diametre de la planete en kilometre"
                },
                climate : {
                    bsonType:"string",
                    description:"Les climats de la planète. Elle est séparée par des virgules si elle en possède plusieurs. Ex:Arid"
                },
                gravity:{
                    bsonType:"string",
                    description:"La force de gravité de la planète. Basé sur la gravité terrestre.  1=1G , 2=2G"
                },
                terrain:{
                    bsonType:"string",
                    description:"Les types de terrain que possède la planete. Si il y en a plusieurs ils sont séparé par des virgules. Ex:Dessert"
                },
                surface_water:{
                    bsonType:"string",
                    description:"Pourcentage de la planète qui est recouverte d'eau (Ou de corps fait en eau)"
                },
                population:{
                    bsonType:"string",
                    description:"La population moyenne des êtres sensibles habitant cette planète."
                },
                type: {
                    bsonType: "string",
                    description: "Original / En attente / Votee" //Original (provient de l'api SWAPI) , En attente (Une des planètes proposées par un utilisateur) / Votee (Planète qui a été élu pour apparaître dans l'application)
                }                
            }
        }
    }
};

//Un schema de la table planetesAdded permetant de typer les données dans mongo

const optionsPlanetAdded =  {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ['name'],
            properties:  {
                
                name: {
                    bsonType: "string",
                    description: "Nom de la planete"
                },
                date: {
                    bsonType: "string",
                    description: "Date de la creation de la planete"
                }
                             
            }
        }
    }
};



//Un schema de la table votePlanete permetant de typer les données dans mongo
const optionVote= {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ['name', 'token'],
            properties: {
                name: {
                    bsonType: "string",
                    description: "Nom de la planete"
                },
                token: {
                    bsonType: "string",
                    description: "Token unique d'un utilisateur (Adresse ip)"
                }
            }
        }
    }
}


//DAO qui propose des fonctions qui utilise notre API SWAPI et des interractions avec notre base de données MongoDB
const planeteDao = {
    

    /**
     * Fonction qui retourne la liste de toutes les planetes de Star Wars
     * @returns {Object} Une liste d'objet d'informations sur les planetes (nom, rotation_period, orbital_period, ...)
     * @throws {Error} Une erreur si la requête échoue.
     */
    findPlanetsSWAPI: async () => {
        const proxy = process.env.https_proxy
        let agent = null
        if (proxy != undefined) {
            console.log(`Le proxy est ${proxy}`)
            agent = new HttpsProxyAgent(proxy);
        }
        else {
            //pour pouvoir consulter un site avec un certificat invalide
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            console.log("Pas de proxy trouvé")
        }


        const url = "https://swapi.info/api/planets/";


        try {
            const response = agent != null ? await fetch(url, { headers: { Accept: 'application/json' }, agent: agent }) : await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }
            
            const json = await response.json();
            return json.filter((element) => {
                const { name } = element;
                if (uniformPlanetName(name) != 'unknown'){
                    return true
                }
            });
        
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    },
    /**
     * Fonction qui retourne une liste qui contient la planète de Star war avec un certain nom
     * @param {String} nom - Nom de la planète que l'on souhaite récupérer (Les espaces et majuscules ne comptent pas)
     * @returns {Array<Planet>} Une liste contenant 0 ou 1 planète Star Wars avec comme type Original 
     * @returns {Promise<*>} En cas d'erreur, un promise.reject est retourné
     * 
     * @throws {Error} Une erreur si la requête échoue.
     */
    findPlanetByNomSWAPI: async (nom) => {
        nom = nom.toLowerCase()
        const proxy = process.env.https_proxy
        let agent = null
        if (proxy != undefined) {
            console.log(`Le proxy est ${proxy}`)
            agent = new HttpsProxyAgent(proxy);
        }
        else {
            //pour pouvoir consulter un site avec un certificat invalide
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            console.log("Pas de proxy trouvé")
        }
        const url = "https://swapi.info/api/planets/";


        try {
        const response = agent != null ? await fetch(url, { headers: { Accept: 'application/json' }, agent: agent }) : await fetch(url);
        
        if (!response.ok) {
            return Promise.reject(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const json = await response.json();
    
        return json.filter((objPlanet) => {
            if (uniformPlanetName(objPlanet.name) == nom) {
                return true; // Garde cet élément dans le nouveau tableau
            }
            return false; // Enlève cet élément du nouveau tableau
        }).map((element) => {
            const { residents, films, created, edited, url, ...planetData } = element;
            if (uniformPlanetName(planetData['name']) != 'unknown'){
                planetData['type'] = 'Original';
                return new Planet(planetData)
            }
        });
        } catch (error) {
            return Promise.reject("Error fetching data")

        }

    },
    
    /**
     * Fonction qui retourne la liste de toutes les planetes ajoutés à la base de données
     * @returns {Array<Planet>} Une liste de planetes
     * @returns {Promise<*>} Si la requête à la base de donnée échoue., un promise.reject est retourné
     */
    findPlanetsDB: async () => {
        const client = new MongoClient(url);
        try {
            const maBD = client.db("maBD");
            const planetes = maBD.collection("planetes", optionsPlanet);
            const cursor = planetes.find({}, {
                projection: { _id: 0 }
            });
            return (await cursor.toArray()).map((e) => new Planet(e));
        } catch (error) {
            return Promise.reject("Error fetching data")

        }finally {
            await client.close();
        }

    },

    /**
     * Fonction qui retourne une liste qui contient la planète de notre base de données avec un certain nom
     * @param {String} nom - Nom de la planète que l'on souhaite récupérer (Les espaces et majuscules ne comptent pas)
     * @returns {Array<Planet>} Une liste contenant 0 ou 1 planète Star Wars avec comme type Original 
     * @returns {Promise<*>} En cas d'erreur, un promise.reject est retourné
     * 
     * @throws {Error} Une erreur si la requête échoue.
     */
    findPlanetByNomDB: async (nom) => {
        const client = new MongoClient(url);
        try {
            const maBD = client.db("maBD");
            const planetes = maBD.collection("planetes", optionsPlanet);
            const cursor = planetes.find({name: nom}, { 
                projection: { _id: 0 }
            });
            return (await cursor.toArray()).map((e) => new Planet(e));
        } finally {
            await client.close();
        }

    },
    /**
     * Fonction qui retourne une liste qui contient toutes les planètes de l'api SWAPI et de notre base de données
     * @returns {Array<Planet>} Une liste contenant 0 ou 1 planète Star Wars avec comme type Original 
     */
    findPlanets: async () => {
        let planetsSWAPI = await planeteDao.findPlanetsSWAPI()
        let planetDB = await planeteDao.findPlanetsDB()
        return planetsSWAPI.concat(planetDB)
    },
    /**
     * Fonction qui retourne une liste qui contient la planète de l'api SWAPI ou de notre base de données avec un certain nom
     * @param {String} nom - Nom de la planète que l'on souhaite récupérer (Les espaces et majuscules ne comptent pas)
     * @returns {Array<Planet>} Une liste contenant 0 ou 1 planète Star Wars avec comme type Original 
     */
    findPlanetByNom: async (nom) => {
        let planets = await planeteDao.findPlanetByNomSWAPI(nom)
        let planetsDb = await planeteDao.findPlanetByNomDB(nom)
        return [...planets,...planetsDb]

    },
    /**
     * Fonction qui retourne une liste qui contient la planète de notre base de données avec un certain nom
     * @param {Planet} planete - Une planète que l'on souhaite ajouter à notre API
     * @returns {Boolean} true si la planètes à été ajouté dans la base planètes et dans la table planetesAdded (qui précise la date d'ajout de la planète)     * 
     * @returns {Promise<*>} En cas d'erreur, un promise.reject est retourné
     */
    addPlanete: async (planete) => {
        if (planete instanceof Planet){
            const client = new MongoClient(url);
            try {
                let lsPlaneteSimilaire = (await planeteDao.findPlanetByNom(planete.name)).filter(pl => pl.name.toLowerCase() === planete.name.toLowerCase());
                if(lsPlaneteSimilaire.length>0 ){
                    return Promise.reject("Une planète du même nom existe déjà !")
                }
                const maBD = client.db("maBD");
                const planets = maBD.collection("planetes", optionsPlanet);
                let maPlanete = {...planete}
                if(maPlanete['type']  != "Votee"){
                    maPlanete['type'] = 'En attente'
                }
                let { acknowledged: ack1, _ } = await planets.insertOne(maPlanete);
                const planetsAdded = maBD.collection("planetesAdded", optionsPlanetAdded);
                let { acknowledged: ack2, _2 } = await planetsAdded.insertOne({ name: maPlanete.name, date: getTodayDate() });

                if(ack1 && ack2){
                    return true
                }
                return false
            } catch(e){
                return Promise.reject("Il y a une erreur dans l'ajout d'une planète")
                
            }finally {
                await client.close();
            }
        }
        Promise.reject("La planète passée en paramètre n'est pas du type Planet")
    },
    /**
     * Fonction qui supprime toutes les planètes de notre base de données
     */
    deleteAll: async () => {
        const client = new MongoClient(url);
            try {
                const maBD = client.db("maBD");
                const planets = maBD.collection("planetes", optionsPlanet);
                await planets.deleteMany({});

                const vote = maBD.collection("votePlanete", optionVote);
                await vote.deleteMany({});


                
                
            } finally {
                await client.close();
            }
    },
    /**
     * Fonction qui supprime toutes les planètes qui sont de type 'En attente" de notre base de données
     */
    deleteAllWaiting: async () => {
        const client = new MongoClient(url);
            try {
                const maBD = client.db("maBD");
                const planets = maBD.collection("planetes", optionsPlanet);
                await planets.deleteMany({type:"En attente"});

                const vote = maBD.collection("votePlanete", optionVote);
                await vote.deleteMany({});


                
                
            } finally {
                await client.close();
            }
    },
    /**
     * Fonction qui supprime la planète avec comme nom le nom donné en paramètre
     * @param {String} nom - Nom qui précise la planète à supprimer
     * 
     */
    deletePlanetsByName: async (nom) => {
        const client = new MongoClient(url);
        try {
            const maBD = client.db("maBD");
            const planets = maBD.collection("planetes", optionsPlanet);
            await planets.deleteOne({name: { $regex: new RegExp(nom, 'i') }}); //Supprime les planètes son name contient la valeur de nom en ignorant la casse.
            
            
        } finally {
            await client.close();
        }
    },
    /**
     * Fonction qui ajoute un vote à la planète nomPlanete et à la personne ayant comme ip le token
     * @param {String} nomPlanete - Le nom de la planète auquel est effectué le vote
     * @param {String} token - L'adresse ip de l'utilisateur qui a voté
     * @returns {Boolean} - true si le vote à pu être effectué, false sinon 
     * 
     */
    addVotePlanete: async (nomPlanete, token) => {
        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("votePlanete", optionVote);
    
    
            const planet = await planets.findOne({ name: nomPlanete, token: token });
            if(planet == null){
                const lsplanet = await planeteDao.findPlanetByNom(nomPlanete)
                if(lsplanet.length > 0){
                    const { acknowledged, _ } = await planets.insertOne({ name: nomPlanete, token: token});
                    if(acknowledged){
                        return true
                    }
                }
            }
            return false


        } finally {
            await client.close();
        }
    },
    /**
     * Fonction qui enlève un vote qui à été effectué à la planète nomPlanete et par la personne ayant comme ip le token
     * @param {String} nomPlanete - Le nom de la planète qui shouhaite enlever son vote
     * @param {String} token - L'adresse ip de l'utilisateur qui shouhaite enlever son vote
     * @returns {Boolean} - true si l'enlevement du vote à pu être effectué, false sinon 
     * 
     */
    removeVotePlanete: async (nomPlanete, token) => {
        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("votePlanete", optionVote);
    
    
            const planet = await planets.findOne({ name: nomPlanete, token: token });
            if(planet != null){
                const { acknowledged, _ } = await planets.deleteOne({ name: nomPlanete, token: token });
                if(acknowledged){
                    return true
                }
                
            }
            return false


        } finally {
            await client.close();
        }
    },
    /**
     * Fonction qui renvoie le nombre total de vote pour une planète
     * @param {String} nomPlanete - Le nom d'une planète de notre API 
     * @returns {Number} - Le nombre de vote total pour une planète
     * 
     */
    getNbVote: async (nomPlanete) => {
        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("votePlanete", optionVote);
    
    
            const count = await planets.countDocuments({name:nomPlanete});
            return count;

        } finally {
            await client.close();
        }
    },
     /**
     * Fonction qui renvoie toutes les planètes qu'un utilisateur a voté
     * @param {String} token - L'adresse ip d'un utilisateur
     * @returns {Array<Object>} - Renvoie une liste d'objets avec comme objet sous forme : {name:nomdelaplanète}
     * 
     */
    getAllUserVotes: async (token) => {
        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("votePlanete", optionVote);
    
    
            const list = planets.find( { token: token }, {
                projection: { _id: 0,name:1 }
            });
            return await list.toArray();

        } finally {
            await client.close();
        }
    },
    /**
     * Fonction qui renvoie la planète qui a le plus de vote dans notre bd 
     * @param {String} token - L'adresse ip d'un utilisateur
     * @returns {Array<Object>} - Renvoie une liste contenant au plus un unique objet sous forme : {name:nomdelaplanète,totalVotes:nombredevote}
     * 
     */
    getMostVotedPlanet : async () =>{

        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("votePlanete", optionVote);
    
            const planetMostVoted = await planets.aggregate([
                {
                    $group: {
                        _id: '$name', 
                        totalVotes: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0, 
                        name: '$_id', 
                        totalVotes: 1 
                    }
                },
                {
                    $sort: { totalVotes: -1 }
                },
                {
                    $limit: 1
                }
            ])
            return await planetMostVoted.toArray();

        } catch (e){
            return Promise.reject("La récupération des votes n'as pas pu être effectué")
        } finally {
            await client.close();
        }

    },
    /**
     * Fonction qui renvoie le nombre de planète qui a été ajouté aujourd'hui
     * @returns {Number} - Retourne le nombre de planète ajouté
     * 
     */
    getNbAddedPlanetToday: async () => {
        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("planetesAdded", optionVote);
    
    
            const count = await planets.countDocuments({date:getTodayDate()});
            return count;

        } catch(e){
            return 0
            
        }finally {
            await client.close();
        }
    },
    


};

/**
     * Fonction qui renvoie la date d'aujourd'hui
     * @returns {String} - Retourne la date d'aujourd'hui sous la forme jour/mois/annee
     * 
*/
function getTodayDate(){
    const date = new Date();
    const jour = date.getDate();
    const mois = date.getMonth() + 1; 
    const annee = date.getFullYear();
    return jour+'/'+mois+'/'+annee;

}

/**
     * Fonction qui renvoie un nom de planète formaté pour son filtrage
     * @param {String} name nom de la planète que l'on souhaite formater
     * @returns {String} - Retourne la date d'aujourd'hui sous la forme jour/mois/annee
     * 
*/
function uniformPlanetName(name){
    return name.toLowerCase().replace(" ","");
}

export { planeteDao , uniformPlanetName};
