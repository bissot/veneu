# venue-new

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Docker commands

Build containers: `docker-compose build`
Seed database: `docker-compose run --rm venue_server node seed.js`
Update docker npm dependencies for server or web: `docker-compose run --rm --no-deps <venue_server|venue_web> npm install`
Start docker: `docker-compose up`
Nuke everything: `docker-compose down -v`
