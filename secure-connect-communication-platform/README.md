# Lab 4 – Secure Connect and Communication Platform

Custom Web Dev III Unit 4 backend: authentication, authorization, protected Notes CRUD, real-time chat and event-driven features.

## Stack
Node.js, Express, MongoDB/Mongoose, bcrypt, jsonwebtoken (JWT), Socket.IO, Node.js EventEmitter and dotenv.

## Setup
1. Extract the ZIP and open this folder in VS Code.
2. In the terminal run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set a long random `JWT_SECRET`. Keep the local MongoDB URI if MongoDB is running locally, or replace it with your Atlas URI.
5. Start MongoDB, then run `npm run dev`.
6. Server: `http://localhost:5000`; chat page: `http://localhost:5000/chat.html`.

## API

### Signup
`POST /api/auth/signup`
```json
{"username":"victor","email":"victor@example.com","password":"123456"}
```
Returns `201 Created`. Password is hashed using bcrypt. Public signup always assigns the `user` role.

### Login
`POST /api/auth/login`
```json
{"email":"victor@example.com","password":"123456"}
```
Response contains a JWT token. Use it in Postman under Authorization → Bearer Token.

### Current profile
`GET /api/auth/me` (requires Bearer token).

### Notes API – all routes require a valid JWT
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/notes` | Create note |
| GET | `/api/notes` | List accessible notes |
| GET | `/api/notes/:id` | Get one note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

Example note body:
```json
{"title":"My First Note","content":"This is my first note of Web Dev III."}
```
Regular users can access only their own notes. Admins can access all notes (RBAC).

## Test sequence in Postman
1. Signup, then login.
2. Copy the login response token.
3. First try `GET /api/notes` without a token: expect `401 No token provided`.
4. Add the token using Authorization → Bearer Token.
5. Create a note, list notes, get a note by ID, update it, and delete it.

## Admin RBAC demonstration
New registrations are intentionally assigned `user`; a request cannot choose its own role. To test the admin branch in a local lab database, use MongoDB Compass or `mongosh`:
```javascript
use secure_connect_platform
db.users.updateOne({email:"victor@example.com"},{$set:{role:"admin"}})
```
Log in again after changing the role. Do not publish admin credentials.

## Socket.IO real-time chat
1. Sign up and log in through Postman.
2. Open `http://localhost:5000/chat.html` in two browser tabs.
3. Paste a valid JWT token in each tab and click Connect.
4. Join the `general` room in both tabs and send a message.
5. For a two-user demonstration, use two separate registered accounts and tokens.

Socket connections are JWT-authenticated. Only users who have joined a room can send messages to it.

## EventEmitter
`src/events/appEvents.js` listens for `user:registered`, `user:logged-in`, `note:created` and `note:deleted`, and logs these events to the server console.

## Security
`.env` and `node_modules` are excluded by `.gitignore`. Never commit your real database credentials, JWT secret or passwords. This is a lab project; production deployment needs HTTPS, rate limiting and managed secrets.
