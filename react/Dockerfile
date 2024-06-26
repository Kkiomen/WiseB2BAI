# Buduj obraz z oficjalnego obrazu node
FROM node:16-alpine as build-stage

# Ustaw katalog /app jako miejsce pracy w kontenerze
WORKDIR /app

# Kopiuj package*.json do katalogu roboczego
COPY package*.json ./

# Zainstaluj zależności
RUN npm install

# Kopiuj pozostałe pliki do katalogu roboczego
COPY . .

# Zbuduj aplikację dla produkcji
RUN npm run build

# Nowa, 'czysta' faza - do uruchomienia aplikacji
FROM nginx:stable-alpine as production-stage

# Kopiuj zbudowane pliki do serwera nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Uruchom serwer nginx
CMD ["nginx", "-g", "daemon off;"]
