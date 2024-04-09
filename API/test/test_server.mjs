"use strict"
import * as chai from "chai";
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
import supertest from "supertest"
import app from "../server.mjs";
import {Planet, planeteDao, uniformPlanetName} from "../PlaneteDAO.mjs";
import { beforeEach } from "node:test";
import { Key } from '../const.mjs'
import fs from 'fs';
import path from 'path';

const requestWithSupertest = supertest(app)

describe("Server routes tests", function() {
    before(async ()=> {
        // Setup MongoDB memory server
        const {MongoMemoryServer}  = await import('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
    });

    // Nettoyer les données avant/après chaque test
    beforeEach(async ()=> {
        await planeteDao.deleteAll();
    });

    it("GET /planet should return status code 200", async ()=> {
        const response = await requestWithSupertest.get("/planet");
        expect(response.status).to.eql(200);
    });

    it("GET /planet/:name with name Tatooine should return status code 200", async () => {
        const planetName = 'Tatooine';
        const response = await requestWithSupertest.get(`/planet/${planetName}`);
        expect(response.status).to.eql(200);
    });

    it("GET /info/vote should return status code 200", async () => {
        const response = await requestWithSupertest.get("/info/vote");
        expect(response.status).to.eql(200);
    });

    it("GET /info/vote should return an array of planet votes", async () => {
        const response = await requestWithSupertest.get("/info/vote");
        expect(response.body).to.be.an("array");
    });

    it("GET /planet/delete/:key/:name should return status code 200 and delete the planet with correct key", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        const newPlanet1 = new Planet(planetData1);
    
        // Ajouter la planète
        const createPlanetResponse = await requestWithSupertest.post("/planet").send(newPlanet1);
        expect(createPlanetResponse.status).to.eql(200);
    
        // Supprimer la planète avec la clé correcte
        const deletePlanetResponse = await requestWithSupertest.get(`/planet/delete/${Key}/${planetData1.name}`);
        expect(deletePlanetResponse.status).to.eql(200);
    });
    
    it("GET /planet/delete/:key/:name should return status code 403 when key is incorrect", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        const newPlanet1 = new Planet(planetData1);
    
        // Ajouter la planète avec la clé correcte
        const createPlanetResponse = await requestWithSupertest.post("/planet").send(newPlanet1);
        expect(createPlanetResponse.status).to.eql(200);
    
        // Supprimer la planète avec une clé incorrecte
        const deletePlanetResponse = await requestWithSupertest.get(`/planet/delete/ItTheIncorrectKey/${planetData1.name}`);
        expect(deletePlanetResponse.status).to.eql(403);
    });

    it("GET /planet/deleteAll/:key should return status code 200 for successful delete all planets", async () => {
        // Supprimer la planète avec une clé correcte
        const deletePlanetResponse = await requestWithSupertest.get(`/planet/deleteAll/${Key}`);
        expect(deletePlanetResponse.status).to.eql(200);
    });

    it("GET /planet/deleteAll/:key should return status code 403 when key is incorrect", async () => {    
        // Supprimer la planète avec une clé incorrecte
        const deletePlanetResponse = await requestWithSupertest.get("/planet/deleteAll/ItTheIncorrectKey");
        expect(deletePlanetResponse.status).to.eql(403);
    });

    it("POST /vote/:name should return status code 200 for successful vote", async () => {
        const planetName = 'Tatooine'; // Nom de la planète pour laquelle le vote est effectué
        const clientIP = { ip: '192.168.1.1' }; // Adresse IP du client votant

        const response = await requestWithSupertest.post(`/vote/${planetName}`).send(clientIP);
        expect(response.status).to.eql(200);
        expect(response.text).to.eql('Vote effectué avec succès !');
    });

    it("POST /vote/:name should return status code 500 if IP address is missing", async () => {
        const planetName = 'Tatooine'; // Nom de la planète pour laquelle le vote est effectué
        const clientIP = {}; // Adresse IP du client votant manquante

        const response = await requestWithSupertest.post(`/vote/${planetName}`).send(clientIP);
        expect(response.status).to.eql(500);
        expect(response.text).to.eql("Erreur lors de la récupération de l ip");
    });

    it("POST /vote/:name should return status code 500 if vote cannot be completed", async () => {
        const planetName = 'NonExistingPlanet'; // Nom de la planète inexistante
        const clientIP = { ip: '192.168.1.1' }; // Adresse IP du client votant

        const response = await requestWithSupertest.post(`/vote/${planetName}`).send(clientIP);
        expect(response.status).to.eql(500);
        expect(response.text).to.eql("Le vote n'a pas pu être effectué");
    });

    it('POST /unvote/:name should return status code 200 for successful unvote', async () => {
        const planetName = 'Tatooine';
        const clientIP = { ip: '192.168.1.1' };

        // Envoie une requête POST à la route /unvote/:name avec les données de la planète et l'adresse IP du client
        const response = await requestWithSupertest.post(`/unvote/${planetName}`).send(clientIP);

        expect(response.status).to.eql(200);
        expect(response.text).to.eql('Vote enlevé avec succès !');
    });

    it('POST /unvote/:name should return status code 500 when IP is not provided', async () => {
        // Définir le nom de la planète sans adresse IP
        const planetName = 'Tatooine';

        // Envoie une requête POST à la route /unvote/:name sans l'adresse IP
        const response = await requestWithSupertest.post(`/unvote/${planetName}`);
        expect(response.status).to.eql(500);
        expect(response.text).to.eql('Erreur lors de la récupération de l ip');
    });

    it('POST /getvote/:name should return status code 500 when IP is not provided', async () => {
        // Définir le nom de la planète sans adresse IP
        const planetName = 'Tatooine';

        // Envoie une requête POST à la route /unvote/:name sans l'adresse IP
        const response = await requestWithSupertest.post(`/unvote/${planetName}`);
        expect(response.status).to.eql(500);
        expect(response.text).to.eql('Erreur lors de la récupération de l ip');
    });

    it('GET /getvote/:name should return status code 200 and the count of votes for the planet', async () => {
        const planetName = 'Tatooine';

        // Envoyer une requête GET à la route /getvote/:name avec le nom de la planète
        const response = await requestWithSupertest.get(`/getvote/${planetName}`);

        // Vérifier que la réponse a le statut 200
        expect(response.status).to.eql(200);

        // Vérifier que la réponse contient le nombre de votes pour la planète
        expect(response.body).to.have.property('count');
    });

    it('GET /getvote/:name should return status code 500 on error', async () => {
        // Envoyer une requête GET à la route /getvote/:name avec un nom de planète inexistant
        const response = await requestWithSupertest.get('/getvote/popopopo');

        expect(response.status).to.eql(200);
        expect(response.body).to.have.property('count');
        expect(response.body.count).to.eql(0);
    });

    it('POST /allvote should return status code 200 and an array of votes for a valid IP address', async () => {
        // IP adress valide pour le test
        const ipAddress = '192.168.0.1';

        // Envoyer une requête POST à la route /allvote avec une adresse IP valide
        const response = await requestWithSupertest.post('/allvote').send({ ip: ipAddress });

        // Vérifier que la réponse a un statut 200
        expect(response.status).to.eql(200);

        // Vérifier que la réponse est un tableau d'objets de votes
        expect(response.body).to.be.an('array');

        // Ajoutez plus de vérifications selon le format des données de vote retournées si nécessaire
    });

    it('POST /allvote should return status code 500 for invalid or missing IP address', async () => {
        // IP adress invalide pour le test
        const invalidIpAddress = '';

        // Envoyer une requête POST à la route /allvote avec une adresse IP invalide
        const response = await requestWithSupertest.post('/allvote').send({ ip: invalidIpAddress });

        // Vérifier que la réponse a un statut 500
        expect(response.status).to.eql(500);
    });

    it("POST /planet/:name should return status code 200 when uploading a new image", async () => {
        const planetData1 = { name: 'BabyShark', type: 'Original' };
        const newPlanet1 = new Planet(planetData1);
    
        // Ajouter la planète avec la clé correcte
        const createPlanetResponse = await requestWithSupertest.post("/planet").send(newPlanet1);
        expect(createPlanetResponse.status).to.eql(200);
    
        const planetName = 'BabyShark';
        const imagePath ="test/planet.png"
        fs.readFile(imagePath, 'binary', async (err, data) => {
            expect(err).to.be.eql(null);
            
            // Le contenu du fichier est stocké dans la variable "fileContent"
            const fileContent = data;
            const response = await requestWithSupertest.post(`/planet/${planetName}`)
                .send(fileContent);

            expect(response.status).to.eql(200);
            expect(response.text).to.eql('Fichier téléchargé avec succès !');
            
          });

        
    });

    it("POST /planet/:name should return status code 400 when uploading an existing image", async () => {
        const planetName = 'Tatooine';

        const imagePath ="test/planet.png"
        fs.readFile(imagePath, 'binary', async (err, data) => {
            expect(err).to.be.eql(null);
            
            // Le contenu du fichier est stocké dans la variable "fileContent"
            const fileContent = data;
            const response = await requestWithSupertest.post(`/planet/${planetName}`)
                .send(fileContent);

            expect(response.status).to.eql(400);
            
          });
    });

});