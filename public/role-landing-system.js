/**
 * Role-Specific Landing Pages System
 * Redirects users to appropriate dashboards based on their role
 */

class RoleLandingSystem {
    constructor() {
        this.roleRoutes = {
            'investigator': {
                path: 'dashboard-investigator.html',
                title: 'My Open Cases',
                description: 'Manage your active investigations and evidence'
            },
            'forensic_analyst': {
                path: 'dashboard-analyst.html',
                title: 'Evidence Analysis Queue',
                description: 'Process and analyze digital evidence'
            },
            'legal_professional': {
                path: 'dashboard-legal.html',
                title: 'Cases Pending Review',
                description: 'Review cases and prepare legal documentation'
            },
            'court_official': {
                path: 'dashboard-court.html',
                title: 'Court Docket',
                description: 'Manage court proceedings and schedules'
            },
            'evidence_manager': {
                path: 'dashboard-manager.html',
                title: 'Evidence Management',
                description: 'Maintain chain of custody and storage integrity'
            },
            'admin': {
                path: 'admin.html',
                title: 'System Overview',
                description: 'Comprehensive system administration'
            },
            'auditor': {
                path: 'dashboard-auditor.html',
                title: 'Audit Dashboard',
                description: 'Review system activities and compliance'
            },
            'public_viewer': {
                path: 'dashboard-public.html',
                title: 'Public Case Information',
                description: 'Browse publicly available case information'
            }
        };
        
        this.initializeRoleRedirection();
    }

    initializeRoleRedirection() {
        // Check if we're on a login/registration page
        const currentPage = window.location.pathname.split('/').pop();
        const isAuthPage = ['index.html', 'login.html', 'register.html', ''].includes(currentPage);
        
        if (isAuthPage) {
            // Set up post-login redirection
            this.setupPostLoginRedirection();
        } else {
            // Check if user should be redirected to their role-specific dashboard
            this.checkRoleAccess();
        }
    }

    setupPostLoginRedirection() {
        // Override the existing goToDashboard function
        const originalGoToDashboard = window.EVID_DGC?.goToDashboard || window.goToDashboard;
        
        window.goToDashboard = () => {
            this.redirectToRoleDashboard();
        };
        
        // Also override any dashboard navigation
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[href="dashboard.html"], [onclick*="dashboard"]');
            if (target) {
                e.preventDefault();
                this.redirectToRoleDashboard();
            }
        });
    }

    async redirectToRoleDashboard() {
        try {
            const userRole = this.getCurrentUserRole();
            
            if (!userRole) {
                console.warn('No user role found, redirecting to login');
                window.location.href = 'index.html';
                return;
            }

            const roleRoute = this.roleRoutes[userRole];
            
            if (!roleRoute) {
                console.warn(`No route defined for role: ${userRole}, using default dashboard`);
                window.location.href = 'dashboard.html';
                return;
            }

            // Show loading message
            this.showRedirectionMessage(roleRoute);
            
            // Store the user's preferred landing page
            this.storeUserPreference(userRole, roleRoute.path);
            
            // Redirect after a brief delay to show the message
            setTimeout(() => {
                window.location.href = roleRoute.path;
            }, 1500);
            
        } catch (error) {
            console.error('Role redirection failed:', error);
            window.location.href = 'dashboard.html';
        }
    }

    getCurrentUserRole() {
        try {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) return null;
            
            const userData = JSON.parse(localStorage.getItem('evidUser_' + currentUser) || '{}');
            return userData.role;
        } catch (error) {
            console.error('Failed to get user role:', error);
            return null;
        }
    }

    showRedirectionMessage(roleRoute) {
        // Create and show a redirection modal
        const modal = document.createElement('div');
        modal.className = 'redirection-modal';
        modal.innerHTML = `
            <div class="redirection-content">
                <div class="redirection-icon">
                    <i data-lucide="compass"></i>
                </div>
                <h3>Redirecting to Your Dashboard</h3>
                <p class="redirection-title">${roleRoute.title}</p>
                <p class="redirection-description">${roleRoute.description}</p>
                <div class="redirection-spinner">
                    <div class="spinner"></div>
                </div>
            </div>
        `;
        
        // Add styles if not already present
        this.addRedirectionStyles();
        
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.classList.add('show'), 100);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    addRedirectionStyles() {
        if (document.getElementById('redirection-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'redirection-styles';
        styles.textContent = `
            .redirection-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .redirection-modal.show {
                opacity: 1;
            }
            
            .redirection-content {
                background: white;
                border-radius: 16px;
                padding: 40px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            
            .redirection-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #d32f2f, #b71c1c);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
            }
            
            .redirection-icon i {
                width: 40px;
                height: 40px;
                color: white;
            }
            
            .redirection-content h3 {
                margin: 0 0 16px 0;
                color: #333;
                font-size: 1.5em;
                font-weight: 700;
            }
            
            .redirection-title {
                font-size: 1.2em;
                font-weight: 600;
                color: #d32f2f;
                margin: 0 0 8px 0;
            }
            
            .redirection-description {
                color: #666;
                margin: 0 0 24px 0;
                line-height: 1.5;
            }
            
            .redirection-spinner {
                display: flex;
                justify-content: center;
            }
        `;
        
        document.head.appendChild(styles);
    }

    storeUserPreference(role, path) {
        try {
            const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
            preferences.defaultLandingPage = path;
            preferences.lastRoleRedirect = {
                role,
                path,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
        } catch (error) {
            console.error('Failed to store user preference:', error);
        }
    }

    checkRoleAccess() {
        const currentPage = window.location.pathname.split('/').pop();
        const userRole = this.getCurrentUserRole();
        
        if (!userRole) return;
        
        // Check if user is on the correct dashboard for their role
        const expectedRoute = this.roleRoutes[userRole];
        if (expectedRoute && currentPage === 'dashboard.html') {
            // User is on generic dashboard, redirect to role-specific one
            this.redirectToRoleDashboard();
        }
    }

    // Method to get role-specific navigation items
    getRoleNavigation(role) {
        const navigationMap = {
            'investigator': [
                { title: 'My Cases', path: 'cases.html', icon: 'folder' },
                { title: 'Evidence Upload', path: 'evidence-manager.html', icon: 'upload' },
                { title: 'Case Timeline', path: 'case-timeline.html', icon: 'clock' }
            ],
            'forensic_analyst': [
                { title: 'Analysis Queue', path: 'evidence-comparison.html', icon: 'search' },
                { title: 'Evidence Verification', path: 'evidence-verification.html', icon: 'shield-check' },
                { title: 'Reports', path: 'reports.html', icon: 'file-text' }
            ],
            'legal_professional': [
                { title: 'Case Review', path: 'cases.html', icon: 'scale' },
                { title: 'Legal Documents', path: 'documents.html', icon: 'file-text' },
                { title: 'Court Calendar', path: 'calendar.html', icon: 'calendar' }
            ],
            'court_official': [
                { title: 'Court Docket', path: 'court-docket.html', icon: 'calendar' },
                { title: 'Case Filings', path: 'filings.html', icon: 'folder' },
                { title: 'Scheduling', path: 'scheduling.html', icon: 'clock' }
            ],
            'evidence_manager': [
                { title: 'Evidence Inventory', path: 'evidence-manager.html', icon: 'package' },
                { title: 'Chain of Custody', path: 'custody.html', icon: 'link' },
                { title: 'Storage Management', path: 'storage.html', icon: 'hard-drive' }
            ],
            'admin': [
                { title: 'User Management', path: 'admin.html', icon: 'users' },
                { title: 'System Health', path: 'system-health.html', icon: 'activity' },
                { title: 'Audit Logs', path: 'audit-trail.html', icon: 'file-search' }
            ],
            'auditor': [
                { title: 'Audit Dashboard', path: 'dashboard-auditor.html', icon: 'search' },
                { title: 'Activity Logs', path: 'audit-trail.html', icon: 'list' },
                { title: 'Compliance Reports', path: 'compliance.html', icon: 'shield' }
            ],
            'public_viewer': [
                { title: 'Public Cases', path: 'dashboard-public.html', icon: 'eye' },
                { title: 'Case Search', path: 'search.html', icon: 'search' },
                { title: 'Verification', path: 'evidence-verification.html', icon: 'check-circle' }
            ]
        };
        
        return navigationMap[role] || [];
    }

    // Method to create role-specific quick actions
    getRoleQuickActions(role) {
        const actionsMap = {
            'investigator': [
                { title: 'Create New Case', action: 'createCase', icon: 'plus-circle', color: '#10b981' },
                { title: 'Upload Evidence', action: 'uploadEvidence', icon: 'upload', color: '#3b82f6' },
                { title: 'Search Cases', action: 'searchCases', icon: 'search', color: '#8b5cf6' }
            ],
            'forensic_analyst': [
                { title: 'Analyze Evidence', action: 'analyzeEvidence', icon: 'microscope', color: '#10b981' },
                { title: 'Compare Files', action: 'compareFiles', icon: 'git-compare', color: '#f59e0b' },
                { title: 'Generate Report', action: 'generateReport', icon: 'file-text', color: '#ef4444' }
            ],
            'legal_professional': [
                { title: 'Review Case', action: 'reviewCase', icon: 'scale', color: '#10b981' },
                { title: 'Draft Motion', action: 'draftMotion', icon: 'edit', color: '#3b82f6' },
                { title: 'Schedule Hearing', action: 'scheduleHearing', icon: 'calendar', color: '#8b5cf6' }
            ],
            'admin': [
                { title: 'Create User', action: 'createUser', icon: 'user-plus', color: '#10b981' },
                { title: 'System Status', action: 'systemStatus', icon: 'activity', color: '#f59e0b' },
                { title: 'View Logs', action: 'viewLogs', icon: 'list', color: '#6b7280' }
            ]
        };
        
        return actionsMap[role] || [];
    }

    // Method to render role-specific dashboard content
    renderRoleDashboard(containerId, role) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const navigation = this.getRoleNavigation(role);
        const quickActions = this.getRoleQuickActions(role);
        const roleRoute = this.roleRoutes[role];
        
        container.innerHTML = `
            <div class="role-dashboard">
                <div class="dashboard-header">
                    <h1>${roleRoute.title}</h1>
                    <p>${roleRoute.description}</p>
                </div>
                
                ${quickActions.length > 0 ? `
                    <div class="quick-actions">
                        <h2>Quick Actions</h2>
                        <div class="actions-grid">
                            ${quickActions.map(action => `
                                <button class="action-card" data-action="${action.action}" style="border-left: 4px solid ${action.color};">
                                    <i data-lucide="${action.icon}" style="color: ${action.color};"></i>
                                    <span>${action.title}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${navigation.length > 0 ? `
                    <div class="role-navigation">
                        <h2>Navigation</h2>
                        <div class="nav-grid">
                            ${navigation.map(nav => `
                                <a href="${nav.path}" class="nav-card">
                                    <i data-lucide="${nav.icon}"></i>
                                    <span>${nav.title}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Add event listeners for quick actions
        container.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleQuickAction(btn.dataset.action, role);
            });
        });
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    handleQuickAction(action, role) {
        const actionHandlers = {
            createCase: () => window.location.href = 'cases.html?action=create',
            uploadEvidence: () => window.location.href = 'evidence-manager.html',
            searchCases: () => window.location.href = 'cases.html?action=search',
            analyzeEvidence: () => window.location.href = 'evidence-comparison.html',
            compareFiles: () => window.location.href = 'evidence-comparison.html?mode=compare',
            generateReport: () => window.location.href = 'reports.html?action=generate',
            reviewCase: () => window.location.href = 'cases.html?filter=pending-review',
            draftMotion: () => window.location.href = 'documents.html?action=draft',
            scheduleHearing: () => window.location.href = 'calendar.html?action=schedule',
            createUser: () => window.location.href = 'admin.html#create-user',
            systemStatus: () => window.location.href = 'system-health.html',
            viewLogs: () => window.location.href = 'audit-trail.html'
        };
        
        const handler = actionHandlers[action];
        if (handler) {
            handler();
        } else {
            console.warn(`No handler defined for action: ${action}`);
        }
    }

    // Method to add role-specific styles
    addRoleDashboardStyles() {
        if (document.getElementById('role-dashboard-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'role-dashboard-styles';
        styles.textContent = `
            .role-dashboard {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .dashboard-header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .dashboard-header h1 {
                color: #d32f2f;
                font-size: 2.5em;
                margin-bottom: 12px;
            }
            
            .dashboard-header p {
                color: #666;
                font-size: 1.2em;
            }
            
            .quick-actions, .role-navigation {
                margin: 40px 0;
            }
            
            .quick-actions h2, .role-navigation h2 {
                margin-bottom: 20px;
                color: #333;
                font-size: 1.5em;
            }
            
            .actions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
            }
            
            .action-card {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
            }
            
            .action-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .action-card i {
                width: 20px;
                height: 20px;
            }
            
            .action-card span {
                font-weight: 600;
                color: #333;
            }
            
            .nav-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 16px;
            }
            
            .nav-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
                padding: 20px;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                text-decoration: none;
                color: #333;
                transition: all 0.2s ease;
                text-align: center;
            }
            
            .nav-card:hover {
                border-color: #d32f2f;
                background: #fff5f5;
                transform: translateY(-2px);
            }
            
            .nav-card i {
                width: 24px;
                height: 24px;
                color: #d32f2f;
            }
            
            .nav-card span {
                font-weight: 600;
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Initialize the role landing system
document.addEventListener('DOMContentLoaded', () => {
    window.roleLandingSystem = new RoleLandingSystem();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoleLandingSystem;
}