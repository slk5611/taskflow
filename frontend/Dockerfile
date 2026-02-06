FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install -g @angular/cli && npm install

# Copy angular config and source
COPY angular.json tsconfig*.json ./
COPY src ./src

# Build Angular app
RUN npm run build

# Nginx serve
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/dist/taskflow-frontend /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
