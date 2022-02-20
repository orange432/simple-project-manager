# Simple Project Manager
A simple project manager.

## Technologies used
- React
- Next.js
- Prisma
- React Bootstrap

## Setup
Create a file called .env and add the following variables:
```
DATABASE_URL="file:manager.db"
JWT_SECRET="randomsecretstring"
```
Replace the JWT_SECRET with a random secret string.

## Possible Improvements
- Use Reducers instead of useState hooks
- WebSocket based messaging system
- Drag and Drop for the tasks
- Use the authenticate function instead of raw code