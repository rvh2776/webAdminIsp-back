FROM node:20

#? Instalar postgresql-client, para poder verificar si levantó la base de datos, para despues ejecutar las migraciones antes de levantar la app.
# RUN apt-get update && apt-get install -y postgresql-client

#? Instala netcat, para poder verificar si levantó la base de datos, para despues ejecutar las migraciones antes de levantar la app.
# RUN apt-get update && apt-get install -y netcat-traditional docker docker-compose

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]