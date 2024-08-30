<!-- ```markdown -->

# WebAdminISP Backend

## Descripción

Este repositorio contiene el código y los recursos relacionados con la lógica del servidor, <br>
la gestión de la base de datos, y las APIs de la aplicación WebAdminISP. <br>
La aplicación está construida utilizando NestJS.

## Tecnologías Utilizadas

- NestJS
- PostgreSQL
- TypeORM
- Swagger (para documentación de API)
- Otros paquetes y librerías relevantes

## Configuración del Entorno

### Requisitos

- Node.js (versión 20.x o superior)
- npm o yarn
- PostgreSQL

### Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/WebAdminISP/backend.git
   cd backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   # o
   yarn install
   ```

3. Crea un archivo .env en la raíz del proyecto con las siguientes variables de entorno:

   ```bash
   DATABASE_URL=postgres://user:password@localhost:5432/mydatabase
   JWT_SECRET=your_jwt_secret
   ...
   ...
   # etc..
   ```

4. Ejecuta las migraciones de la base de datos:

   ```bash
   npm run typeorm migration:run
   # o
   yarn typeorm migration:run
   ```

5. Inicia la aplicación:

   ```bash
   npm run start:dev
   # o
   yarn start:dev
   ```

### Scripts Disponibles

- **npm run start:dev:** Inicia la aplicación en modo de desarrollo.
- **npm run build:** Construye la aplicación para producción.
- **npm run start:** Inicia la aplicación en modo de producción.
- **npm run lint:** Ejecuta el linter para revisar el código.
- **npm run test:** Ejecuta las pruebas unitarias.
- **migration:run:** Ejecuta una migración.
- **migration:generate:** Genera la migración.
- **migration:create:** Crea una nueva migración.
- **migration:revert:** Revierte la ultima migración.
- **migration:show:** Muestra las migraciones.

### Documentación de la API

- La documentación de la API está disponible en http://localhost:3000/api cuando la aplicación está en ejecución.

<br>

### Comenzar a trabajar

1. Crea una nueva rama para tu funcionalidad o corrección de errores:

   ```bash
   git checkout -b feature/nombre # O nombre de la nueva funcionalidad
   ```

2. Realiza tus cambios y haz commit:

   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   ```

3. Envía tus cambios a la rama remota:

   ```bash
   git push origin feature/nombre # O nombre de la nueva funcionalidad
   ```

4. Abre un Pull Request en GitHub.

---

### <font color='lime'><p align="center">Integrantes del equipo frontend.</p></font>

<p align="center">Edmundo Kinast - <b>Back End</b></p>
<p align="center">Rodrigo Nahuel Fernandez - <b>Back End</b></p>
<p align="center">Rafael Velazquez Hernandez - <b>Back End</b></p>
