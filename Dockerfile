# Stage 1 - build the application
FROM node:24-alpine AS build
WORKDIR /app

# Kopiujemy pliki zależności osobno, aby wykorzystać cache Dockera [4]
COPY package*.json ./
RUN npm ci

# Kopiujemy resztę kodu i budujemy aplikację
COPY . .
RUN npm run build -- --configuration=production

# Etap 2: Serwowanie aplikacji przez Nginx (Runtime Stage) [5]
FROM nginx:alpine

# Usuwamy domyślną konfigurację i kopiujemy naszą [5]
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Kopiujemy skompilowaną aplikację z pierwszego etapu [6]
# UWAGA: W nowszych wersjach Angulara ścieżka to często dist/[nazwa-projektu]/browser
COPY --from=build /app/dist/AuthManager/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]