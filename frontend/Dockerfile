# frontend/Dockerfile (version simplifiée pour le développement)
FROM --platform=linux/amd64 node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Lance le serveur de développement Vite
EXPOSE 8080
CMD ["npm", "run", "dev"]
