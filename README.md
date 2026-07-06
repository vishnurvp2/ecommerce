# E Commerce

## Prerequisites

Node < v24.15.0\
Npm < 11.12.1

## Installation

**1. Clone the repository:**

```Bash
git clone https://github.com/vishnurvp2/ecommerce.git
cd ecommerce
```

**2. Install dependencies:**

1. Backend and Frontend dependencies

```Bash
(cd backend && npm install)
(cd frontend && npm install)
```

**3. Create environment files**

```Bash

printf "PORT=\nJWT_ACCESS_SECRET=\nJWT_REFRESH_SECRET=\nMONGODB_ATLAS_URI=\n" > backend/.env.development
printf "PORT=\nJWT_ACCESS_SECRET=\nJWT_REFRESH_SECRET=\nMONGODB_ATLAS_URI=\n" > backend/.env.production

printf "VITE_API_URL=\n" > frontend/.env.development
printf "VITE_API_URL=\n" > frontend/.env.production
```
