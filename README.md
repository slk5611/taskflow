# Taskflow - Asynchronous Task Processing System

A production-ready, full-stack application for managing and processing tasks asynchronously using Node.js, Angular, Redis, and BullMQ. This system demonstrates modern architecture patterns for handling long-running operations in a scalable manner.

## 🎯 Project Overview

Taskflow allows users to:

- **Create tasks** with custom names and descriptions via a REST API or web interface
- **Track task status** in real-time with progress updates (pending → processing → completed/failed)
- **Process tasks asynchronously** using Redis-backed BullMQ queue
- **View live updates** through a modern Angular dashboard with polling
- **Manage failures** with automatic retry mechanisms

## ✨ Key Features

✅ **Asynchronous Task Processing** - Long-running tasks don't block the API  
✅ **Redis-Backed Queue** - BullMQ for robust job management  
✅ **Real-time Status Updates** - Angular dashboard polls for task updates every 2 seconds  
✅ **Automatic Retries** - Failed tasks retry up to 3 times with exponential backoff  
✅ **Containerized Deployment** - Complete Docker setup with docker-compose  
✅ **Production-Ready** - Error handling, logging, and graceful shutdown  

## 🛠️ Tech Stack

### Backend
- Node.js 18 (TypeScript)
- Express.js REST API
- BullMQ + Redis async queue
- Production-ready error handling

### Frontend
- Angular 17 (TypeScript)
- RxJS Observables for networking
- Responsive CSS3 design

### Infrastructure
- Docker containers
- docker-compose orchestration
- Redis 7 Alpine (for queue & state)
- Nginx (frontend server)

## 📚 Project Structure

```
taskflow/
├── backend/                          # Node.js Backend
│   ├── src/
│   │   ├── server.ts                # Express server
│   │   ├── redis.ts                 # Redis client
│   │   ├── index.ts                 # Routes
│   │   ├── controllers/             # Request handlers
│   │   ├── services/                # Business logic
│   │   ├── queues/                  # BullMQ queue
│   │   ├── workers/                 # Job processor
│   │   └── middleware/              # Global middleware
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                         # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── services/            # API services
│   │   │   ├── models/              # Interfaces
│   │   │   └── components/          # UI components
│   │   ├── index.html
│   │   └── main.ts
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml               # Full stack
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker (v20.10+)
- docker-compose (v1.29+)

### Run Application

```bash
cd taskflow
docker-compose up --build
```

### Access

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### Stop

```bash
docker-compose down
```

## 📡 API Documentation

### Create Task
```bash
POST /tasks
Content-Type: application/json

{
  "name": "Task Name",
  "description": "Task description"
}
```

### List Tasks
```bash
GET /tasks
```

### Get Task Details
```bash
GET /tasks/{taskId}
```

### Health Check
```bash
GET /health
```

## 🎨 Features

### Task Lifecycle
1. **pending** - Task created, waiting for processing
2. **processing** - Worker actively processing (shows progress)
3. **completed** - Task finished with results
4. **failed** - Task failed after 3 retries

### Frontend
- Task creation form with validation
- Real-time task list with status badges
- Progress bars during processing
- Task details display on completion
- API connection status indicator

### Backend
- Express REST API
- BullMQ job queue management
- Redis state persistence
- Automatic failure retry with backoff
- Request logging and error handling

### Worker
- Dequeues jobs from Redis
- Simulates async processing (10 seconds)
- Updates task status and progress
- Handles errors with retries

## 🧪 Testing

1. Open http://localhost:4200
2. Fill task form (name: min 3 chars, description: min 10 chars)
3. Click "Create Task"
4. Watch progress bar update in real-time
5. See completed task results

## 🔧 Configuration

### Backend Environment (.env)
```
NODE_ENV=production
PORT=3000
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
CORS_ORIGIN=http://localhost:4200
```

### Frontend
- API URL: http://localhost:3000
- Poll Interval: 2 seconds

## 🐛 Troubleshooting

**Frontend shows "API offline"**
- Wait 10-15 seconds for backend to start
- Check: `curl http://localhost:3000/health`

**Tasks not processing**
- View worker logs: `docker-compose logs worker`
- Check: "✓ Task worker started"

**Port already in use**
- Change ports in docker-compose.yml

## 📊 Performance

- Task Creation: < 100ms
- Task Processing: ~10 seconds (simulated)
- Status Polling: 2 second interval
- Worker Concurrency: 2 (configurable)
- Retry Attempts: 3 with exponential backoff

## ✅ What's Included

- ✅ Node.js backend with TypeScript
- ✅ Express.js REST API
- ✅ BullMQ + Redis for async processing
- ✅ Background task worker
- ✅ Angular frontend with TypeScript
- ✅ RxJS observables and polling
- ✅ Task status tracking
- ✅ Docker containerization
- ✅ docker-compose orchestration
- ✅ Production-ready error handling
- ✅ Full working code (no pseudocode)

## 🚀 Next Steps

1. Start the system: `docker-compose up --build`
2. Open http://localhost:4200
3. Create tasks and watch them process
4. Explore the code to understand architecture
5. Extend with your own task types

## 📚 Key Concepts

- **Async Processing**: Decoupling requests from job execution
- **Message Queues**: Reliable task delivery via Redis
- **State Management**: Tracking progress in real-time
- **Polling Pattern**: Frontend updates via periodic API calls
- **Containerization**: Full stack in Docker
- **Error Handling**: Retries with backoff and user feedback

---

**Built with ❤️ for async task processing!**

## 🗄️ Database Configuration

### MongoDB (Task Persistence)
- **Database Name**: `taskflow`
- **Collections**: `tasks`
- **Purpose**: Stores task data, progress, results, and state
- **Connection**: `mongodb://mongo:27017/taskflow` (Docker)
- **Persistence**: Volume `mongo_data` for data durability

### Redis (Queue & Caching)
- **Purpose**: BullMQ task queue and job processing
- **Connection**: `redis://redis:6379`
- **Persistence**: AOF (Append Only File) enabled
- **Expiration**: Queue jobs managed by BullMQ

## 📊 Data Models

### Task Document (MongoDB)
```json
{
  "_id": "MongoDB ObjectId",
  "id": "UUID (unique task identifier)",
  "name": "string (task name)",
  "description": "string (task description)",
  "status": "pending | processing | completed | failed",
  "progress": "0-100 (percentage)",
  "result": "object (processing results)",
  "error": "string (error message if failed)",
  "retries": "number (retry count)",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

## 🔄 Architecture with MongoDB

```
Frontend (Angular)
      ↓
   HTTP API
      ↓
Backend (Express)
      ↓
   ┌──────┬──────┐
   ↓      ↓
MongoDB  Redis
 (Task   (BullMQ
Persist) Queue)
   ↓
Worker (Async Processing)
```

- **MongoDB** stores permanent task records
- **Redis** manages job queue via BullMQ
- **Worker** processes jobs and updates MongoDB

---
