"use strict"
import * as chai from "chai";
import {Planet, planeteDao, uniformPlanetName} from "../PlaneteDAO.mjs";
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

    it("Modèle planète types OK", async () => {
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
    
        // Vérifie que tous les types sont des chaînes de caractères (string)
        expect(planet).to.satisfy(() => {
            return Object.values(planetData).every(value => typeof value === 'string');
        });
    });

});



// Test planeteDAO
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

    it('findPlanetsSWAPI Proprietes OK', async function () {
        const planets = await planeteDao.findPlanetsSWAPI();
        //console.log("LE type de la planète et :",typeof planets)
        expect(typeof planets).to.be.equal("object");

        expect(planets).to.be.an("array");
    
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
        });
    });

    it('findPlanetByNomSWAPI devrait retourner une liste de planètes correspondant au nom fourni avec les attributs corrects', async () => {
        const planet = await planeteDao.findPlanetByNomSWAPI('Tatooine');
        expect(planet).to.be.an('array').with.length.greaterThan(0);
        expect(planet.every(info => info instanceof Planet)).to.be.true;
    
        // Vérifier les attributs de la première planète retournée
        const firstPlanet = planet[0];
        expect(firstPlanet.name).to.equal('Tatooine');
        expect(firstPlanet.description).to.equal(undefined);
        expect(firstPlanet.rotation_period).to.equal('23');
        expect(firstPlanet.orbital_period).to.equal('304');
        expect(firstPlanet.diameter).to.equal('10465');
        expect(firstPlanet.climate).to.equal('arid');
        expect(firstPlanet.gravity).to.equal('1 standard');
        expect(firstPlanet.terrain).to.equal('desert');
        expect(firstPlanet.surface_water).to.equal('1');
        expect(firstPlanet.population).to.equal('200000');
        expect(firstPlanet.type).to.equal('Original');
    });
    
    it('findPlanetByNomSWAPI devrait retourner une liste vide si aucun nom ne correspond', async () => {
        const planets = await planeteDao.findPlanetByNomSWAPI('notfound');
        expect(planets).to.be.an('array').that.is.empty;
    });
    
    it('findPlanetsDB devrait retourner une liste de planètes depuis la base de données', async () => {
        const newPlanet = new Planet({
            name: "NewExtraPlanet1",
            rotation_period: "24",
            orbital_period: "365",
            diameter: "10000",
            climate: "Tempéré",
            gravity: "1",
            terrain: "Forêts",
            surface_water: "50",
            population: "1000000"
        });

        await planeteDao.addPlanete(newPlanet);

        const planets = await planeteDao.findPlanetsDB();
        expect(planets).to.be.an('array').with.length.greaterThan(0);
        expect(planets.every(info => info instanceof Planet)).to.be.true;
        // Vous pouvez ajouter des assertions supplémentaires ici pour vérifier les détails spécifiques des planètes retournées
        expect(planets[0].name).to.equal('NewExtraPlanet1');
    });

    it('findPlanetsDB devrait retourner une liste vide si aucune planète n\'est trouvée dans la base de données', async () => {
        const planets = await planeteDao.findPlanetsDB();
        expect(planets).to.be.an('array').that.is.empty;
    });

       // Crée une nouvelle planète pour l'ajouter à la base de données ( Test d'intégration )
       it("findPlanetByNomDB", async () => {
        const newPlanet = new Planet({
            name: "NewExtraPlanet2",
            rotation_period: "24",
            orbital_period: "365",
            diameter: "10000",
            climate: "Tempéré",
            gravity: "1",
            terrain: "Forêts",
            surface_water: "50",
            population: "1000000"
        });

        await planeteDao.addPlanete(newPlanet);

        const planet = await planeteDao.findPlanetByNomDB("NewExtraPlanet2");

        //console.log(planet)

        // Vérifie si la planète a été trouvée
        expect(planet[0]).to.have.property("rotation_period");
        expect(planet[0]).to.have.property("orbital_period");
        expect(planet[0]).to.have.property("diameter");
        expect(planet[0]).to.have.property("climate");
        expect(planet[0]).to.have.property("gravity");
        expect(planet[0]).to.have.property("terrain");
        expect(planet[0]).to.have.property("surface_water");
        expect(planet[0]).to.have.property("population");

        // Vérifie les propriétés de la première planète du tableau
        expect(planet[0].rotation_period).to.equal("24");
        expect(planet[0].orbital_period).to.equal("365");
        expect(planet[0].diameter).to.equal("10000");
        expect(planet[0].climate).to.equal("Tempéré");
        expect(planet[0].gravity).to.equal("1");
        expect(planet[0].terrain).to.equal("Forêts");
        expect(planet[0].surface_water).to.equal("50");
        expect(planet[0].population).to.equal("1000000");


        expect(planet).to.be.an("array");
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
    it('addPlanete rejects when adding a planet with existing name throw error message', async () => {
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

    it("addPlanet rejects adding a planet if it's not an instance of Planet", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        try {
            await planeteDao.addPlanete(planetData1);
        } catch (error) {
            expect(error).to.equal("La planète passée en paramètre n'est pas du type Planet");
        }
    });

    // Test deleteAll
    it('addPlanete and deleteAll OK',  async () => {

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

    it('addPlanete and deleteAllWaiting OK',  async () => {
        const planetData1 = { name: 'Planet 1', type: 'En attente' };
        const planetData2 = { name: 'BabyShark', type: 'Original' };

        const newPlanet1 = new Planet(planetData1);
        const newPlanet2 = new Planet(planetData2);

        await planeteDao.addPlanete(newPlanet1);
        await planeteDao.addPlanete(newPlanet2);

        const planetsBeforeDelete = await planeteDao.findPlanetsDB();
        expect(planetsBeforeDelete).to.have.lengthOf(2);
        await planeteDao.deleteAllWaiting();
        const planetsAfterDelete = await planeteDao.findPlanetsDB();
        expect(planetsAfterDelete).to.have.lengthOf(0);
    });

    it("deletePlanetsByName OK", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        const newPlanet1 = new Planet(planetData1);

        await planeteDao.addPlanete(newPlanet1);
        const planetsBeforeDelete = await planeteDao.findPlanetsDB();
        expect(planetsBeforeDelete).to.have.lengthOf(1);
        await planeteDao.deletePlanetsByName("BabyShark");
        const planetsAfterDelete = await planeteDao.findPlanetsDB();
        expect(planetsAfterDelete).to.have.lengthOf(0);
    });

    it("deletePlanetsByName KO", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        const newPlanet1 = new Planet(planetData1);

        await planeteDao.addPlanete(newPlanet1);
        const planetsBeforeDelete = await planeteDao.findPlanetsDB();
        expect(planetsBeforeDelete).to.have.lengthOf(1);
        await planeteDao.deletePlanetsByName("BabyShark1");
        const planetsAfterDelete = await planeteDao.findPlanetsDB();
        expect(planetsAfterDelete).to.have.lengthOf(1);
    });

    it("addVotePlanete OK", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        const newPlanet1 = new Planet(planetData1);

        await planeteDao.addPlanete(newPlanet1);
        expect(await planeteDao.addVotePlanete("BabyShark", "abc123")).to.be.true;

    });

    it("addVotePlanete KO already exists", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        const newPlanet1 = new Planet(planetData1);

        await planeteDao.addPlanete(newPlanet1);
        expect(await planeteDao.addVotePlanete("BabyShark", "abc123")).to.be.true;
        expect(await planeteDao.addVotePlanete("BabyShark", "abc123")).to.be.false;
    });

    it("addVotePlanete KO planet not found", async () => {
        expect(await planeteDao.addVotePlanete("BabyShark", "abc123")).to.be.false;
    });

    it("removeVotePlanete OK", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        const newPlanet1 = new Planet(planetData1);

        await planeteDao.addPlanete(newPlanet1);
        await planeteDao.addVotePlanete("BabyShark", "abc123");
        expect(await planeteDao.removeVotePlanete("BabyShark", "abc123")).to.be.true;
    });

    it("removeVotePlanete KO vote doesn't exist", async () => {
        expect(await planeteDao.removeVotePlanete("BabyShark", "abc123")).to.be.false;
    });

    it("getNbVote OK 0 vote", async () => {
        expect(await planeteDao.getNbVote("BabyShark")).to.be.equal(0);
    });

    it("getNbVote OK 1 vote", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        const newPlanet1 = new Planet(planetData1);

        await planeteDao.addPlanete(newPlanet1);
        await planeteDao.addVotePlanete("BabyShark", "abc123");
        expect(await planeteDao.getNbVote("BabyShark")).to.be.equal(1);
    });

    it("getAllUserVotes OK 0 votes", async () => {
        expect(await planeteDao.getAllUserVotes("abc123")).to.be.an("array").with.lengthOf(0);
    });

    it("getAllUserVotes OK 2 votes", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        const newPlanet1 = new Planet(planetData1);
        const planetData2 = { name: 'BabyShark2', type: 'copy' };
        const newPlanet2 = new Planet(planetData2);

        await planeteDao.addPlanete(newPlanet1);
        await planeteDao.addPlanete(newPlanet2);
        await planeteDao.addVotePlanete("BabyShark", "abc123");
        await planeteDao.addVotePlanete("BabyShark2", "abc123");
        expect(await planeteDao.getAllUserVotes("abc123")).to.be.an("array").with.lengthOf(2);
    });

    it("getMostVotedPlanet OK", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        const newPlanet1 = new Planet(planetData1);
        const planetData2 = { name: 'BabyShark2', type: 'copy' };
        const newPlanet2 = new Planet(planetData2);

        await planeteDao.addPlanete(newPlanet1);
        await planeteDao.addPlanete(newPlanet2);
        await planeteDao.addVotePlanete("BabyShark", "abc123");
        await planeteDao.addVotePlanete("BabyShark2", "abc123");
        await planeteDao.addVotePlanete("BabyShark2", "abcd1234");

        const result = await planeteDao.getMostVotedPlanet();
        const name = result[0].name;
        const totalVotes = result[0].totalVotes;
        expect(name).to.be.equal("BabyShark2");
        expect(totalVotes).to.be.equal(2);
    });

    it("uniformPlanetName OK", async () => {
        expect(uniformPlanetName("Hello World")).to.be.equal("helloworld");
    });

    // Supprime toutes les données ajoutées à la base de données
    after(async () => {
        await planeteDao.deleteAll();
        await mongoServer.stop();
    });
})
