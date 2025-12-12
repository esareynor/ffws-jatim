FROM serversideup/php:8.2-fpm-nginx

USER root

# Install dependencies & PHP Extensions (MySQL)
RUN apt-get update && apt-get install -y default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy application files
COPY --chown=webuser:webgroup . /var/www/html

# Switch to non-root user
USER webuser

# Install PHP dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev
