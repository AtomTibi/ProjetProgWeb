# # Définir l'image de base
# FROM node:14

# # Créer le répertoire de travail dans le conteneur
# WORKDIR /app

# # Copier les fichiers package.json et package-lock.json dans le répertoire de travail
# COPY package*.json ./

# # Installer les dépendances
# RUN npm install

# # Copier le reste des fichiers du projet dans le répertoire de travail
# COPY . .

# # Exposer le port que votre application utilise
# EXPOSE 3000

# # Définir la commande pour démarrer votre application
# CMD ["node", "app.js"]


FROM postgres:14

COPY ./node_modules ./node_modules

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "start"]
