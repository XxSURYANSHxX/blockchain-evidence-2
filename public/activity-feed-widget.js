/**
 * Consolidated Activity Feed Widget
 * Shows recent activities and system events on the main dashboard
 */

class ActivityFeedWidget {
    constructor() {
        this.maxActivities = 15;
        this.refreshInterval = 30000; // 30 seconds
        this.refreshTimer = null;
        this.activities = [];
        
        this.initializeWidget();
    }

    initializeWidget() {
        this.createWidgetStyles();
        this.loadActivities();
        this.startAutoRefresh();
    }

    createWidgetStyles() {
        if (document.getElementById('activity-feed-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'activity-feed-styles';
        styles.textContent = `
            .activity-feed-widget {
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                padding: 0;
                margin: 20px 0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            
            .activity-feed-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 1px solid #f0f0f0;
                background: #f8f9fa;
            }
            
            .activity-feed-title {
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 0;
                font-size: 1.2em;
                font-weight: 700;
                color: #333;
            }
            
            .activity-feed-title i {
                width: 20px;
                height: 20px;
                color: #d32f2f;
            }
            
            .activity-feed-controls {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .refresh-btn {
                background: none;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                padding: 6px 8px;
                cursor: pointer;
                color: #666;
                transition: all 0.2s ease;
            }
            
            .refresh-btn:hover {
                border-color: #d32f2f;
                color: #d32f2f;
            }
            
            .refresh-btn i {
                width: 16px;
                height: 16px;
            }
            
            .view-all-btn {
                background: #d32f2f;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 6px 12px;
                font-size: 0.9em;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .view-all-btn:hover {
                background: #b71c1c;
            }
            
            .view-all-btn i {
                width: 14px;
                height: 14px;
            }
            
            .activity-feed-content {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .activity-list {
                padding: 0;
                margin: 0;
                list-style: none;
            }
            
            .activity-item {
                display: flex;
                align-items: flex-start;
                gap: 16px;
                padding: 16px 24px;
                border-bottom: 1px solid #f0f0f0;
                transition: background 0.2s ease;
                cursor: pointer;
            }
            
            .activity-item:hover {
                background: #f8f9fa;
            }
            
            .activity-item:last-child {
                border-bottom: none;
            }
            
            .activity-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                position: relative;
            }
            
            .activity-icon.evidence {
                background: #e3f2fd;
                color: #1976d2;
            }
            
            .activity-icon.custody {
                background: #fff3e0;
                color: #f57c00;
            }
            
            .activity-icon.case {
                background: #e8f5e8;
                color: #388e3c;
            }
            
            .activity-icon.user {
                background: #f3e5f5;
                color: #7b1fa2;
            }
            
            .activity-icon.system {
                background: #fce4ec;
                color: #c2185b;
            }
            
            .activity-icon.approval {
                background: #e0f2f1;
                color: #00695c;
            }
            
            .activity-icon i {
                width: 18px;
                height: 18px;
            }
            
            .activity-badge {
                position: absolute;
                top: -2px;
                right: -2px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid white;
            }
            
            .activity-badge.new {
                background: #4caf50;
            }
            
            .activity-badge.urgent {
                background: #f44336;
            }
            
            .activity-content {
                flex: 1;
                min-width: 0;
            }
            
            .activity-title {
                font-weight: 600;
                color: #333;
                margin: 0 0 4px 0;
                font-size: 0.95em;
                line-height: 1.3;
            }
            
            .activity-description {
                color: #666;
                font-size: 0.9em;
                line-height: 1.4;
                margin: 0 0 8px 0;
            }
            
            .activity-meta {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 0.8em;
                color: #999;
            }
            
            .activity-time {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .activity-time i {
                width: 12px;
                height: 12px;
            }
            
            .activity-actor {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .activity-actor i {
                width: 12px;
                height: 12px;
            }
            
            .activity-link {
                color: #d32f2f;
                text-decoration: none;
                font-weight: 500;
            }
            
            .activity-link:hover {
                text-decoration: underline;
            }
            
            .activity-empty {
                text-align: center;
                padding: 40px 20px;
                color: #666;
            }
            
            .activity-empty i {
                width: 48px;
                height: 48px;
                color: #ccc;
                margin-bottom: 16px;
            }
            
            .activity-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px 20px;
                color: #666;
                gap: 12px;
            }
            
            .activity-loading i {
                width: 20px;
                height: 20px;
                animation: spin 1s linear infinite;
            }
            
            .activity-filters {
                display: flex;
                gap: 8px;
                padding: 16px 24px;
                border-bottom: 1px solid #f0f0f0;
                background: #fafafa;
            }
            
            .filter-btn {
                background: none;
                border: 1px solid #e0e0e0;
                border-radius: 16px;
                padding: 4px 12px;
                font-size: 0.8em;
                cursor: pointer;
                color: #666;
                transition: all 0.2s ease;
            }
            
            .filter-btn.active {
                background: #d32f2f;
                border-color: #d32f2f;
                color: white;
            }
            
            .filter-btn:hover:not(.active) {
                border-color: #d32f2f;
                color: #d32f2f;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .activity-feed-header {
                    flex-direction: column;
                    gap: 12px;
                    align-items: stretch;
                }
                
                .activity-feed-controls {
                    justify-content: space-between;
                }
                
                .activity-item {
                    padding: 12px 16px;
                }
                
                .activity-filters {
                    flex-wrap: wrap;
                    padding: 12px 16px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    renderWidget(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Activity feed container not found:', containerId);
            return;
        }

        container.innerHTML = `
            <div class="activity-feed-widget">
                <div class="activity-feed-header">
                    <h3 class="activity-feed-title">
                        <i data-lucide="activity"></i>
                        Recent Activity
                    </h3>
                    <div class="activity-feed-controls">
                        <button class="refresh-btn" id="refreshActivityFeed" title="Refresh">
                            <i data-lucide="refresh-cw"></i>
                        </button>
                        <a href="audit-trail.html" class="view-all-btn">
                            <i data-lucide="external-link"></i>
                            View All Activities
                        </a>
                    </div>
                </div>
                
                <div class="activity-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="evidence">Evidence</button>
                    <button class="filter-btn" data-filter="case">Cases</button>
                    <button class="filter-btn" data-filter="user">Users</button>
                    <button class="filter-btn" data-filter="system">System</button>
                </div>
                
                <div class="activity-feed-content">
                    <div class="activity-loading">
                        <i data-lucide="loader"></i>
                        Loading recent activities...
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners(container);
        this.renderActivities();

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    setupEventListeners(container) {
        // Refresh button
        const refreshBtn = container.querySelector('#refreshActivityFeed');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshActivities();
            });
        }

        // Filter buttons
        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterActivities(btn.dataset.filter);
            });
        });
    }

    async loadActivities() {
        try {
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Generate mock activities
            this.activities = this.generateMockActivities();
            
        } catch (error) {
            console.error('Failed to load activities:', error);
            this.activities = [];
        }
    }

    generateMockActivities() {
        const activityTypes = [
            {
                type: 'evidence',
                icon: 'upload',
                title: 'New evidence added in Case #ABC123',
                description: 'Digital forensic image uploaded by Investigator Johnson',
                actor: 'Investigator Johnson',
                link: 'cases.html?id=ABC123',
                priority: 'normal'
            },
            {
                type: 'custody',
                icon: 'link',
                title: 'Chain of custody updated by Inspector X in Case #DEF456',
                description: 'Evidence transferred from field office to central lab',
                actor: 'Inspector X',
                link: 'cases.html?id=DEF456',
                priority: 'normal'
            },
            {
                type: 'case',
                icon: 'folder',
                title: 'Case #GHI789 moved to Pending Court by Judge Y',
                description: 'Case status changed from Investigation to Court Review',
                actor: 'Judge Y',
                link: 'cases.html?id=GHI789',
                priority: 'high'
            },
            {
                type: 'approval',
                icon: 'check-circle',
                title: 'Your access request approved',
                description: 'Access to Case #JKL012 has been granted',
                actor: 'System Admin',
                link: 'cases.html?id=JKL012',
                priority: 'urgent'
            },
            {
                type: 'user',
                icon: 'user-plus',
                title: 'User role changed to Prosecutor',
                description: 'Role elevation approved by Administrator',
                actor: 'Administrator',
                link: 'profile.html',
                priority: 'normal'
            },
            {
                type: 'system',
                icon: 'shield',
                title: 'System backup completed successfully',
                description: 'Daily backup of all evidence data completed',
                actor: 'System',
                link: 'system-health.html',
                priority: 'normal'
            },
            {
                type: 'evidence',
                icon: 'search',
                title: 'Evidence analysis completed for Case #MNO345',
                description: 'Forensic analysis report generated and attached',
                actor: 'Forensic Analyst',
                link: 'cases.html?id=MNO345',
                priority: 'high'
            },
            {
                type: 'case',
                icon: 'calendar',
                title: 'Court hearing scheduled for Case #PQR678',
                description: 'Hearing scheduled for next Tuesday at 10:00 AM',
                actor: 'Court Clerk',
                link: 'calendar.html?case=PQR678',
                priority: 'urgent'
            },
            {
                type: 'system',
                icon: 'alert-triangle',
                title: 'Storage capacity warning',
                description: 'Evidence storage is 85% full, consider archiving old cases',
                actor: 'System Monitor',
                link: 'system-health.html',
                priority: 'high'
            },
            {
                type: 'user',
                icon: 'log-in',
                title: 'New user registration pending approval',
                description: 'Forensic Analyst application requires administrator review',
                actor: 'Registration System',
                link: 'admin.html#pending-users',
                priority: 'normal'
            }
        ];

        // Generate activities with random timestamps
        return activityTypes.map((template, index) => ({
            id: `activity_${Date.now()}_${index}`,
            ...template,
            timestamp: new Date(Date.now() - Math.random() * 86400000 * 7), // Last 7 days
            isNew: Math.random() > 0.7 // 30% chance of being "new"
        })).sort((a, b) => b.timestamp - a.timestamp);
    }

    renderActivities(filter = 'all') {
        const container = document.querySelector('.activity-feed-content');
        if (!container) return;

        let filteredActivities = this.activities;
        
        if (filter !== 'all') {
            filteredActivities = this.activities.filter(activity => activity.type === filter);
        }

        // Limit to max activities
        filteredActivities = filteredActivities.slice(0, this.maxActivities);

        if (filteredActivities.length === 0) {
            container.innerHTML = `
                <div class="activity-empty">
                    <i data-lucide="inbox"></i>
                    <p>No recent activities found</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <ul class="activity-list">
                    ${filteredActivities.map(activity => this.renderActivityItem(activity)).join('')}
                </ul>
            `;

            // Add click handlers for activity items
            container.querySelectorAll('.activity-item').forEach(item => {
                item.addEventListener('click', () => {
                    const link = item.dataset.link;
                    if (link) {
                        window.location.href = link;
                    }
                });
            });
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    renderActivityItem(activity) {
        const timeAgo = this.formatTimeAgo(activity.timestamp);
        const priorityBadge = activity.priority === 'urgent' ? 'urgent' : 
                             activity.isNew ? 'new' : '';

        return `
            <li class="activity-item" data-link="${activity.link}">
                <div class="activity-icon ${activity.type}">
                    <i data-lucide="${activity.icon}"></i>
                    ${priorityBadge ? `<div class="activity-badge ${priorityBadge}"></div>` : ''}
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-meta">
                        <div class="activity-time">
                            <i data-lucide="clock"></i>
                            ${timeAgo}
                        </div>
                        <div class="activity-actor">
                            <i data-lucide="user"></i>
                            ${activity.actor}
                        </div>
                    </div>
                </div>
            </li>
        `;
    }

    filterActivities(filter) {
        this.renderActivities(filter);
    }

    async refreshActivities() {
        const refreshBtn = document.querySelector('#refreshActivityFeed');
        if (refreshBtn) {
            const icon = refreshBtn.querySelector('i');
            icon.style.animation = 'spin 1s linear infinite';
        }

        try {
            await this.loadActivities();
            this.renderActivities();
            
            // Show success feedback
            if (window.blockchainFeedback) {
                window.blockchainFeedback.showToast('success', `
                    <i data-lucide="refresh-cw" style="width: 20px; height: 20px;"></i>
                    <div>Activity feed refreshed</div>
                `);
            }
        } catch (error) {
            console.error('Failed to refresh activities:', error);
            
            if (window.blockchainFeedback) {
                window.blockchainFeedback.showToast('error', `
                    <i data-lucide="x-circle" style="width: 20px; height: 20px;"></i>
                    <div>Failed to refresh activities</div>
                `);
            }
        } finally {
            if (refreshBtn) {
                const icon = refreshBtn.querySelector('i');
                icon.style.animation = '';
            }
        }
    }

    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }

        this.refreshTimer = setInterval(() => {
            this.loadActivities().then(() => {
                this.renderActivities();
            });
        }, this.refreshInterval);
    }

    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return new Date(date).toLocaleDateString();
    }

    // Method to add a new activity (for real-time updates)
    addActivity(activity) {
        activity.id = `activity_${Date.now()}_${Math.random()}`;
        activity.timestamp = new Date();
        activity.isNew = true;
        
        this.activities.unshift(activity);
        
        // Keep only the latest activities
        if (this.activities.length > this.maxActivities * 2) {
            this.activities = this.activities.slice(0, this.maxActivities * 2);
        }
        
        this.renderActivities();
    }

    // Cleanup method
    destroy() {
        this.stopAutoRefresh();
    }
}

// Global instance
window.activityFeedWidget = new ActivityFeedWidget();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ActivityFeedWidget;
}