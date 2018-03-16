# Craft v3

## Installation
```
git clone https://github.com/kevinbpalmer/craft-docker-gulp.git
cd craft-docker-gulp
docker-compose up -d --build
docker exec -it craft bash
npm install
npm install -g gulp
gulp serve
```

Visit either `http://localhost/` or `http://localhost:3000/` (browserSync)
