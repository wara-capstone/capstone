# 빌드 스테이지
FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
ENV NODE_OPTIONS=--max-old-space-size=8192
COPY . .
RUN npm run build

# 런타임 스테이지
FROM nginx:latest
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

