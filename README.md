# AgileMunk

Personal Agile Project Management Tool - Jakarta EE Full-Stack Application

## Overview

AgileMunk is a Kanban-style project management application built with Jakarta EE 10. It provides a modern web interface for managing boards and tasks with a full-featured REST API backend.

## Technology Stack

### Backend
- **Jakarta EE 10** - Latest Jakarta EE framework
- **Jakarta Persistence (JPA)** - ORM with Hibernate 6.2
- **Jakarta RESTful Web Services (JAX-RS)** - REST API with Jersey
- **Jakarta CDI** - Dependency Injection with Weld
- **Jakarta Bean Validation** - Input validation
- **H2 Database** - Embedded database for data persistence
- **Java 17** - Latest LTS Java version

### Frontend
- **HTML5** - Modern web markup
- **CSS3** - Responsive design with modern styling
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - Async HTTP requests

## Project Structure

```
AgileMunk/
├── agilemunk-backend/          # Jakarta EE Backend Module
│   ├── src/main/java/
│   │   └── com/agilemunk/
│   │       ├── entity/         # JPA Entities
│   │       ├── repository/     # Data Access Layer
│   │       ├── service/        # Business Logic Layer
│   │       ├── rest/           # JAX-RS REST Resources
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── filter/         # Servlet Filters (CORS)
│   │       └── config/         # Application Configuration
│   ├── src/main/resources/
│   │   └── META-INF/
│   │       └── persistence.xml # JPA Configuration
│   └── src/main/webapp/
│       └── WEB-INF/
│           ├── beans.xml       # CDI Configuration
│           └── web.xml         # Web Application Configuration
│
├── agilemunk-frontend/         # Frontend Module
│   └── src/main/webapp/
│       ├── index.html          # Main UI
│       ├── css/
│       │   └── style.css       # Application Styles
│       └── js/
│           ├── api.js          # API Client
│           └── app.js          # Application Logic
│
└── pom.xml                     # Parent POM

```

## Features

### Board Management
- Create, read, update, and delete project boards
- View all boards with creation dates
- Store board name and description

### Task Management
- Create tasks within boards
- Organize tasks by status: To Do, In Progress, Done
- Set task priorities: Low, Medium, High
- Update task status with drag-and-drop-like interface
- Delete tasks
- Store task title, description, priority, and status

### Data Persistence
- H2 file-based database
- Automatic schema generation
- Sample data initialization
- Full CRUD operations via REST API

### User Interface
- Clean, modern design with gradient backgrounds
- Responsive layout for mobile and desktop
- Modal dialogs for creating boards and tasks
- Kanban board view with three columns
- Real-time statistics dashboard

## Prerequisites

- **Java 17** or higher
- **Maven 3.8+** for building
- **Any Jakarta EE compatible server** (optional):
  - Apache TomEE 9.x
  - WildFly 27+
  - Payara Server 6+
  - GlassFish 7+

## Building the Application

### Build All Modules

```bash
mvn clean package
```

This will create:
- `agilemunk-backend/target/agilemunk.war` - Backend REST API
- `agilemunk-frontend/target/agilemunk-frontend.war` - Frontend UI

### Build Individual Modules

```bash
# Backend only
mvn clean package -pl agilemunk-backend

# Frontend only
mvn clean package -pl agilemunk-frontend
```

## Running the Application

### Option 1: Using Jetty (Recommended for Development)

The backend module includes Jetty Maven Plugin for easy local testing:

```bash
cd agilemunk-backend
mvn jetty:run
```

The backend will be available at: `http://localhost:8080/agilemunk/api`

To run the frontend, you can use any static web server or open the HTML file directly in your browser after configuring the API URL.

### Option 2: Deploy to Jakarta EE Server

1. Build the WAR files:
   ```bash
   mvn clean package
   ```

2. Deploy `agilemunk-backend/target/agilemunk.war` to your Jakarta EE server

3. Deploy `agilemunk-frontend/target/agilemunk-frontend.war` to your web server or Jakarta EE server

4. Update the API URL in `agilemunk-frontend/src/main/webapp/js/api.js`:
   ```javascript
   const API_BASE_URL = 'http://your-server:port/agilemunk/api';
   ```

### Option 3: Deploy Backend and Serve Frontend Statically

1. Deploy the backend WAR to your Jakarta EE server

2. Serve the frontend files from `agilemunk-frontend/src/main/webapp/` using any web server (nginx, Apache, etc.)

3. Update the API URL in `api.js` to point to your backend deployment

## REST API Endpoints

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/{id}` - Get board by ID
- `POST /api/boards` - Create new board
- `PUT /api/boards/{id}` - Update board
- `DELETE /api/boards/{id}` - Delete board
- `GET /api/boards/count` - Get board count

### Tasks
- `GET /api/boards/{boardId}/tasks` - Get tasks for a board
- `POST /api/boards/{boardId}/tasks` - Create task in board
- `GET /api/boards/{boardId}/tasks/{taskId}` - Get task by ID
- `PUT /api/boards/{boardId}/tasks/{taskId}` - Update task
- `DELETE /api/boards/{boardId}/tasks/{taskId}` - Delete task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/count` - Get total task count
- `GET /api/tasks/count/status/{status}` - Get task count by status

## Configuration

### Database Configuration

Edit `agilemunk-backend/src/main/resources/META-INF/persistence.xml`:

```xml
<property name="jakarta.persistence.jdbc.url"
          value="jdbc:h2:file:./data/agilemunk;DB_CLOSE_DELAY=-1"/>
```

The database file will be created in the `data/` directory.

### CORS Configuration

CORS is enabled by default in `CorsFilter.java`. For production, update the allowed origins:

```java
httpResponse.setHeader("Access-Control-Allow-Origin", "https://yourdomain.com");
```

## Development

### Hot Reload with Jetty

When using `mvn jetty:run`, Jetty will automatically reload classes when changed. For best experience:

```bash
# Terminal 1: Run Jetty
cd agilemunk-backend
mvn jetty:run

# Terminal 2: Compile on change
mvn compile -DskipTests
```

### Testing the API

Use curl or Postman to test the API:

```bash
# Get all boards
curl http://localhost:8080/agilemunk/api/boards

# Create a board
curl -X POST http://localhost:8080/agilemunk/api/boards \
  -H "Content-Type: application/json" \
  -d '{"name":"My Board","description":"Test board"}'

# Get board count
curl http://localhost:8080/agilemunk/api/boards/count
```

## Database

The application uses H2 database in file mode. Data is persisted in:
- `data/agilemunk.mv.db` - Database file
- `data/agilemunk.trace.db` - Trace file (if logging enabled)

### H2 Console

To access the H2 console (for debugging), add this to your server configuration or access via:
```
URL: jdbc:h2:file:./data/agilemunk
User: sa
Password: (empty)
```

## Sample Data

On first startup, the application creates sample data:
- 1 sample board: "Sample Project"
- 6 sample tasks with various statuses and priorities

To disable sample data initialization, modify `DatabaseInitializer.java`.

## Troubleshooting

### Backend doesn't start
- Check Java version: `java -version` (should be 17+)
- Check Maven version: `mvn -version` (should be 3.8+)
- Verify all dependencies downloaded: `mvn dependency:resolve`

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:8080/agilemunk/api/boards`
- Check CORS settings in `CorsFilter.java`
- Verify API_BASE_URL in `api.js` matches your backend URL

### Database errors
- Check file permissions in `data/` directory
- Delete `data/` folder to reset database
- Check `persistence.xml` configuration

### CDI injection not working
- Verify `beans.xml` exists in `WEB-INF/`
- Check `@ApplicationScoped` annotations on repositories and services
- Ensure Weld servlet dependency is included

## License

This is a personal project for educational purposes.

## Author

Built with Jakarta EE 10 - Modern Enterprise Java
