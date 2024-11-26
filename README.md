# Prosjektstyring - Project Management Application

A comprehensive project management application built with React and Firebase, designed to help organizations manage departments, projects, and team collaboration effectively.

## Features

- **Department Management**
  - Create and manage multiple departments
  - Granular access control for departments
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
  - Hierarchical permission system
  - Real-time updates
  - Project discussions and comments

- **Permission Management**
  - System-wide admin controls
  - Department-level admin roles
  - Visual permission indicators
  - Audit trail for permission changes

## Technical Stack

- **Frontend**: React.js
- **Backend**: Firebase
  - Firestore (Database)
  - Firebase Authentication
  - Firebase Storage
- **Styling**: Modern CSS with gradients
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
│   │   └── ...
│   ├── services/
│   │   ├── PermissionService.js  # Permission management
│   │   └── ProjectService.js     # Project operations
│   ├── firebase.js         # Firebase configuration
│   ├── initFirestore.js    # Firestore initialization
│   └── App.js             
├── .env                    # Environment variables
└── package.json
```

## Tilgangssystem

### Brukerroller

1. **Systemadministrator**
   - Full tilgang til hele systemet
   - Kan opprette og slette avdelinger
   - Kan gi og fjerne tilganger
   - Tilgang til admin-dashbordet

2. **Avdelingsadministrator**
   - Full tilgang til sin avdeling
   - Kan administrere prosjekter
   - Kan administrere team
   - Kan ikke gi tilganger

3. **Avdelingsmedlem**
   - Kan se og jobbe med prosjekter
   - Kan kommentere og oppdatere status
   - Begrenset til tildelte avdelinger

### Tilgangshåndtering

1. **Brukerregistrering**
   - Automatisk opprettelse ved første innlogging
   - Google-autentisering
   - Vises i admin-panelet etter første innlogging

2. **Administrasjon av Tilganger**
   - Administreres via admin-panelet
   - Tydelig visning av eksisterende tilganger
   - Enkel tildeling/fjerning av tilganger
   - Visuell bekreftelse med badges

3. **Tilgangskontroll**
   - Sjekkes både i frontend og backend
   - Firestore security rules
   - Audit logging av endringer
   - Automatisk redirect ved manglende tilgang

### Administrasjonspanel

1. **Avdelingsoversikt**
   - Liste over alle avdelinger
   - Antall brukere per avdeling
   - Mulighet for å opprette nye avdelinger

2. **Brukertilganger**
   - Oversikt over alle brukere
   - Tydelige badges viser nåværende tilganger
   - Knapper for å gi/fjerne tilganger
   - Knapper for å gi/fjerne admin-status

## Security Considerations

- Hierarkisk tilgangskontroll
- Firestore security rules
- Google Authentication required
- Audit trail for tilgangsendringer
- Automatisk brukeropprettelse

## Development Guidelines

### Code Style
- Functional components with hooks
- Modern CSS with gradients
- Proper error handling
- Clear component structure

### Permission Management
- Use PermissionService for all access checks
- Implement proper error handling
- Keep UI consistent with permissions
- Clear feedback on permission changes

### Firebase Integration
- Follow Firebase security best practices
- Implement proper error handling
- Use appropriate Firebase features

## Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

## Support and Maintenance

- Regular security updates
- Backup strategy
- Permission audit logs
- Regular code reviews
