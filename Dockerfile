FROM nginx

LABEL name = "cloud-music"
LABEL version ="0.1.0"

COPY ./dist /usr/share/nginx/html
COPY ./cloud-music.conf  /etc/nginx/conf.d

EXPOSE 80
