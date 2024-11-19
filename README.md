# Prosjektstyring - Project Management Application

A comprehensive project management application built with React and Firebase, designed to help organizations manage departments, projects, and team collaboration effectively.

## Features

- **Department Management**
  - Create and manage multiple departments
  - Assign users to departments
  - Department-specific project views

- **Project Management**
  - Create and track projects within departments
  - Set project milestones and deadlines
  - Track project progress
  - Manage project budgets
  - Upload and manage project documents
  - Project commenting system

- **Team Collaboration**
  - Add team members to projects
  - Role-based access control
  - Real-time updates and notifications
  - Project discussions and comments

- **Reporting**
  - Project progress tracking
  - Budget monitoring
  - Project status reports
  - Department overview

## Technical Stack

- **Frontend**: React.js
- **Backend**: Firebase
  - Firestore (Database)
  - Firebase Authentication
  - Firebase Storage
  - Firebase Analytics
- **Styling**: CSS Modules
- **State Management**: React Context API
- **Authentication**: Google Sign-In

## Setup and Installation

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd project-management-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start Development Server**
   ```bash
   npm start
   ```

## Project Structure

```
project-management-app/
├── public/
├── src/
│   ├── components/
│   │   ├── department/     # Department-related components
│   │   ├── dialogs/        # Dialog components
│   │   ├── AdminPage.js    # Admin dashboard
│   │   ├── Auth.js         # Authentication component
│   │   ├── FrontPage.js    # Landing page
│   │   └── ...
│   ├── firebase.js         # Firebase configuration
│   ├── initFirestore.js    # Firestore initialization
│   └── App.js             
├── .env                    # Environment variables
└── package.json
```

## Brukerroller og Tilganger

### Administrator (Admin)
Administratorer har følgende eksklusive rettigheter:
- Opprette og slette avdelinger
- Administrere brukertilgang til avdelinger
- Se alle avdelinger i systemet
- Administrere systeminnstillinger
- Full tilgang til admin-dashbordet

### Vanlige Brukere med Avdelingstilgang
Når en bruker har fått tilgang til en avdeling, kan de:
- Opprette nye prosjekter i avdelingen
- Administrere eksisterende prosjekter:
  - Oppdatere prosjektinformasjon
  - Legge til og administrere team-medlemmer
  - Opprette og oppdatere milepæler
  - Laste opp og administrere dokumenter
  - Oppdatere budsjett
  - Legge til kommentarer
  - Oppdatere prosjektets fremdrift
- Se alle prosjekter i avdelingen de har tilgang til
- Laste ned prosjektdokumenter
- Delta i prosjektdiskusjoner

### Hovedforskjeller mellom Admin og Vanlige Brukere

1. **Avdelingsnivå**
   - Admin: Kan opprette, slette og administrere avdelinger
   - Bruker: Kan kun se og jobbe i avdelinger de har fått tilgang til

2. **Brukertilgang**
   - Admin: Kan gi andre brukere tilgang til avdelinger
   - Bruker: Ingen mulighet til å administrere tilgang

3. **Prosjektnivå**
   - Admin: Har tilgang til alle prosjekter i alle avdelinger
   - Bruker: Har full tilgang til prosjekter i avdelinger de er medlem av

4. **Systemadministrasjon**
   - Admin: Har tilgang til admin-dashbordet og systeminnstillinger
   - Bruker: Ingen tilgang til administrative funksjoner

### Tilgangskontroll i Systemet

1. **Autentisering**
   - Alle brukere må logge inn med Google-autentisering
   - Første innlogging oppretter automatisk en brukerpost i systemet

2. **Avdelingstilgang**
   - Administreres av admin gjennom admin-panelet
   - Brukere må ha logget inn minst én gang for å kunne få tilgang
   - Tilgang lagres i `userDepartments`-collection

3. **Prosjekttilgang**
   - Automatisk tilgang til alle prosjekter i avdelinger man er medlem av
   - Mulighet til å opprette og administrere prosjekter innen disse avdelingene

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use CSS modules for styling
- Implement proper error handling
- Write meaningful component and function names

### State Management
- Use React Context for global state
- Keep component state local when possible
- Implement proper data fetching patterns

### Firebase Integration
- Follow Firebase security best practices
- Implement proper error handling for Firebase operations
- Use appropriate Firebase SDK features

## Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

## Security Considerations

- All Firebase API keys are stored in environment variables
- Firestore security rules are implemented
- Google Authentication is required
- Role-based access control is enforced
- Regular security audits are recommended

## Performance Optimization

- Implement lazy loading for components
- Use Firebase query pagination
- Optimize image and file uploads
- Cache frequently accessed data
- Monitor Firebase usage quotas

## Support and Maintenance

- Regular updates and security patches
- Backup strategy for Firestore data
- Monitor Firebase Analytics for usage patterns
- Regular code reviews and updates
