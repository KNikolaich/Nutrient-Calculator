# Калькулятор питания — установка на Ubuntu с нуля

## Архитектура

```
nutrition-app/
├── artifacts/
│   ├── nutrition-calc/   — фронтенд (React + Vite)
│   ├── api-server/       — бэкенд (Express + Drizzle ORM)
│   └── mockup-sandbox/   — среда прототипирования UI (только разработка)
└── lib/
    └── db/               — схема PostgreSQL (Drizzle)
```

**В продакшне нужны два процесса:** статика фронтенда (nginx) + API-сервер (Node.js).  
**Песочница** — только для разработки, в продакшн не деплоится.

---

## 1. Node.js 24

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version   # v24.x.x
```

---

## 2. pnpm

```bash
npm install -g pnpm@10
pnpm --version   # 10.x.x
```

---

## 3. PostgreSQL

```bash
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создать пользователя и базу
sudo -u postgres psql -c "CREATE USER appuser WITH PASSWORD 'yourpassword';"
sudo -u postgres psql -c "CREATE DATABASE nutrition OWNER appuser;"
```

---

## 4. Получить код

```bash
git clone <ваш-репозиторий> nutrition-app
cd nutrition-app
```

---

## 5. Установить зависимости

```bash
pnpm install
```

---

## 6. Файл с переменными окружения

Создайте файл `.env` в корне проекта. В нём хранятся настройки, которые нужны всем сервисам.

```bash
nano .env
```

Вставьте и заполните своими значениями:

```
DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition
SESSION_SECRET=сюда-вставьте-случайную-строку
```

Сгенерировать SESSION_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Скопируйте результат и вставьте в `.env` вместо `сюда-вставьте-случайную-строку`.

---

## 7. Применить схему базы данных

```bash
cd lib/db

export DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition
pnpm drizzle-kit push --config ./drizzle.config.ts

cd ../..
```

> `export` — это команда терминала, которая задаёт переменную для текущей сессии.  
> После неё просто запускаете нужную команду как обычно.  
> Команду `drizzle-kit push` повторяйте каждый раз, когда меняется схема БД.

---

## Режим разработки

Откройте **три отдельных окна терминала**. В каждом свой сервис.

---

### Терминал 1 — API-сервер

```bash
cd nutrition-app/artifacts/api-server

export DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition
export SESSION_SECRET=ваш-секрет-из-env-файла
export PORT=8080

pnpm dev
```

Сервер запустится на `http://localhost:8080`.  
Оставьте терминал открытым — закроете его, сервер остановится.

---

### Терминал 2 — Фронтенд

```bash
cd nutrition-app/artifacts/nutrition-calc

export PORT=3000
export BASE_PATH=/

pnpm dev
```

Приложение откроется на `http://localhost:3000`.

---

### Терминал 3 — Песочница компонентов (опционально)

```bash
cd nutrition-app/artifacts/mockup-sandbox

export PORT=8081
export BASE_PATH=/__mockup

pnpm dev
```

Доступна на `http://localhost:8081/__mockup`.

> Песочница нужна только если вы занимаетесь разработкой UI.  
> Для обычного использования приложения её запускать не нужно.

---

## Чтобы не вводить export каждый раз

Добавьте переменные в файл `~/.bashrc`, тогда они будут загружаться автоматически при каждом открытии терминала:

```bash
nano ~/.bashrc
```

Добавьте в конец файла:

```bash
export DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition
export SESSION_SECRET=ваш-секрет
```

Примените изменения:

```bash
source ~/.bashrc
```

После этого `export` перед командами писать не нужно — переменные уже в окружении.

---

## Песочница компонентов — подробнее

Песочница — изолированная среда для прототипирования UI. Не влияет на основное приложение.

### Как работает

Автоматически обнаруживает все `.tsx`-файлы в папке:

```
artifacts/mockup-sandbox/src/components/mockups/
```

Каждый файл — отдельный компонент, доступный по URL:

```
http://localhost:8081/__mockup/preview/<имя-файла-без-расширения>
```

### Создание нового прототипа

1. Создайте файл:

```bash
touch artifacts/mockup-sandbox/src/components/mockups/MyButton.tsx
```

2. Напишите компонент:

```tsx
export default function MyButton() {
  return (
    <button className="bg-green-500 text-white px-4 py-2 rounded">
      Нажми меня
    </button>
  );
}
```

3. Откройте в браузере:

```
http://localhost:8081/__mockup/preview/MyButton
```

Файлы с `_` в начале имени (например `_helpers.tsx`) скрыты от автообнаружения — используются как вспомогательные модули.

---

## Продакшн

### Шаг 1 — Собрать фронтенд

```bash
cd nutrition-app/artifacts/nutrition-calc

export PORT=80
export BASE_PATH=/

pnpm build
```

Статика появится в `artifacts/nutrition-calc/dist/public/`.  
После сборки Node.js для фронтенда больше не нужен — его будет отдавать nginx.

---

### Шаг 2 — Собрать API-сервер

```bash
cd nutrition-app/artifacts/api-server
pnpm build
cd ../..
```

Готовый файл: `artifacts/api-server/dist/index.mjs`.  
После сборки вернитесь в корень проекта (`cd ../..`) — все дальнейшие команды запускаются оттуда.

---

### Шаг 3 — Установить nginx

```bash
sudo apt-get install -y nginx
```

Создайте конфиг:

```bash
sudo nano /etc/nginx/sites-available/nutrition
```

Вставьте (замените путь и домен на свои):

```nginx
server {
    listen 80;
    server_name ваш-домен.ru;

    # Папка со статикой фронтенда
    root /home/ubuntu/nutrition-app/artifacts/nutrition-calc/dist/public;
    index index.html;

    # SPA: неизвестные пути отдаём index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Запросы к /api/ уходят на Node.js-сервер
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/nutrition /etc/nginx/sites-enabled/
sudo nginx -t          # проверить конфиг на ошибки
sudo systemctl reload nginx
```

---

### Шаг 4 — Запустить API как системный сервис

Чтобы API запускался автоматически при старте сервера и не требовал открытого терминала, настройте systemd.

Создайте файл сервиса:

```bash
sudo nano /etc/systemd/system/nutrition-api.service
```

Вставьте (замените пути, пароли и секрет на свои):

```ini
[Unit]
Description=Nutrition Calculator API
After=network.target postgresql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/nutrition-app

ExecStart=node --enable-source-maps artifacts/api-server/dist/index.mjs
Restart=on-failure
RestartSec=5

Environment=NODE_ENV=production
Environment=PORT=8080
Environment=DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition
Environment=SESSION_SECRET=ваш-секрет

[Install]
WantedBy=multi-user.target
```

> Здесь переменные окружения задаются прямо в файле сервиса через строки `Environment=`.  
> Открытый терминал для работы сервиса не нужен — systemd управляет процессом.

```bash
sudo systemctl daemon-reload
sudo systemctl enable nutrition-api    # автозапуск при старте сервера
sudo systemctl start nutrition-api
sudo systemctl status nutrition-api    # проверить что работает
```

Логи API в реальном времени:

```bash
sudo journalctl -u nutrition-api -f
```

---

### Шаг 5 — Применить схему БД

```bash
cd /home/ubuntu/nutrition-app/lib/db

export DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition
pnpm drizzle-kit push --config ./drizzle.config.ts
```

---

### Проверка

```bash
curl http://localhost:8080/api/healthz   # API отвечает
curl -I http://localhost                 # nginx отдаёт фронтенд
```

---

## Обновление приложения

```bash
cd /home/ubuntu/nutrition-app
git pull
pnpm install                            # если изменились зависимости

# Пересобрать фронтенд
cd artifacts/nutrition-calc
export PORT=80
export BASE_PATH=/
pnpm build

# Пересобрать и перезапустить API
cd ../api-server
pnpm build
sudo systemctl restart nutrition-api

# Если изменилась схема БД
cd ../../lib/db
export DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition
pnpm drizzle-kit push --config ./drizzle.config.ts
```

---

## Чеклист

### Разработка
- [ ] Node.js 24 и pnpm 10 установлены
- [ ] PostgreSQL запущен, база создана
- [ ] `pnpm install` выполнен в корне
- [ ] `.env` заполнен
- [ ] Схема БД применена
- [ ] Три терминала открыты, каждый сервис запущен

### Продакшн
- [ ] Фронтенд собран (`pnpm build`)
- [ ] API собран (`pnpm build`)
- [ ] nginx установлен, конфиг создан, `nginx -t` прошёл без ошибок
- [ ] systemd-сервис создан, включён (`enable`) и запущен (`start`)
- [ ] Схема БД применена
- [ ] `curl /api/healthz` возвращает 200
