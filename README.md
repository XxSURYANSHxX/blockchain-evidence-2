# 🔐 EVID-DGC - Blockchain Evidence Management System

**Secure admin-controlled evidence management system with role-based access control.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Render-blue)](https://render.com/)

**📊 Project Insights**

<table align="center">
    <thead align="center">
        <tr>
            <td><b>🌟 Stars</b></td>
            <td><b>🍴 Forks</b></td>
            <td><b>🐛 Issues</b></td>
            <td><b>🔔 Open PRs</b></td>
            <td><b>🛠️ Languages</b></td>
            <td><b>👥 Contributors</b></td>
        </tr>
     </thead>
    <tbody>
         <tr>
            <td><img alt="Stars" src="https://img.shields.io/github/stars/Gooichand/blockchain-evidence?style=flat&logo=github"/></td>
            <td><img alt="Forks" src="https://img.shields.io/github/forks/Gooichand/blockchain-evidence?style=flat&logo=github"/></td>
            <td><img alt="Issues" src="https://img.shields.io/github/issues/Gooichand/blockchain-evidence?style=flat&logo=github"/></td>
            <td><img alt="Open PRs" src="https://img.shields.io/github/issues-pr/Gooichand/blockchain-evidence?style=flat&logo=github"/></td>
            <td><img alt="Languages Count" src="https://img.shields.io/github/languages/count/Gooichand/blockchain-evidence?style=flat&color=green&logo=github"/></td>
            <td><img alt="Contributors Count" src="https://img.shields.io/github/contributors/Gooichand/blockchain-evidence?style=flat&color=blue&logo=github"/></td>
        </tr>
    </tbody>
</table>

<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=25&pause=1000&color=36BCF7&center=true&vCenter=true&width=600&lines=Welcome+to+EVID-DGC;Secure+Blockchain+Evidence+Management;Role-Based+Access+Control;Immutable+Audit+Logs" alt="Typing SVG" />
</div>

<p align="center">
  <a href="https://evid-dgc.onrender.com"><strong>🌐 Live Website</strong></a>
</p>

---

## ❓ Problem & Solution

### Problem Statement
Digital evidence management often faces challenges like data tampering, lack of a verifiable chain of custody, and inconsistent access control. Traditional systems can be opaque, making it difficult for judicial and investigative bodies to trust the integrity of digital artifacts.

### Solution Overview
**EVID-DGC** addresses these issues by leveraging blockchain-inspired principles and robust role-based access control. By utilizing a secure Supabase backend and providing immutable audit logs, the system ensures that every action—from evidence upload to court review—is tracked and verifiable, maintaining the highest standards of digital forensic integrity.

---

## ✨ Features

- 🔒 **Admin-Only User Management** - Secure user creation by administrators
- 👥 **8 User Roles** - Complete role-based access control system
- 🧪 **Test User System** - Create and login as test users for development
- 📊 **Admin Dashboard** - Comprehensive system oversight and management
- 💾 **Database Storage** - Supabase PostgreSQL backend with RLS
- 📱 **Modern UI** - Professional responsive design with accessibility
- 🔐 **Wallet Integration** - MetaMask blockchain authentication
- 📧 **Email Authentication** - Traditional email/password login option
- 🔍 **Audit Logging** - Complete activity tracking and compliance
- 🌐 **Multi-Platform** - Deploy on Render, Vercel, or Netlify

## 👥 Team Information

### Project Admin
**Gooichand**  
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Gooichand)

### Mentors
| Name | Role | Social Links |
|------|------|--------------|
| **Charu Awasthi** | Lead Mentor | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/Charu19awasthi) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/charu-awasthi-6312b6293/) |
| **Pragati Gaykwad** | Technical Mentor | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/PG-bit997) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pragati-gaykwad/) |

---

## 🛠️ Technical Info

### Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript, Socket.IO Client |
| **Backend** | Node.js v16+, Express.js, Socket.IO (Real-time) |
| **Smart Contracts** | Solidity, Remix IDE, Ganache, Polygon Network |
| **Storage** | IPFS (Evidence Files), Pinata (IPFS Pinning) |
| **Database** | Supabase (PostgreSQL with Row Level Security) |
| **Authentication** | MetaMask/Web3, Email/Password (Supabase Auth) |
| **Image Processing** | Sharp (Compression & Optimization) |
| **Document Processing** | PDF-Lib (Watermarking & Generation) |
| **Icons & UI** | Lucide Icons, Custom CSS Animations |
| **Hosting** | Render (Backend), Compatible with Vercel/Netlify |
| **Version Control** | Git, GitHub |

### User Roles
The system implements 8 distinct roles to ensure strict access control:
1. **Public Viewer**: Browse public case information.
2. **Investigator**: Handle case creation and evidence uploads.
3. **Forensic Analyst**: Perform technical analysis and generate reports.
4. **Legal Professional**: Conduct legal reviews of cases and evidence.
5. **Court Official**: Manage judicial proceedings and scheduling.
6. **Evidence Manager**: Maintain the chain of custody and storage integrity.
7. **Auditor**: Oversee system compliance and review audit logs.
8. **Administrator**: Full system oversight, user management, and configuration.

---

## 📁 Folder Structure

```text
├── build/                    # Compiled contracts and build artifacts
├── contracts/               # Solidity smart contracts
├── docs/                    # Detailed project documentation
├── public/                  # Frontend assets (HTML, JS, CSS)
│   ├── dashboard-*.html    # Role-specific dashboard views
│   ├── app.js              # Core frontend logic
│   └── styles.css          # Global styling
├── server.js                # Express backend server with Socket.IO
├── complete-database-setup.sql # Complete core database structure
├── evidence-tagging-schema.sql # Tags system database schema
├── evidence-export-schema.sql  # Export system database schema
├── REAL_TIME_NOTIFICATIONS.md # Notifications implementation details
├── render.yaml              # Deployment configuration for Render
├── package.json             # Node.js dependencies and scripts
├── SECURITY.md              # Security policy and reporting
└── README.md                # Project documentation
```

---

## 📚 Documentation

### Quick Links
- 🚀 [Quick Start](#-how-to-run-locally)
- 📖 [Complete Documentation](#-complete-documentation)
- 🔧 [API Reference](docs/API_DOCUMENTATION.md)
- 👥 [User Roles Guide](docs/USER_ROLES.md)
- 🚨 [Troubleshooting](docs/TROUBLESHOOTING.md)
- 🤝 [Contributing](Contributing.md)

### Complete Documentation

| Topic | Description | Link |
|-------|-------------|------|
| **Environment Setup** | Configure .env variables and Supabase | [📄 Environment Setup](docs/ENVIRONMENT_SETUP.md) |
| **Blockchain Config** | Network setup and MetaMask configuration | [⛓️ Blockchain Setup](docs/BLOCKCHAIN_SETUP.md) |
| **Local Development** | Development environment and workflow | [💻 Local Development](docs/LOCAL_DEVELOPMENT.md) |
| **Deployment Guide** | Deploy to Render, Vercel, or Netlify | [🚀 Deployment](docs/DEPLOYMENT.md) |
| **API Documentation** | Complete API reference and examples | [📡 API Docs](docs/API_DOCUMENTATION.md) |
| **User Roles** | Roles, permissions, and access control | [👤 User Roles](docs/USER_ROLES.md) |
| **Troubleshooting** | Common issues and solutions | [🔧 Troubleshooting](docs/TROUBLESHOOTING.md) |
| **Contributing** | How to contribute to the project | [🤝 Contributing](Contributing.md) |

---

## 🚀 How to Run Locally

### Prerequisites
Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **MetaMask** browser extension - [Install](https://metamask.io/)
- **Supabase** account - [Sign up](https://supabase.com/)
- **Code Editor** (VS Code recommended)

### 1. Clone Repository
```bash
# Clone the repository
git clone https://github.com/Gooichand/blockchain-evidence.git

# Navigate to project directory
cd blockchain-evidence
```

### 2. Install Dependencies
```bash
# Install all required packages
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration
```bash
# Create environment file from example
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Server Configuration
PORT=3000
NODE_ENV=development

# Blockchain Network (optional for local development)
BLOCKCHAIN_NETWORK=localhost
```

### 4. Database Setup
1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project or select existing one
3. Navigate to SQL Editor
4. Execute the following SQL files in order:

```sql
-- Step 1: Core database structure
-- Copy and run: complete-database-setup.sql

-- Step 2: Evidence tagging system (optional)
-- Copy and run: evidence-tagging-schema.sql

-- Step 3: Evidence export system (optional)
-- Copy and run: evidence-export-schema.sql
```

**Note**: You can edit the initial admin wallet address at the end of `complete-database-setup.sql` before running.

### 5. MetaMask Configuration
1. Install MetaMask extension in your browser
2. Create or import a wallet
3. Add the admin wallet address to the database (in SQL step above)
4. For local blockchain testing, configure Ganache network in MetaMask

### 6. Start Development Server
```bash
# Start the backend server with auto-reload
npm run dev

# Or for production mode
npm start
```

The server will start on `http://localhost:3000`

### 7. Access the Application
Open your browser and navigate to:
- **Main Application**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin.html
- **API Health Check**: http://localhost:3000/health

### 8. Test User Login
For development and testing:
1. Navigate to the login page
2. Use MetaMask to connect with the admin wallet
3. Or use email/password authentication (if configured)

### Common Development Commands
```bash
# Install new dependency
npm install package-name

# Run tests
npm test

# Check for linting errors
npm run lint

# Build for production
npm run build
```

---

## 🚀 Production Deployment

### Current Hosting
The application is currently hosted on **Render** with the following configuration:
- **Live URL**: [https://evid-dgc.onrender.com](https://evid-dgc.onrender.com)
- **Platform**: Render.com
- **Database**: Supabase (PostgreSQL)
- **File Storage**: IPFS via Pinata

### Deployment Configuration

#### Environment Variables Required
Ensure the following environment variables are set in your production environment:

```env
# Supabase Configuration
SUPABASE_URL=your_production_supabase_url
SUPABASE_KEY=your_production_supabase_key

# Server Configuration
PORT=3000
NODE_ENV=production

# IPFS/Pinata Configuration (if using)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Blockchain Network
BLOCKCHAIN_NETWORK=polygon
BLOCKCHAIN_RPC_URL=your_rpc_url

```

### Deploy to Render

#### Using Git Integration (Recommended)
1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   ```yaml
   Name: evid-dgc
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables**:
   - Add all required environment variables in Render dashboard
   - Navigate to "Environment" tab
   - Add each variable from the list above

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically deploy on every push to main branch


### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

Or drag and drop the `public` folder on [Netlify Drop](https://app.netlify.com/drop).


### Continuous Deployment
The project is configured for automatic deployment:
- **Trigger**: Push to `main` branch
- **Build**: Automatic via `npm install`
- **Deploy**: Automatic via hosting provider
- **Rollback**: Available through hosting dashboard

### Monitoring & Logs
- **Application Logs**: Available in Render/Vercel/Netlify dashboard
- **Database Logs**: Available in Supabase dashboard
- **Uptime Monitoring**: Consider using services like UptimeRobot

For detailed deployment troubleshooting, see [Deployment Documentation](docs/DEPLOYMENT.md).

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐
│   Web Browser   │
│  (MetaMask +    │
│   Frontend)     │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────────────────────┐
│     Express.js Backend          │
│  ┌──────────────────────────┐   │
│  │  Authentication Layer    │   │
│  │  (MetaMask/Email)        │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │  Role-Based Access       │   │
│  │  Control (RBAC)          │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │  Evidence Processing     │   │
│  │  (Upload/Watermark)      │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │  Real-time Events        │   │
│  │  (Socket.IO)             │   │
│  └──────────────────────────┘   │
└────┬──────────┬─────────┬───────┘
     │          │         │
     │          │         │
     ▼          ▼         ▼
┌─────────┐ ┌─────────┐ ┌──────────┐
│Supabase │ │  IPFS   │ │Blockchain│
│PostgreSQL│ │(Pinata) │ │(Polygon) │
│   +RLS  │ │ Storage │ │ Network  │
└─────────┘ └─────────┘ └──────────┘
```

### Data Flow

**Evidence Upload Flow**:
1. User authenticates via MetaMask or Email
2. Role verification through RBAC system
3. Evidence file uploaded to Express backend
4. File processed (watermark, compression)
5. File stored in IPFS via Pinata
6. Metadata and IPFS hash stored in Supabase
7. Transaction recorded on Polygon blockchain
8. Audit log created in database
9. Real-time notification sent via Socket.IO

**Access Control Flow**:
1. User login → JWT token generated
2. Each request validated against user role
3. Supabase RLS policies enforce database security
4. Audit trail logged for compliance

### Key Components

| Component | Technology | Purpose |
|-----------|------------|----------|
| **Frontend** | HTML/CSS/JS | User interface and interactions |
| **API Server** | Express.js | REST API and business logic |
| **WebSocket** | Socket.IO | Real-time notifications |
| **Database** | Supabase (PostgreSQL) | Structured data storage |
| **File Storage** | IPFS/Pinata | Decentralized evidence storage |
| **Blockchain** | Polygon | Immutable audit trail |
| **Authentication** | MetaMask/Supabase Auth | User authentication |
| **Authorization** | Custom RBAC | Role-based permissions |

For detailed architecture documentation, see [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md).

---

## ⭐ Support & Star
If you find this project helpful, please consider giving it a **Star**! It helps others discover the project and keeps the maintainers motivated.

---

## 💬 Suggestions & Feedback
We value your feedback! If you have suggestions for new features or have found a bug, please:
- Open an [Issue](https://github.com/Gooichand/blockchain-evidence/issues)
- Join the discussion in [Discussions](https://github.com/Gooichand/blockchain-evidence/discussions)

---

## 🤝 Contribution Guidelines
Contributions are welcome! Please read our [Contributing.md](Contributing.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📜 Code of Conduct
We are committed to providing a friendly, safe, and welcoming environment. Please review our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

<p align="right"><a href="#-evid-dgc---blockchain-evidence-management-system">Back to Top ↑</a></p>
