# Job Application Tracker

A full stack web application to track and manage job applications - built while running my own job search, and used as a way to learn Spring Boot, REST APIs, and how a frontend and backend actually talk to each other in a real project.

## Features

- Add, edit, and delete job applications
- Filter applications by status - Wishlist, Applied, Interview, Offer, Rejected
- Live dashboard showing application stats at a glance
- Dark mode toggle with saved preference
- Data persisted in MySQL through a REST API (not just local browser storage)

## Tech Stack

**Frontend:** HTML, CSS, JavaScript (vanilla, no frameworks)
**Backend:** Java, Spring Boot, Spring Data JPA
**Database:** MySQL

## Architecture

```
Frontend (JavaScript fetch calls)
                |
Spring Boot REST API (Controller -> Service -> Repository)
                |
          MySQL Database
```

The frontend calls REST endpoints exposed by the Spring Boot backend. The Controller handles incoming requests, the Service layer holds the logic, and the Repository (via Spring Data JPA) talks to MySQL - no manual SQL required.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Fetch all job applications |
| GET | `/api/jobs/{id}` | Fetch a single job application |
| POST | `/api/jobs` | Add a new job application |
| PUT | `/api/jobs/{id}` | Update an existing job application |
| DELETE | `/api/jobs/{id}` | Delete a job application |

## What I Learned / Challenges Faced

- Configured CORS (`@CrossOrigin`) so the frontend could call the backend without the browser blocking the request
- Hit a Hibernate dialect error caused by MySQL not running - learned to read Spring Boot startup logs to trace the actual root cause instead of guessing
- Fixed a date field mismatch between the backend's JSON response (`dateApplied`) and the frontend's rendering logic (`date`) - a good reminder that frontend and backend field names need to match exactly
- Understood the role of each layer in a Spring Boot app - Controller, Service, Repository - and why splitting logic this way matters even for a small project

## How to Run Locally

1. Clone the repository
   ```
   git clone https://github.com/Adarsh-Patel2/job-application-tracker.git
   ```
2. Set up a MySQL database and update `src/main/resources/application.properties` with your own username and password
3. Run the Spring Boot application from your IDE, or via terminal:
   ```
   mvnw spring-boot:run
   ```
4. Open `Frontend/index.html` in your browser
