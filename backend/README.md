# Job Application Tracker API (Backend)

Express + MongoDB + AWS S3 backend for authentication, resume storage (pre-signed URLs), and job application tracking.

- Entry point: [backend/src/index.js](backend/src/index.js)
- DB: [`utils.connectDB`](backend/src/utils/db.js)
- Auth middleware: [`middlewares.verifyToken`](backend/src/middlewares/verifyToken.js)
- AWS S3 client: [`config.s3`](backend/src/config/s3.js)

## Quick Start

1. Install
   ```bash
   cd backend
   npm install
   ```
2. Environment
   ```bash
   cp .env.example .env
   ```
3. Run
   ```bash
   npm run dev
   ```

## Environment Variables

Create `backend/.env` with:
```bash
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret

AWS_REGION=us-east-1
AWS_ACCESS_KEY=AKIA...
AWS_SECRET_KEY=...
AWS_S3_BUCKET=your-bucket-name
```

## Authentication

Controller: [`controllers.authController`](backend/src/controllers/authController.js)  
Routes: [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js)

- POST /api/auth/signup → [`authController.signup`](backend/src/controllers/authController.js)
  - Body: `firstName` (string), `lastName` (string, optional), `email` (string), `password` (string, min 6)
  - 201: `{ message, newUser, token }` (token from [`utils.generateToken`](backend/src/utils/generateToken.js))

  ```bash
  curl -X POST http://localhost:5000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"firstName":"Ada","lastName":"Lovelace","email":"ada@example.com","password":"secret123"}'
  ```

- POST /api/auth/login → [`authController.login`](backend/src/controllers/authController.js)
  - Body: `email`, `password`
  - 200: `{ message, user, token }`

  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"ada@example.com","password":"secret123"}'
  ```

- POST /api/auth/logout → [`authController.logout`](backend/src/controllers/authController.js)
  - 200: `{ message }`

JWT usage: Include header `Authorization: Bearer <token>` on protected endpoints.

## Resume

Controller: [`controllers.resumeController`](backend/src/controllers/resumeController.js)  
Routes: [backend/src/routes/resumeRoutes.js](backend/src/routes/resumeRoutes.js)  
Protected by [`verifyToken`](backend/src/middlewares/verifyToken.js)

- POST /api/resume/upload-url → [`resumeController.uploadResume`](backend/src/controllers/resumeController.js)
  - Body: `fileName` (string), `contentType` (must be `application/pdf`)
  - 200: `{ uploadUrl, resume }`
  - Generates S3 pre-signed PUT URL via [`utils.generateUploadUrl`](backend/src/utils/generateUploadUrl.js). Saves a [`models.Resume`](backend/src/models/Resume.js) with `s3key`.

  ```bash
  curl -X POST http://localhost:5000/api/resume/upload-url \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"fileName":"resume.pdf","contentType":"application/pdf"}'
  # Then PUT the file to uploadUrl:
  curl -X PUT "<uploadUrl>" \
    -H "Content-Type: application/pdf" \
    --data-binary @resume.pdf
  ```

- GET /api/resume/:id → [`resumeController.viewResume`](backend/src/controllers/resumeController.js)
  - 200: `{ viewUrl }` (S3 pre-signed GET URL)
  - 404: Resume not found

  ```bash
  curl -X GET http://localhost:5000/api/resume/<resumeId> \
    -H "Authorization: Bearer <token>"
  ```

## Applications

Model: [`models.Application`](backend/src/models/Application.js)  
Controller: [`controllers.applicationController`](backend/src/controllers/applicationController.js)  
Routes: [backend/src/routes/applicationRoutes.js](backend/src/routes/applicationRoutes.js)  
Protected by [`verifyToken`](backend/src/middlewares/verifyToken.js)

- POST /api/application → [`applicationController.createApplication`](backend/src/controllers/applicationController.js)
  - Required: `companyName`, `jobTitle`
  - Optional: `jobType`, `jobLocation`, `jobUrl`, `status`, `appliedDate`, `resumeId`, `source`, `notes`
  - 201: Application document

  ```bash
  curl -X POST http://localhost:5000/api/application \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"companyName":"ACME","jobTitle":"Software Engineer","status":"applied"}'
  ```

- GET /api/application → [`applicationController.getApplications`](backend/src/controllers/applicationController.js)
  - 200: Array of applications (sorted by `createdAt`)

  ```bash
  curl -X GET http://localhost:5000/api/application \
    -H "Authorization: Bearer <token>"
  ```

- PATCH /api/application/:id → [`applicationController.updateApplication`](backend/src/controllers/applicationController.js)
  - 200: Updated application

  ```bash
  curl -X PATCH http://localhost:5000/api/application/<id> \
    -H "Authorization: Bearer <token)" \
    -H "Content-Type: application/json" \
    -d '{"status":"interview"}'
  ```

- DELETE /api/application/:id → [`applicationController.deleteApplication`](backend/src/controllers/applicationController.js)
  - 200: `{ message }`

  ```bash
  curl -X DELETE http://localhost:5000/api/application/<id> \
    -H "Authorization: Bearer <token>"
  ```

## Data Models

- User: [`models.User`](backend/src/models/User.js)
- Resume: [`models.Resume`](backend/src/models/Resume.js)
- Application: [`models.Application`](backend/src/models/Application.js)

## Scripts

See [backend/package.json](backend/package.json):
- `npm run dev` — start with nodemon

## Notes

- Protected routes require `Authorization: Bearer <token>`.
- S3 pre-signed URLs expire quickly; request a new one before upload/view.
- Ensure `AWS_S3_BUCKET` exists and the credentials have S3 permissions.