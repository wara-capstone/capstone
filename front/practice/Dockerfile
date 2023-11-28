FROM nginx:latest

COPY practice/front/build /usr/share/nginx/html
COPY practice/front/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
