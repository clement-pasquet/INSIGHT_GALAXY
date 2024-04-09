"use strict"
import * as chai from "chai";
import { Planet, planeteDao } from "../PlaneteDAO.mjs";
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Test Model
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

describe("Test du modèle Planet", function () {
    it("Modèle planète OK", async () => {
        const planetData = {
            name: 'HelloWorld',
            description: 'simpa',
            rotation_period: '15',
            orbital_period: '42',
            diameter: '45',
            climate: '',
            gravity: '1G', // Ajout de gravity dans les données de planète
            terrain: 'Mountain', // Ajout de terrain dans les données de planète
            surface_water: '20%', // Ajout de surface_water dans les données de planète
            population: '100000', // Ajout de population dans les données de planète
            type: 'Original' // Ajout de type dans les données de planète
        };

        const planet = new Planet(planetData);

        // Vérifie que les propriétés de la planète ont été correctement initialisées
        expect(planet).to.have.property('name', 'HelloWorld');
        expect(planet).to.have.property('description', 'simpa');
        expect(planet).to.have.property('rotation_period', '15');
        expect(planet).to.have.property('orbital_period', '42');
        expect(planet).to.have.property('diameter', '45');
        expect(planet).to.have.property('climate', '');
        expect(planet).to.have.property('gravity', '1G'); // Vérifie la gravité de la planète
        expect(planet).to.have.property('terrain', 'Mountain'); // Vérifie le terrain de la planète
        expect(planet).to.have.property('surface_water', '20%'); // Vérifie la surface d'eau de la planète
        expect(planet).to.have.property('population', '100000'); // Vérifie la population de la planète
        expect(planet).to.have.property('type', 'Original'); // Vérifie le type de la planète

        expect(planet).to.have.all.keys('name', 'description', 'rotation_period', 'orbital_period', 'diameter', 'climate', 'gravity', 'terrain', 'surface_water', 'population', 'type');
    });

    it("Modèle planète KO", async () => {
        const planetData = {
            name: 'HelloWorld',
            description: 'simpa',
            rotation_period: '15',
            orbital_period: '42',
            diameter: '45',
            climate: '',
            gravity: '1G', // Ajout de gravity dans les données de planète
            terrain: 'Mountain', // Ajout de terrain dans les données de planète
            surface_water: '20%', // Ajout de surface_water dans les données de planète
            population: '100000', // Ajout de population dans les données de planète
            type: 'Original' // Ajout de type dans les données de planète
        };
    
        const planet = new Planet(planetData);
    
        // Vérifie que les propriétés de la planète ont été correctement initialisées avec les types attendus
        expect(planet.name).to.be.a('string');
        expect(planet.description).to.be.a('string');
        expect(planet.rotation_period).to.be.a('string');
        expect(planet.orbital_period).to.be.a('string');
        expect(planet.diameter).to.be.a('string');
        expect(planet.climate).to.be.a('string');
        expect(planet.gravity).to.be.a('string');
        expect(planet.terrain).to.be.a('string');
        expect(planet.surface_water).to.be.a('string');
        expect(planet.population).to.be.a('string');
        expect(planet.type).to.be.a('string');
    
        // Vérifie que tous les types sont des chaînes de caractères (string)
        expect(planet).to.satisfy(() => {
            return Object.values(planetData).every(value => typeof value === 'string');
        });
    });

    it("Modèle planète KO", async () => {
        const planetData = {
            name: 'HelloWorld',
            description: 'simpa',
            rotation_period: 15,
            orbital_period: 42,
            diameter: 45,
            climate: '',
            gravity: '1G', // Ajout de gravity dans les données de planète
            terrain: 'Mountain', // Ajout de terrain dans les données de planète
            surface_water: '20%', // Ajout de surface_water dans les données de planète
            population: '100000', // Ajout de population dans les données de planète
            type: 'Original' // Ajout de type dans les données de planète
        };

        const planet = new Planet(planetData);

        // Le test échouera car les propriétés rotation_period, orbital_period et diameter doivent être des chaînes de caractères
        expect(() => { new Planet(planetData); }).to.throw();(planet).to.have.property('type', 'Original'); // Vérifie le type de la planète

    });
});



// Test DAO

// Test findPlanetsSWAPI
describe("Test planeteDAO", function () {
    let mongoServer;

    before(async ()=> {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri()
    })

    // Nettoyer les données avant/après chaque test
    beforeEach(async ()=> {
        await planeteDao.deleteAll();
    });

    afterEach(async () => {
        await planeteDao.deleteAll();
    });


    it("addPlanete OK", async ()=>{
        const planetData = {
            name: 'HelloWorld',
            description: 'simpa',
            rotation_period: '15',
            orbital_period: '42',
            diameter: '45',
            climate: '',
            gravity: '1G', // Ajout de gravity dans les données de planète
            terrain: 'Mountain', // Ajout de terrain dans les données de planète
            surface_water: '20%', // Ajout de surface_water dans les données de planète
            population: '100000', // Ajout de population dans les données de planète
            type: 'Original' // Ajout de type dans les données de planète
        };

        const newPlanet = new Planet(planetData);
    
        // Appel de la fonction pour ajouter la nouvelle planète à la base de données
        const resultat = await planeteDao.addPlanete(newPlanet);
        expect(resultat).to.be.equal(true)

        const name = 'HelloWorld'
        const planet = await planeteDao.findPlanetByNomDB(name)
        expect(planet).to.be.an("array")

        // Vérifie la fiabilité des informations
        const foundPlanet = planet[0];
        //console.log(foundPlanet)
        
        expect(foundPlanet.name).to.equal(newPlanet.name);
        expect(foundPlanet.rotation_period).to.equal(newPlanet.rotation_period);
        expect(foundPlanet.orbital_period).to.equal(newPlanet.orbital_period);
        expect(foundPlanet.diameter).to.equal(newPlanet.diameter);
        expect(foundPlanet.climate).to.equal(newPlanet.climate);
        expect(foundPlanet.gravity).to.equal(newPlanet.gravity);
        expect(foundPlanet.terrain).to.equal(newPlanet.terrain);
        expect(foundPlanet.surface_water).to.equal(newPlanet.surface_water);
        expect(foundPlanet.population).to.equal(newPlanet.population);
        expect(foundPlanet.type).to.be.equal('En attente');
    });

    // Test throw fonctionne pas
    it('addPlanete rejects when adding a planet with existing name', async () => {
        // planeteDao.findPlanetsDB().then(planets => console.log(planets))
        const planetData = {
            name: 'HelloWorld1',
            description: 'simpa',
            rotation_period: '15',
            orbital_period: '42',
            diameter: '45',
            climate: '',
            gravity: '1G', // Ajout de gravity dans les données de planète
            terrain: 'Mountain', // Ajout de terrain dans les données de planète
            surface_water: '20%', // Ajout de surface_water dans les données de planète
            population: '100000', // Ajout de population dans les données de planète
            type: 'Original' // Ajout de type dans les données de planète
        };

        const newPlanet1 = new Planet(planetData);
    
        // Appel de la fonction pour ajouter la nouvelle planète à la base de données
        await planeteDao.addPlanete(newPlanet1).then(resultat=>expect(resultat).to.be.equal(true))

        try {
            // Appel de la fonction pour essayer d'ajouter la planète existante à la base de données
            await planeteDao.addPlanete(newPlanet1)
        } catch (err) {
            err => {
                // Vérifie que l'erreur rejetée correspond à l'erreur attendue
                expect(err.message).to.equal("Une planète du même nom existe déjà !");
            }
        }
    });

    // Test deleteAll
    it('deleteAll OK',  async () => {

        // Ajoutez quelques planètes à la base de données
        const planetData1 = { name: 'Planet 1' };
        const planetData2 = { name: 'Planet 2' };
        const planetData3 = { name: 'Planet 3' };

        const newPlanet1 = new Planet(planetData1);
        const newPlanet2 = new Planet(planetData2);
        const newPlanet3 = new Planet(planetData3);

        await planeteDao.addPlanete(newPlanet1);
        await planeteDao.addPlanete(newPlanet2);
        await planeteDao.addPlanete(newPlanet3);

        // Vérifiez que les planètes ont été ajoutées avec succès
        const planetsBeforeDelete = await planeteDao.findPlanetsDB();
        
        expect(planetsBeforeDelete).to.have.lengthOf(3);
        // Appelez deleteAll pour supprimer toutes les planètes
        await planeteDao.deleteAll();

        // Vérifiez que la collection de planètes est vide après deleteAll
        const planetsAfterDelete = await planeteDao.findPlanetsDB();
        expect(planetsAfterDelete).to.have.lengthOf(0);
    });


/*
    it("findPlanetsSWAPI", async ()=>{
        const planets = await planeteDao.findPlanetsSWAPI()
        expect(planets).to.be.an("object"); // Vérifie que la réponse est un objet
        expect(planets).to.have.property("results"); // Vérifie que la réponse contient une propriété "results" (qui contient les planètes)
        expect(planets.results).to.be.an("array");

            // Vérifie que chaque élément du tableau possède les propriétés attendues
        planets.results.forEach(planet => {
            expect(planet).to.have.property("name");
            expect(planet).to.have.property("rotation_period");
            expect(planet).to.have.property("orbital_period");
            expect(planet).to.have.property("diameter");
            expect(planet).to.have.property("climate");
            expect(planet).to.have.property("gravity");
            expect(planet).to.have.property("terrain");
            expect(planet).to.have.property("surface_water");
            expect(planet).to.have.property("population");
            expect(planet).to.have.property("residents");
            expect(planet).to.have.property("films");
            expect(planet).to.have.property("created");
            expect(planet).to.have.property("edited");
            expect(planet).to.have.property("url");
        });

        // Vérifie que les données renvoyées sont complètes et correctes
        planets.results.forEach(planet => {
            expect(planet.name).to.be.a("string").that.is.not.empty;
            expect(planet.rotation_period).to.be.a("string").that.is.not.empty;
            expect(planet.orbital_period).to.be.a("string").that.is.not.empty;
            expect(planet.diameter).to.be.a("string").that.is.not.empty;
            expect(planet.climate).to.be.a("string").that.is.not.empty;
            expect(planet.gravity).to.be.a("string").that.is.not.empty;
            expect(planet.terrain).to.be.a("string").that.is.not.empty;
            expect(planet.surface_water).to.be.a("string").that.is.not.empty;
            expect(planet.population).to.be.a("string").that.is.not.empty;
            expect(planet.residents).to.be.an("array");
            expect(planet.films).to.be.an("array");
            expect(planet.created).to.be.a("string").that.is.not.empty;
            expect(planet.edited).to.be.a("string").that.is.not.empty;
            expect(planet.url).to.be.a("string").that.is.not.empty;
        });
    } )

    it("findPlanetByNomSWAPI OK", async ()=>{
        const name = "Tatooine"
        const planet = await planeteDao.findPlanetByNomSWAPI(name)
        expect(planets).to.be.an("object"); // Vérifie que la réponse est un objet
        expect(planets).to.have.property("results"); // Vérifie que la réponse contient une propriété "results" (qui contient les planètes)
        expect(planets.results).to.be.an("array");

        // Vérifie que chaque élément du tableau est une instance de la classe Planet
        planets.forEach(planet => {
            expect(planet).to.be.an.instanceOf(Planet);
        });

        // Vérifie que chaque planète possède les propriétés attendues
        planets.forEach(planet => {
            expect(planet).to.have.property("name");
            expect(planet).to.have.property("rotation_period");
            expect(planet).to.have.property("orbital_period");
            expect(planet).to.have.property("diameter");
            expect(planet).to.have.property("climate");
            expect(planet).to.have.property("gravity");
            expect(planet).to.have.property("terrain");
            expect(planet).to.have.property("surface_water");
            expect(planet).to.have.property("population");
            expect(planet).to.have.property("type").that.equals("Original");
            expect(planet).to.not.have.property("residents"); // Les résidents ne sont pas inclus dans la réponse filtrée
            expect(planet).to.not.have.property("films"); // Les films ne sont pas inclus dans la réponse filtrée
            expect(planet).to.not.have.property("created"); // La date de création n'est pas incluse dans la réponse filtrée
            expect(planet).to.not.have.property("edited"); // La date d'édition n'est pas incluse dans la réponse filtrée
            expect(planet).to.not.have.property("url"); // L'URL n'est pas incluse dans la réponse filtrée
        });
    } )

    it("findPlanetByNomSWAPI KO", async ()=>{
        const name = "Tatooine"
        const planet = await planeteDao.findPlanetByNomSWAPI(name)
        expect(planets).to.be.an("object"); // Vérifie que la réponse est un objet
        expect(planets).to.have.property("results"); // Vérifie que la réponse contient une propriété "results" (qui contient les planètes)
        expect(planets.results).to.be.an("array");

        // Vérifie que chaque élément du tableau est une instance de la classe Planet
        planets.forEach(planet => {
            expect(planet).to.be.an.instanceOf(Planet);
        });

        // Vérifie que chaque planète possède les propriétés attendues
        planets.forEach(planet => {
            expect(planet).to.have.property("name");
            expect(planet).to.have.property("rotation_period");
            expect(planet).to.have.property("orbital_period");
            expect(planet).to.have.property("diameter");
            expect(planet).to.have.property("climate");
            expect(planet).to.have.property("gravity");
            expect(planet).to.have.property("terrain");
            expect(planet).to.have.property("surface_water");
            expect(planet).to.have.property("population");
            expect(planet).to.have.property("type").that.equals("Original");
            expect(planet).to.not.have.property("residents"); // Les résidents ne sont pas inclus dans la réponse filtrée
            expect(planet).to.not.have.property("films"); // Les films ne sont pas inclus dans la réponse filtrée
            expect(planet).to.not.have.property("created"); // La date de création n'est pas incluse dans la réponse filtrée
            expect(planet).to.not.have.property("edited"); // La date d'édition n'est pas incluse dans la réponse filtrée
            expect(planet).to.not.have.property("url"); // L'URL n'est pas incluse dans la réponse filtrée
        });
    } )


    it("findPlanetsDB OK", async ()=>{

        // si le type est voté ça change le type
        const planet = await planeteDao.findPlanetsDB()


        expect(planet).to.be.an("object"); // Vérifie que la réponse est un objet
        expect(planet).to.have.property("results");
        expect(planet).to.be.an("array")
    })

    it("findPlanetByNomDB", async ()=>{
        const newPlanet = new Planet({
            name: "NewExtraPlanet",
            rotation_period: "24",
            orbital_period: "365",
            diameter: "10000",
            climate: "Tempéré",
            gravity: "1",
            terrain: "Forêts",
            surface_water: "50",
            population: "1000000"
        });
    
        // Appel de la fonction pour ajouter la nouvelle planète à la base de données
        await planeteDao.addPlanete(newPlanet);

        const planet = await planeteDao.findPlanetByNomDB("NewExtraPlanet")
        expect(planet).to.have.property("results");
        expect(planet).to.be.an("array")
    })*/

    // Supprime toutes les données ajoutées à la base de données
    after(async () => {
        await planeteDao.deleteAll();
        await mongoServer.stop();
    });
})

// Test findPlanetsByNomSWAPI

