FROM serversideup/php:8.2-fpm-nginx

USER root

# Install dependencies & PHP Extensions (MySQL)
RUN apt-get update && apt-get install -y default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
