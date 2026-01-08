/**
 * Empty States System for Dashboard Tables & Lists
 * Provides consistent, friendly empty-state experiences
 */

class EmptyStatesSystem {
    constructor() {
        this.emptyStates = {
            cases: {
                icon: 'folder-x',
                title: 'No Cases Yet',
                message: 'Start by creating your first case to begin managing evidence.',
                action: {
                    text: 'Create New Case',
                    handler: () => window.location.href = 'cases.html?action=create',
                    icon: 'plus-circle'
                },
                helpLink: {
                    text: 'Learn about case management',
                    url: 'documentation.html#cases'
                }
            },
            evidence: {
                icon: 'file-x',
                title: 'No Evidence Items',
                message: 'Upload digital evidence to start building your case.',
                action: {
                    text: 'Upload Evidence',
                    handler: () => window.location.href = 'evidence-manager.html',
                    icon: 'upload'
                },
                helpLink: {
                    text: 'Evidence upload guide',
                    url: 'documentation.html#evidence'
                }
            },
            users: {
                icon: 'users-x',
                title: 'No Users Found',
                message: 'Add team members to collaborate on cases and evidence.',
                action: {
                    text: 'Invite User',
                    handler: () => window.location.href = 'admin.html#create-user',
                    icon: 'user-plus'
                },
                helpLink: {
                    text: 'User management guide',
                    url: 'documentation.html#users'
                }
            },
            notifications: {
                icon: 'bell-off',
                title: 'No Notifications',
                message: 'You\'re all caught up! New notifications will appear here.',
                action: null,
                helpLink: {
                    text: 'Notification settings',
                    url: 'settings.html#notifications'
                }
            },
            activities: {
                icon: 'activity',
                title: 'No Recent Activity',
                message: 'System activities and user actions will be logged here.',
                action: {
                    text: 'View All Logs',
                    handler: () => window.location.href = 'audit-trail.html',
                    icon: 'external-link'
                },
                helpLink: null
            },
            search: {
                icon: 'search-x',
                title: 'No Results Found',
                message: 'Try adjusting your search criteria or filters.',
                action: {
                    text: 'Clear Filters',
                    handler: () => this.clearSearchFilters(),
                    icon: 'x-circle'
                },
                helpLink: {
                    text: 'Search tips',
                    url: 'documentation.html#search'
                }
            },
            reports: {
                icon: 'file-text',
                title: 'No Reports Generated',
                message: 'Create reports to analyze case data and evidence.',
                action: {
                    text: 'Generate Report',
                    handler: () => window.location.href = 'reports.html?action=create',
                    icon: 'file-plus'
                },
                helpLink: {
                    text: 'Report generation guide',
                    url: 'documentation.html#reports'
                }
            },
            tags: {
                icon: 'tag',
                title: 'No Tags Available',
                message: 'Create tags to organize and categorize your evidence.',
                action: {
                    text: 'Create Tag',
                    handler: () => this.showCreateTagDialog(),
                    icon: 'plus'
                },
                helpLink: {
                    text: 'Tagging system guide',
                    url: 'documentation.html#tags'
                }
            },
            timeline: {
                icon: 'clock',
                title: 'No Timeline Events',
                message: 'Case timeline will show important events and milestones.',
                action: null,
                helpLink: {
                    text: 'Understanding timelines',
                    url: 'documentation.html#timeline'
                }
            },
            approvals: {
                icon: 'clock',
                title: 'No Pending Approvals',
                message: 'Role change requests and other approvals will appear here.',
                action: null,
                helpLink: {
                    text: 'Approval workflow guide',
                    url: 'documentation.html#approvals'
                }
            }
        };
        
        this.initializeStyles();
    }

    initializeStyles() {
        if (document.getElementById('empty-states-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'empty-states-styles';
        styles.textContent = `
            .empty-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 60px 40px;
                background: white;
                border-radius: 12px;
                border: 2px dashed #e0e0e0;
                margin: 20px 0;
                min-height: 300px;
                transition: all 0.3s ease;
            }
            
            .empty-state:hover {
                border-color: #d32f2f;
                background: #fff5f5;
            }
            
            .empty-state-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 24px;
                transition: all 0.3s ease;
            }
            
            .empty-state:hover .empty-state-icon {
                background: linear-gradient(135deg, #ffebee, #ffcdd2);
                transform: scale(1.05);
            }
            
            .empty-state-icon i {
                width: 40px;
                height: 40px;
                color: #999;
                transition: color 0.3s ease;
            }
            
            .empty-state:hover .empty-state-icon i {
                color: #d32f2f;
            }
            
            .empty-state-title {
                font-size: 1.5em;
                font-weight: 700;
                color: #333;
                margin: 0 0 12px 0;
            }
            
            .empty-state-message {
                font-size: 1.1em;
                color: #666;
                line-height: 1.6;
                margin: 0 0 32px 0;
                max-width: 400px;
            }
            
            .empty-state-actions {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16px;
            }
            
            .empty-state-action {
                display: flex;
                align-items: center;
                gap: 8px;
                background: #d32f2f;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                font-size: 1em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
                box-shadow: 0 2px 8px rgba(211, 47, 47, 0.2);
            }
            
            .empty-state-action:hover {
                background: #b71c1c;
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(211, 47, 47, 0.3);
            }
            
            .empty-state-action i {
                width: 18px;
                height: 18px;
            }
            
            .empty-state-help {
                color: #666;
                text-decoration: none;
                font-size: 0.9em;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: color 0.2s ease;
            }
            
            .empty-state-help:hover {
                color: #d32f2f;
                text-decoration: underline;
            }
            
            .empty-state-help i {
                width: 14px;
                height: 14px;
            }
            
            /* Compact empty state for smaller containers */
            .empty-state-compact {
                padding: 40px 20px;
                min-height: 200px;
                border: 1px dashed #e0e0e0;
            }
            
            .empty-state-compact .empty-state-icon {
                width: 60px;
                height: 60px;
                margin-bottom: 16px;
            }
            
            .empty-state-compact .empty-state-icon i {
                width: 30px;
                height: 30px;
            }
            
            .empty-state-compact .empty-state-title {
                font-size: 1.2em;
                margin-bottom: 8px;
            }
            
            .empty-state-compact .empty-state-message {
                font-size: 1em;
                margin-bottom: 20px;
            }
            
            /* Inline empty state for table rows */
            .empty-state-inline {
                padding: 40px 20px;
                background: #f8f9fa;
                border: none;
                border-radius: 8px;
                margin: 0;
                min-height: auto;
            }
            
            .empty-state-inline .empty-state-icon {
                width: 48px;
                height: 48px;
                margin-bottom: 12px;
            }
            
            .empty-state-inline .empty-state-icon i {
                width: 24px;
                height: 24px;
            }
            
            .empty-state-inline .empty-state-title {
                font-size: 1.1em;
                margin-bottom: 6px;
            }
            
            .empty-state-inline .empty-state-message {
                font-size: 0.9em;
                margin-bottom: 16px;
            }
            
            .empty-state-inline .empty-state-action {
                padding: 8px 16px;
                font-size: 0.9em;
            }
            
            /* Loading state */
            .empty-state-loading {
                border: 1px solid #e0e0e0;
                background: white;
            }
            
            .empty-state-loading .empty-state-icon {
                background: #f0f0f0;
            }
            
            .empty-state-loading .empty-state-icon i {
                animation: spin 1s linear infinite;
                color: #666;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .empty-state {
                    padding: 40px 20px;
                    min-height: 250px;
                }
                
                .empty-state-icon {
                    width: 60px;
                    height: 60px;
                    margin-bottom: 20px;
                }
                
                .empty-state-icon i {
                    width: 30px;
                    height: 30px;
                }
                
                .empty-state-title {
                    font-size: 1.3em;
                }
                
                .empty-state-message {
                    font-size: 1em;
                }
                
                .empty-state-actions {
                    width: 100%;
                }
                
                .empty-state-action {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    render(containerId, stateType, customConfig = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Empty state container not found:', containerId);
            return;
        }

        const config = { ...this.emptyStates[stateType], ...customConfig };
        if (!config) {
            console.error('Unknown empty state type:', stateType);
            return;
        }

        const compactClass = customConfig.compact ? 'empty-state-compact' : '';
        const inlineClass = customConfig.inline ? 'empty-state-inline' : '';
        const loadingClass = customConfig.loading ? 'empty-state-loading' : '';

        container.innerHTML = `
            <div class="empty-state ${compactClass} ${inlineClass} ${loadingClass}">
                <div class="empty-state-icon">
                    <i data-lucide="${config.loading ? 'loader' : config.icon}"></i>
                </div>
                <h3 class="empty-state-title">${config.loading ? 'Loading...' : config.title}</h3>
                <p class="empty-state-message">${config.loading ? 'Please wait while we load your data.' : config.message}</p>
                
                ${!config.loading && (config.action || config.helpLink) ? `
                    <div class="empty-state-actions">
                        ${config.action ? `
                            <button class="empty-state-action" data-action="${stateType}">
                                <i data-lucide="${config.action.icon}"></i>
                                ${config.action.text}
                            </button>
                        ` : ''}
                        
                        ${config.helpLink ? `
                            <a href="${config.helpLink.url}" class="empty-state-help" target="_blank">
                                <i data-lucide="help-circle"></i>
                                ${config.helpLink.text}
                            </a>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        // Add event listener for action button
        const actionBtn = container.querySelector('[data-action]');
        if (actionBtn && config.action && config.action.handler) {
            actionBtn.addEventListener('click', config.action.handler);
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Utility method to show loading state
    showLoading(containerId, message = 'Loading...') {
        this.render(containerId, 'loading', {
            loading: true,
            title: 'Loading...',
            message: message,
            icon: 'loader'
        });
    }

    // Utility method to replace table content with empty state
    replaceTableContent(tableId, stateType, customConfig = {}) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        // Count columns for proper colspan
        const headerRow = table.querySelector('thead tr');
        const colCount = headerRow ? headerRow.children.length : 1;

        const config = { ...this.emptyStates[stateType], ...customConfig };
        
        tbody.innerHTML = `
            <tr>
                <td colspan="${colCount}" style="padding: 0; border: none;">
                    <div class="empty-state empty-state-inline">
                        <div class="empty-state-icon">
                            <i data-lucide="${config.icon}"></i>
                        </div>
                        <h3 class="empty-state-title">${config.title}</h3>
                        <p class="empty-state-message">${config.message}</p>
                        
                        ${config.action ? `
                            <div class="empty-state-actions">
                                <button class="empty-state-action" onclick="(${config.action.handler.toString()})()">
                                    <i data-lucide="${config.action.icon}"></i>
                                    ${config.action.text}
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Utility method to replace list content with empty state
    replaceListContent(listId, stateType, customConfig = {}) {
        const list = document.getElementById(listId);
        if (!list) return;

        const config = { ...this.emptyStates[stateType], ...customConfig };
        
        list.innerHTML = `
            <li style="list-style: none; padding: 0;">
                <div class="empty-state empty-state-compact">
                    <div class="empty-state-icon">
                        <i data-lucide="${config.icon}"></i>
                    </div>
                    <h3 class="empty-state-title">${config.title}</h3>
                    <p class="empty-state-message">${config.message}</p>
                    
                    ${config.action ? `
                        <div class="empty-state-actions">
                            <button class="empty-state-action" onclick="(${config.action.handler.toString()})()">
                                <i data-lucide="${config.action.icon}"></i>
                                ${config.action.text}
                            </button>
                        </div>
                    ` : ''}
                </div>
            </li>
        `;

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Method to create custom empty state
    createCustom(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const defaultConfig = {
            icon: 'inbox',
            title: 'No Data Available',
            message: 'There is no data to display at this time.',
            action: null,
            helpLink: null
        };

        const finalConfig = { ...defaultConfig, ...config };
        
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i data-lucide="${finalConfig.icon}"></i>
                </div>
                <h3 class="empty-state-title">${finalConfig.title}</h3>
                <p class="empty-state-message">${finalConfig.message}</p>
                
                ${finalConfig.action || finalConfig.helpLink ? `
                    <div class="empty-state-actions">
                        ${finalConfig.action ? `
                            <button class="empty-state-action" onclick="(${finalConfig.action.handler.toString()})()">
                                <i data-lucide="${finalConfig.action.icon}"></i>
                                ${finalConfig.action.text}
                            </button>
                        ` : ''}
                        
                        ${finalConfig.helpLink ? `
                            <a href="${finalConfig.helpLink.url}" class="empty-state-help" target="_blank">
                                <i data-lucide="help-circle"></i>
                                ${finalConfig.helpLink.text}
                            </a>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Helper methods for common actions
    clearSearchFilters() {
        // Clear search inputs
        document.querySelectorAll('input[type="search"], input[name*="search"], input[name*="filter"]').forEach(input => {
            input.value = '';
        });
        
        // Clear select filters
        document.querySelectorAll('select[name*="filter"]').forEach(select => {
            select.selectedIndex = 0;
        });
        
        // Trigger search/filter update
        const searchEvent = new Event('input', { bubbles: true });
        document.querySelectorAll('input[type="search"]').forEach(input => {
            input.dispatchEvent(searchEvent);
        });
        
        // Show success message
        if (window.blockchainFeedback) {
            window.blockchainFeedback.showToast('info', `
                <i data-lucide="filter-x" style="width: 20px; height: 20px;"></i>
                <div>Search filters cleared</div>
            `);
        }
    }

    showCreateTagDialog() {
        // This would integrate with the tagging system
        if (window.tagManager) {
            window.tagManager.showCreateDialog();
        } else {
            alert('Tag creation feature not available');
        }
    }

    // Method to check if container should show empty state
    shouldShowEmptyState(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return false;

        // Check for common indicators of empty content
        const table = container.querySelector('table tbody');
        const list = container.querySelector('ul, ol');
        const cards = container.querySelectorAll('.card, .item');

        if (table && table.children.length === 0) return true;
        if (list && list.children.length === 0) return true;
        if (cards.length === 0) return true;

        return false;
    }
}

// Global instance
window.emptyStatesSystem = new EmptyStatesSystem();

// Auto-initialize empty states on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Auto-detect and apply empty states to common containers
    const commonContainers = [
        { selector: '#casesTable tbody', type: 'cases' },
        { selector: '#evidenceList', type: 'evidence' },
        { selector: '#usersList', type: 'users' },
        { selector: '#notificationsList', type: 'notifications' },
        { selector: '#activitiesList', type: 'activities' },
        { selector: '#reportsList', type: 'reports' }
    ];

    commonContainers.forEach(({ selector, type }) => {
        const element = document.querySelector(selector);
        if (element && element.children.length === 0) {
            const containerId = element.id || element.parentElement.id;
            if (containerId) {
                window.emptyStatesSystem.render(containerId, type);
            }
        }
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmptyStatesSystem;
}