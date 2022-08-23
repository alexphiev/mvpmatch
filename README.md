## Setup for PpostgreSQL DB and NodeJS server
    docker-compose build
    docker-compose up

## ReactJS client
Add .env file in /client with 
    REACT_APP_API_URL=http://localhost:8000

Tehn run the following commands:
    cd client
    npm install
    npm start

## Server
Find the Swagger at http://localhost:8000/docs/


## Optional: Manual config for reference

### NodeJS

With docker
    docker build . -t mvpmatch_server
    docker run -it -p 8000:8000 mvpmatch_server

Without docker
    npm install
    npm run build
    npm run dev

### PostgreSQL

Connect to the database:
* Make sure the container is up
* Run the following command
    docker exec -it mvpmatch_db_1 psql -U postgres postgres

Get the users:
    select * from "user";
    