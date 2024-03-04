
import {planeteDao } from "./PlaneteDAO.mjs"
import {createdPlaneteDao,Planet } from "./CreatedPlanetDAO.mjs"

createdPlaneteDao.delete() //Réinitialise la bd

// console.log(await planeteDao.findPlanetByNom("tatooine"))
// console.log(await planeteDao.findPlanets())
let planet = new Planet({name:'Marroon',rotation_period:"12",orbital_period:"365",diameter:"150000",climate:"Arid",gravity:"1.2",terrain:"dessert",surface_water:"25",population:"120000",type:"En attente"})
console.log(await createdPlaneteDao.addPlanete(planet))
console.log(await createdPlaneteDao.findPlanets())



