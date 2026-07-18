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

## Требования

- Ubuntu 22.04 / 24.04
- Node.js 24
- pnpm 10
- PostgreSQL 15+
- nginx (только для продакшна)

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

## 6. Переменные окружения

Создайте файл `.env` в корне проекта:

```bash
cat > .env << 'EOF'
DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition
SESSION_SECRET=замените-на-длинную-случайную-строку
EOF
```

Сгенерировать SESSION_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 7. Применить схему базы данных

```bash
cd lib/db
DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition \
  pnpm drizzle-kit push --config ./drizzle.config.ts
cd ../..
```

Команда создаёт все таблицы в базе данных. Запускать повторно при изменениях схемы.

---

## Режим разработки

Три сервиса, каждый в отдельном терминале.

### Терминал 1 — API-сервер

```bash
cd artifacts/api-server
DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition \
  SESSION_SECRET=ваш-секрет \
  PORT=8080 \
  pnpm dev
```

Сервер пересобирается (`esbuild`) и стартует при каждом запуске `pnpm dev`.  
Доступен на `http://localhost:8080`.

### Терминал 2 — Фронтенд

```bash
cd artifacts/nutrition-calc
PORT=3000 BASE_PATH=/ pnpm dev
```

Vite-сервер с горячей перезагрузкой (HMR).  
Доступен на `http://localhost:3000`.

### Терминал 3 — Песочница компонентов (опционально)

```bash
cd artifacts/mockup-sandbox
PORT=8081 BASE_PATH=/__mockup pnpm dev
```

Доступна на `http://localhost:8081/__mockup`.

---

## Песочница компонентов — подробнее

Песочница — это изолированная среда для прототипирования и дизайн-экспериментов. Она **не влияет на основное приложение** и не деплоится в продакшн.

### Как она работает

Песочница автоматически обнаруживает все `.tsx`-файлы в папке:

```
artifacts/mockup-sandbox/src/components/mockups/
```

Каждый файл — отдельный компонент, доступный по URL:

```
http://localhost:8081/__mockup/preview/<имя-файла-без-расширения>
```

### Создание нового прототипа

1. Создайте файл в папке `mockups`:

```bash
touch artifacts/mockup-sandbox/src/components/mockups/MyButton.tsx
```

2. Напишите компонент с дефолтным экспортом:

```tsx
export default function MyButton() {
  return <button className="bg-green-500 text-white px-4 py-2 rounded">Нажми меня</button>;
}
```

3. Откройте в браузере:

```
http://localhost:8081/__mockup/preview/MyButton
```

### Правила именования

- Файлы начинающиеся с `_` (например `_helpers.tsx`) — скрыты от автообнаружения, используются как вспомогательные модули.
- Вложенные папки поддерживаются: `mockups/forms/LoginForm.tsx` → URL `/preview/forms/LoginForm`.

### Когда использовать

- Экспериментировать с новым UI, не трогая основное приложение.
- Сравнивать несколько вариантов дизайна рядом (открыть несколько вкладок).
- Быстро проверить внешний вид компонента в изоляции от остального кода.

---

## Продакшн

### Шаг 1 — Собрать фронтенд

```bash
cd artifacts/nutrition-calc
PORT=80 BASE_PATH=/ pnpm build
```

Статика появится в `artifacts/nutrition-calc/dist/public/`.

> `PORT` и `BASE_PATH` нужны только на этапе сборки для правильной конфигурации Vite.  
> Сам сервер статики — nginx, Node.js к фронтенду в продакшне не нужен.

### Шаг 2 — Собрать API-сервер

```bash
cd artifacts/api-server
pnpm build
```

Бандл появится в `artifacts/api-server/dist/index.mjs`.

### Шаг 3 — Установить и настроить nginx

```bash
sudo apt-get install -y nginx
```

Создайте конфиг `/etc/nginx/sites-available/nutrition`:

```nginx
server {
    listen 80;
    server_name ваш-домен.ru;  # или IP-адрес сервера

    # Статика фронтенда
    root /home/ubuntu/nutrition-app/artifacts/nutrition-calc/dist/public;
    index index.html;

    # SPA — все незнакомые пути отдаём index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Проксирование запросов к API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/nutrition /etc/nginx/sites-enabled/
sudo nginx -t          # проверить конфиг
sudo systemctl reload nginx
```

### Шаг 4 — Запустить API как системный сервис (systemd)

Создайте файл `/etc/systemd/system/nutrition-api.service`:

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

```bash
sudo systemctl daemon-reload
sudo systemctl enable nutrition-api    # автозапуск при старте сервера
sudo systemctl start nutrition-api
sudo systemctl status nutrition-api    # убедиться, что работает
```

Смотреть логи в реальном времени:

```bash
sudo journalctl -u nutrition-api -f
```

### Шаг 5 — Применить схему БД (один раз, или при обновлениях)

```bash
cd /home/ubuntu/nutrition-app/lib/db
DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition \
  pnpm drizzle-kit push --config ./drizzle.config.ts
```

### Итоговая проверка

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
PORT=80 BASE_PATH=/ pnpm build

# Пересобрать и перезапустить API
cd ../api-server
pnpm build
sudo systemctl restart nutrition-api

# Если изменилась схема БД
cd ../../lib/db
DATABASE_URL=... pnpm drizzle-kit push --config ./drizzle.config.ts
```

---

## Быстрый чеклист

### Разработка
- [ ] Node.js 24 установлен
- [ ] pnpm 10 установлен
- [ ] PostgreSQL запущен, база создана
- [ ] `pnpm install` выполнен в корне
- [ ] `.env` заполнен с реальными значениями
- [ ] Схема БД применена (`drizzle-kit push`)
- [ ] Все три сервиса запущены в отдельных терминалах

### Продакшн
- [ ] Фронтенд собран (`pnpm build` в `artifacts/nutrition-calc`)
- [ ] API собран (`pnpm build` в `artifacts/api-server`)
- [ ] nginx установлен и настроен
- [ ] systemd-сервис создан и запущен
- [ ] Схема БД применена
- [ ] `curl` на `/api/healthz` возвращает 200
