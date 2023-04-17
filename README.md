Here is an untitled project (backend for mobile app + admin dashboard) that I made in the past. I removed configurations (leaving only interfaces), scripts from package.json, and some other vulnerable parts. So now it can only be observed. 

The main purpose of this project is for technical interviews.

**Date:** 2021-2022

**Tech stack:**<br>
- TypeScript
- NestJS
- PostgreSQL
- Sequelize
- REST
- Docker
- Firebase push notifications
- AWS S3.

**Features:**<br>
- Internationalization (i18n) at database level.
- Auth based on JSON Web Tokens (JWT).
- Different application layers: admin, mobile, orm and something shared between them.
- Admin is a module for dashboard. Simple CRUDs with role permissions.
- Mobile is a module for mobile application. Get content, perform actions with user data, but no delete/change original content from admin dashboard.
- ORM is a data access layer. Extra abstraction (repositories) over sequelize.
- Shared is for modules that can be used in other parts of application