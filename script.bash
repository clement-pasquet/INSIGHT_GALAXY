#!/bin/bash

echo -e "\e[34m Installation des dépendances \e[0m"

# Installation des dépendances dans Web et API
cd Web/
npm install
echo "Dépendances Web installées"

cd ../API/
npm install
echo "Dépendances API installées"

echo -e "\e[34m Exécution des programmes \e[0m"



echo "Démarrage du serveur API..."
nohup npm start >/dev/null 2>&1 &

# Attente pour assurer que le serveur API a démarré
sleep 5

# Changement de répertoire vers Web pour démarrer le serveur Web
cd ../Web/

# Démarrage du serveur Web en arrière-plan avec nohup
echo "Démarrage du serveur Web..."
nohup npm run dev >/dev/null 2>&1 &

echo "Serveurs démarrés"