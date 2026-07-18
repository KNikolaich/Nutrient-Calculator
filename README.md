# Калькулятор питания

Приложение работает полностью в браузере. Данные хранятся в cookies.  
Бэкенд и база данных не нужны.

---

## Разработка

### 1. Node.js 24

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. pnpm

```bash
npm install -g pnpm@10
```

### 3. Получить код

```bash
git clone <ваш-репозиторий> nutrition-app
cd nutrition-app
```

### 4. Установить зависимости

```bash
pnpm install
```

### 5. Запустить

```bash
cd artifacts/nutrition-calc

export PORT=3000
export BASE_PATH=/

pnpm dev
```

Откройте `http://localhost:3000`

---

## Продакшн

### 1. Собрать

```bash
cd nutrition-app/artifacts/nutrition-calc

export PORT=80
export BASE_PATH=/

pnpm build
```

Готовая статика появится в папке `artifacts/nutrition-calc/dist/public/`.

### 2. Установить nginx

```bash
sudo apt-get install -y nginx
sudo nano /etc/nginx/sites-available/nutrition
```

Вставьте (путь замените на свой):

```nginx
server {
    listen 80;
    server_name ваш-домен.ru;

    root /home/ubuntu/nutrition-app/artifacts/nutrition-calc/dist/public;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/nutrition /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Готово. Сайт доступен на вашем домене или IP.

### Обновление

```bash
cd nutrition-app
git pull
pnpm install

cd artifacts/nutrition-calc
export PORT=80
export BASE_PATH=/
pnpm build
```

nginx перезапускать не нужно — он сам подхватит новые файлы.

---

## Песочница компонентов (опционально)

Инструмент для прототипирования UI в изоляции от основного приложения.  
Нужен только при разработке новых компонентов.

```bash
cd nutrition-app/artifacts/mockup-sandbox

export PORT=8081
export BASE_PATH=/__mockup

pnpm dev
```

Откройте `http://localhost:8081/__mockup`.

**Как создать новый прототип:**

1. Создайте файл в `artifacts/mockup-sandbox/src/components/mockups/MyComponent.tsx`
2. Экспортируйте React-компонент как `default`
3. Откройте `http://localhost:8081/__mockup/preview/MyComponent`

Файлы с именем, начинающимся на `_`, автоматически скрыты — используйте их для вспомогательного кода.
