
import {planeteDao } from "./PlaneteDAO.mjs"

console.log(await planeteDao.findPlanetByNom("Mars"))