# Wizzybox VMS — Backend (Spring Boot)

## Tech Stack
- **Java 21**
- **Spring Boot 3.2.5**
- **MySQL 8**
- **Spring Data JPA**
- **Spring Mail (SMTP)**
- **Lombok**

## Setup

### 1. Install MySQL
Make sure MySQL is running on `localhost:3306` with:
- Username: `root`
- Password: `root`

The database `vms_db` will be created automatically.

### 2. Configure Email (Optional)
Edit `src/main/resources/application.properties`:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### 3. Run the Backend
```bash
cd vms-backend
mvn clean install
mvn spring-boot:run
```

Server starts at **http://localhost:8080**

## API Endpoints

### Visitors
- `POST   /api/visitors/checkin` — Check in a visitor (multipart: visitor + photo)
- `GET    /api/visitors` — Get all visitors (optional `?status=WAITING`)
- `PATCH  /api/visitors/{id}/status` — Update visitor status
- `DELETE /api/visitors/{id}` — Delete visitor record
- `GET    /api/visitors/by-date?date=2026-04-17` — Get visitors by date
- `GET    /api/visitors/analytics` — Get stats (total, waiting, approved, exited)

### Feedback
- `POST   /api/feedback` — Submit feedback
- `GET    /api/feedback` — Get all feedback
- `DELETE /api/feedback/{id}` — Delete feedback
- `GET    /api/feedback/stats` — Get feedback stats (total, avgRating)

### Static Files
- `GET /uploads/{filename}` — Access uploaded visitor photos

## Database Schema

### `visitors` table
| Column        | Type         | Description                  |
|---------------|--------------|------------------------------|
| id            | BIGINT (PK)  | Auto-increment               |
| name          | VARCHAR      | Visitor name                 |
| mobile        | VARCHAR(10)  | 10-digit mobile              |
| department    | VARCHAR      | Wizzybox / NammaQA / HR / Finance |
| purpose       | VARCHAR      | Purpose of visit             |
| host          | VARCHAR      | Employee to meet             |
| photo_path    | VARCHAR      | Filename of uploaded photo   |
| status        | ENUM         | WAITING / APPROVED / INPROGRESS / EXITED |
| check_in_time | DATETIME     | Auto-set on creation         |
| check_out_time| DATETIME     | Set when status = EXITED     |

### `feedbacks` table
| Column        | Type         | Description                  |
|---------------|--------------|------------------------------|
| id            | BIGINT (PK)  | Auto-increment               |
| visitor_name  | VARCHAR      | Visitor name                 |
| department    | VARCHAR      | Department                   |
| rating        | INT          | 1-5 stars                    |
| comment       | TEXT         | Optional comment             |
| submitted_at  | DATETIME     | Auto-set on creation         |

## CORS
Frontend at `http://localhost:5173` is whitelisted by default.

## Email Notifications
When a visitor checks in, an email is sent to the host (async, non-blocking).
Configure SMTP in `application.properties`.

## File Uploads
Photos are stored in `uploads/photos/` directory.
Access via `http://localhost:8080/uploads/{filename}`.
