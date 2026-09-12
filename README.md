# Game Store Frontend

React frontend for the Game Store technical assignment. The application connects to a Django REST API and lets authenticated users browse digital products, filter them by location, view product details, purchase a product, and display the generated receipt.

## Features

- JWT authentication with sign-in and sign-out
- Protected application routes
- Paginated product listing
- Product filtering by Jordan (`JO`) or Saudi Arabia (`SA`)
- Individual product details page
- Product purchase flow
- Receipt page backed by order data from PostgreSQL
- Loading, empty, and error states
- Responsive design for desktop and mobile screens

## Technologies

- React
- React Router
- Axios
- Parcel
- HTML5 and CSS3
- Django REST Framework backend
- PostgreSQL database

## Related Repository

The Django backend is available at:

[game-store-backend](https://github.com/SaifAl-kurdi/game-store-backend)

## Prerequisites

Install the following tools before starting:

- [Node.js](https://nodejs.org/)
- npm, which is included with Node.js
- Git
- The Game Store Django backend

Verify Node.js and npm:

```powershell
node --version
npm --version
```

## Local Setup

### 1. Clone the repository

```powershell
git clone https://github.com/SaifAl-kurdi/game-store-frontend.git
cd game-store-frontend
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
API_BASE_URL=http://127.0.0.1:8000/api
```

The `.env` file is ignored by Git and must not contain committed secrets.

### 4. Start the Django backend

Open a terminal in the backend project and run:

```powershell
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

The backend should be available at:

```text
http://127.0.0.1:8000
```

### 5. Start the React frontend

Open another terminal in this frontend project and run:

```powershell
npm start
```

If PowerShell cannot execute `npm`, use:

```powershell
npm.cmd start
```

Open the address printed by Parcel. By default, it is:

```text
http://localhost:1234
```

## Available Scripts

### Development server

```powershell
npm start
```

### Production build

```powershell
npm run build
```

The production files are generated in the `dist` directory.

## Application Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Sign in and obtain JWT tokens |
| `/products` | Protected | Browse, filter, and paginate products |
| `/products/:productId` | Protected | View one product and purchase it |
| `/receipts/:receiptNumber` | Protected | View a completed purchase receipt |

## Backend API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login/` | Obtain access and refresh tokens |
| `POST` | `/api/auth/refresh/` | Refresh an access token |
| `GET` | `/api/products/` | List and filter products |
| `GET` | `/api/products/{id}/` | Retrieve product details |
| `POST` | `/api/orders/` | Purchase a product and create an order |
| `GET` | `/api/orders/{receipt_number}/` | Retrieve the authenticated user's receipt |

Product listing query examples:

```text
/api/products/?page=1&page_size=4
/api/products/?location=JO
/api/products/?location=SA
```

## Authentication Flow

1. The user enters a Django username and password on the login page.
2. The frontend sends the credentials to `/api/auth/login/`.
3. The access and refresh tokens are stored in browser session storage.
4. Axios adds the access token to protected API requests using the `Authorization: Bearer` header.
5. Protected routes redirect unauthenticated users to the login page.
6. Signing out removes the stored tokens.

## Purchase Flow

1. The user opens the protected product listing.
2. The user selects **View details**.
3. The product details page retrieves the selected product from Django.
4. The user selects **Buy now**.
5. The frontend posts the product ID to `/api/orders/`.
6. Django saves the order in PostgreSQL and returns a receipt number.
7. The frontend redirects to the receipt page and retrieves the saved order.

## Project Structure

```text
game-store-frontend/
|-- src/
|   |-- api/
|   |   `-- client.js
|   |-- auth/
|   |   `-- AuthContext.jsx
|   |-- components/
|   |   `-- ProtectedRoute.jsx
|   |-- pages/
|   |   |-- LoginPage.jsx
|   |   |-- ProductDetailsPage.jsx
|   |   |-- ProductsPage.jsx
|   |   `-- ReceiptPage.jsx
|   |-- App.jsx
|   |-- index.html
|   |-- main.jsx
|   `-- styles.css
|-- .env.example
|-- .gitignore
|-- package-lock.json
|-- package.json
`-- README.md
```

## Environment Example

The repository should include `.env.example` with:

```env
API_BASE_URL=http://127.0.0.1:8000/api
```

Developers can copy it to `.env` and change the URL for their environment.

## Troubleshooting

### `node` or `npm` is not recognized

Restart VS Code after installing Node.js. Confirm that the Node.js installation directory is included in the Windows `Path` environment variable.

### Port 1234 is already in use

Stop the other Parcel process or start the project on another port:

```powershell
npx parcel src/index.html --port 1235
```

If the cache causes outdated content to appear, stop Parcel, delete `.parcel-cache`, and start it again.

### CORS error

Confirm that Django allows the frontend addresses:

```text
http://localhost:1234
http://127.0.0.1:1234
```

### API requests return `401 Unauthorized`

Sign out and sign in again. Also confirm that the Django backend is running and the username and password are valid.

## Security Notes

- `.env`, `node_modules`, `.parcel-cache`, and `dist` are excluded from Git.
- Passwords and JWT tokens must never be committed to the repository.
- Receipts are requested through protected endpoints and are scoped to the authenticated user by the backend.

## Author

Saif Al-Kurdi
