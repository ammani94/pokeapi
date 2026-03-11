# backend/Dockerfile
# Utilise une image multi-architecture pour Apple Silicon et Intel
FROM --platform=linux/amd64 node:22-alpine

WORKDIR /app

# Copie d'abord package.json et package-lock.json pour tirer parti du cache
COPY package*.json ./
# Installe les dépendances (y compris devDependencies pour le développement)
RUN npm install

# Copie le reste de l'application
COPY . .

# Utilise nodemon en développement, node en production
CMD ["npm", "run", "dev"]
