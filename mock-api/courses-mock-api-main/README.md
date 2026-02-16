# Courses Mock API

Mock API Server สำหรับระบบคอร์สเรียน

## ไฟล์ในโฟลเดอร์

```
mock-api/
├── package.json    # Dependencies
├── server.js       # API Server
├── db.json         # ข้อมูล Mock
└── README.md       # คู่มือ
```

## วิธีใช้งาน

```bash
cd mock-api
npm install
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | ดึงคอร์สทั้งหมด |
| GET | `/courses/:id` | ดึงคอร์สตาม ID |
| GET | `/categories` | ดึงหมวดหมู่ทั้งหมด |
| GET | `/categories/:category/courses` | ดึงคอร์สตามหมวดหมู่ |

## ตัวอย่างการเรียกใช้

```bash
# ดึงคอร์สทั้งหมด
curl http://localhost:3005/courses

# ดึงคอร์ส ID 1
curl http://localhost:3005/courses/1

# ดึงหมวดหมู่
curl http://localhost:3005/categories

# ดึงคอร์สในหมวด Programming
curl http://localhost:3005/categories/Programming/courses
```

## Port

Server รันบน **port 3005**
