# Koristi Node.js kao osnovnu sliku
FROM node:20.11.1

# Postavi radni direktorijum u kontejneru
WORKDIR /app

# Kopiraj package.json i package-lock.json (ako postoje)
COPY package*.json ./
# Instaliraj zavisnosti
RUN npm install

# Kopiraj sav kod u radni direktorijum
COPY . .

# Otvori port 5173 za frontend (ako koristiš ovaj port za hot-reload)
EXPOSE 5173

ENV HOST=0.0.0.0
# Pokreni aplikaciju sa hot-reloadom
CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0"]
