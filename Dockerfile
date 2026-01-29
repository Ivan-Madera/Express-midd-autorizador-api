# Etapa de construcción
FROM node:20-alpine3.19 AS build

# Establece el directorio de trabajo
WORKDIR /usr/src

# Copia los archivos de dependencias y luego el código
COPY package*.json ./

# Instala dependencias de producción y desarrollo para el build
RUN npm install -g npm@10.9.0 && npm ci

# Copia el resto del código fuente al contenedor
COPY . .

# Compila la aplicación
RUN npm run build

# Elimina dependencias de desarrollo después de compilar
RUN npm prune --production

# Etapa final
FROM node:lts-alpine3.19

# Configuración de zona horaria y directorio para logs
RUN apk add -U tzdata dumb-init && \
    mkdir -p /var/log/containers/ && \
    chown -R node:node /var/log/containers/ && \
    cp /usr/share/zoneinfo/America/Mexico_City /etc/localtime

ENV TZ=America/Mexico_City
ENV NODE_ENV=production

# Ejecuta la aplicación como usuario node para mayor seguridad
USER node

# Establece el directorio de trabajo
WORKDIR /usr/src

# Copia las dependencias de producción y los archivos de build desde la etapa de construcción
COPY --from=build /usr/src ./
COPY --from=build /usr/src/node_modules ./node_modules
COPY --from=build /usr/src/build ./build

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando de inicio
CMD ["dumb-init", "npm", "start"]
