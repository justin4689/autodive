FROM php:8.4-fpm

# Dépendances système + extensions PHP
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    ca-certificates \
    gnupg \
    apt-transport-https \
    lsb-release \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Installation Node.js 22 + npm
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs

# Installation Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Dossier de travail
WORKDIR /var/www

# Copier les fichiers du projet
COPY . .

# Créer les dossiers requis par Laravel (ignorés par git)
RUN mkdir -p bootstrap/cache storage/framework/sessions storage/framework/views storage/framework/cache storage/logs

# Installer les dépendances Laravel
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Installer les dépendances frontend
RUN npm install

# Permissions Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Port PHP-FPM
EXPOSE 9000

# Démarrage PHP-FPM
CMD ["php-fpm"]