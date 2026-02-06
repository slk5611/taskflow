# 🚀 Taskflow – Async Task Processing Platform

**Taskflow** is a full-stack task management and asynchronous processing system designed to demonstrate modern backend–frontend architecture using **Node.js**, **Angular**, and **Redis**.

The application allows users to create tasks from a web interface, processes those tasks asynchronously using a Redis-backed queue, and updates task status in near real time. It’s ideal as a learning project, starter template, or foundation for more advanced workflow systems.

---

## 🧠 Key Features

- 📝 Create and manage tasks via a clean Angular UI  
- ⚙️ Asynchronous task execution using **Redis + BullMQ**  
- 📊 Task lifecycle tracking (`pending`, `processing`, `completed`, `failed`)  
- 🔄 Background worker processes  
- 🌐 RESTful API built with Node.js and TypeScript  
- 🐳 Fully Dockerized setup with `docker-compose`  
- 🔁 Retry and failure handling for background jobs  
- 📦 Modular, scalable project structure  

---

## 🏗️ Tech Stack

### Backend
- Node.js (TypeScript)
- Express / Fastify
- Redis
- BullMQ (task queue)
- Docker

### Frontend
- Angular
- RxJS
- Angular Material

---

## 📂 Architecture Overview

```text
taskflow/
├── backend/        # Node.js API + Redis queue + workers
├── frontend/       # Angular application
├── docker-compose.yml
└── README.md

▶️ Getting Started

git clone https://github.com/your-username/taskflow.git
cd taskflow
docker-compose up --build

Frontend: http://localhost:4200
Backend API: http://localhost:3000
