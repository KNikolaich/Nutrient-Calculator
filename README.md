# Калькулятор питания — установка на Ubuntu с нуля

## Требования

- Ubuntu 22.04 / 24.04
- Node.js 24
- pnpm 10
- PostgreSQL 15+

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

---

## 8. Запуск (три отдельных терминала)

### Терминал 1 — API-сервер

```bash
cd artifacts/api-server
DATABASE_URL=postgresql://appuser:yourpassword@localhost:5432/nutrition \
  SESSION_SECRET=ваш-секрет \
  PORT=8080 \
  pnpm dev
```

### Терминал 2 — Фронтенд (калькулятор питания)

```bash
cd artifacts/nutrition-calc
PORT=3000 BASE_PATH=/ pnpm dev
```

### Терминал 3 — Песочница компонентов (опционально)

```bash
cd artifacts/mockup-sandbox
PORT=8081 BASE_PATH=/__mockup pnpm dev
```

---

## 9. Открыть в браузере

| Сервис | Адрес |
|---|---|
| Калькулятор питания | http://localhost:3000 |
| API | http://localhost:8080 |
| Песочница (опц.) | http://localhost:8081/__mockup |

---

## Сборка для продакшна

```bash
# Собрать фронтенд
cd artifacts/nutrition-calc
PORT=3000 BASE_PATH=/ pnpm build
# Статика окажется в artifacts/nutrition-calc/dist/public

# Собрать API
cd artifacts/api-server
pnpm build
# Бинарь: artifacts/api-server/dist/index.mjs

# Запустить API в продакшне
DATABASE_URL=... SESSION_SECRET=... PORT=8080 NODE_ENV=production \
  node --enable-source-maps artifacts/api-server/dist/index.mjs
```

---

## Быстрый чеклист

- [ ] Node.js 24 установлен
- [ ] pnpm 10 установлен
- [ ] PostgreSQL запущен, база создана
- [ ] `pnpm install` выполнен в корне
- [ ] `.env` заполнен с реальными значениями
- [ ] Схема БД применена (`drizzle-kit push`)
- [ ] Все три сервиса запущены
