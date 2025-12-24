 FROM php:8.2-fpm

# Install Dependencies (Termasuk Nginx & Supervisor)
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip libicu-dev nginx supervisor \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Config PHP Extensions
RUN docker-php-ext-configure intl && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd intl

# SETUP NGINX (FIX WELCOME TO NGINX)
# Hapus semua config default bawaan image
RUN rm -rf /etc/nginx/sites-enabled/* && rm -rf /etc/nginx/conf.d/*
# Copy config Laravel kita ke folder conf.d
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# Copy config Supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Setup Laravel
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www
COPY . .

# Build
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts
RUN npm install && npm run build

# Permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Start Supervisor (Menjalankan Nginx & PHP-FPM)
EXPOSE 80
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]