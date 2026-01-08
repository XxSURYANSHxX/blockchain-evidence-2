/**
 * System Health Dashboard JavaScript
 * Handles real-time monitoring and status updates
 */

class SystemHealthDashboard {
    constructor() {
        this.autoRefreshEnabled = true;
        this.refreshInterval = 60; // seconds
        this.refreshTimer = null;
        this.countdownTimer = null;
        this.lastUpdateTime = null;
        
        this.initializeEventListeners();
        this.startAutoRefresh();
        this.loadInitialData();
    }

    initializeEventListeners() {
        // Refresh controls
        document.getElementById('refreshNow').addEventListener('click', () => {
            this.refreshAllData();
        });

        document.getElementById('toggleAutoRefresh').addEventListener('click', () => {
            this.toggleAutoRefresh();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // System actions
        document.getElementById('clearCacheBtn').addEventListener('click', () => {
            this.performSystemAction('clearCache');
        });

        document.getElementById('restartServicesBtn').addEventListener('click', () => {
            this.performSystemAction('restartServices');
        });

        document.getElementById('exportLogsBtn').addEventListener('click', () => {
            this.performSystemAction('exportLogs');
        });

        document.getElementById('runDiagnosticsBtn').addEventListener('click', () => {
            this.performSystemAction('runDiagnostics');
        });
    }

    async loadInitialData() {
        // Set current wallet
        const currentWallet = localStorage.getItem('currentUser') || 'Unknown';
        document.getElementById('currentWallet').textContent = 
            currentWallet.length > 10 ? currentWallet.substring(0, 8) + '...' : currentWallet;

        // Load all system data
        await this.refreshAllData();
    }

    async refreshAllData() {
        try {
            this.showRefreshIndicator();
            
            // Parallel data loading
            await Promise.all([
                this.checkBlockchainStatus(),
                this.checkDatabaseStatus(),
                this.checkStorageStatus(),
                this.checkAPIStatus(),
                this.loadSystemMetrics(),
                this.loadRecentEvents()
            ]);

            this.updateOverallStatus();
            this.updateLastRefreshTime();
            
        } catch (error) {
            console.error('Failed to refresh system data:', error);
            this.showError('Failed to refresh system data');
        } finally {
            this.hideRefreshIndicator();
        }
    }

    async checkBlockchainStatus() {
        try {
            // Simulate blockchain status check
            const status = await this.simulateAsyncCheck('blockchain');
            
            const indicator = document.getElementById('blockchainIndicator').querySelector('.status-dot');
            const elements = {
                networkName: document.getElementById('networkName'),
                chainId: document.getElementById('chainId'),
                lastBlock: document.getElementById('lastBlock'),
                lastTransaction: document.getElementById('lastTransaction'),
                contractAddress: document.getElementById('contractAddress')
            };

            if (status.online) {
                indicator.className = 'status-dot online';
                elements.networkName.textContent = 'Ethereum Mainnet';
                elements.chainId.textContent = '1';
                elements.lastBlock.textContent = `#${status.blockNumber}`;
                elements.lastTransaction.textContent = this.formatTimeAgo(status.lastTxTime);
                elements.contractAddress.textContent = '0x742d35Cc6634C0532925a3b8D';
            } else {
                indicator.className = 'status-dot offline';
                Object.values(elements).forEach(el => el.textContent = 'Unavailable');
            }

            return status;
        } catch (error) {
            console.error('Blockchain status check failed:', error);
            return { online: false, error: error.message };
        }
    }

    async checkDatabaseStatus() {
        try {
            const status = await this.simulateAsyncCheck('database');
            
            const indicator = document.getElementById('databaseIndicator').querySelector('.status-dot');
            const elements = {
                dbConnection: document.getElementById('dbConnection'),
                lastQuery: document.getElementById('lastQuery'),
                dbResponseTime: document.getElementById('dbResponseTime'),
                activeConnections: document.getElementById('activeConnections')
            };

            if (status.online) {
                indicator.className = 'status-dot online';
                elements.dbConnection.textContent = 'Connected';
                elements.lastQuery.textContent = this.formatTimeAgo(status.lastQuery);
                elements.dbResponseTime.textContent = `${status.responseTime}ms`;
                elements.activeConnections.textContent = status.connections;
            } else {
                indicator.className = 'status-dot offline';
                elements.dbConnection.textContent = 'Disconnected';
                elements.lastQuery.textContent = 'N/A';
                elements.dbResponseTime.textContent = 'N/A';
                elements.activeConnections.textContent = '0';
            }

            return status;
        } catch (error) {
            console.error('Database status check failed:', error);
            return { online: false, error: error.message };
        }
    }

    async checkStorageStatus() {
        try {
            const status = await this.simulateAsyncCheck('storage');
            
            const indicator = document.getElementById('storageIndicator').querySelector('.status-dot');
            const elements = {
                storageProvider: document.getElementById('storageProvider'),
                lastUpload: document.getElementById('lastUpload'),
                storageUsed: document.getElementById('storageUsed'),
                availableSpace: document.getElementById('availableSpace')
            };

            if (status.online) {
                indicator.className = 'status-dot online';
                elements.storageProvider.textContent = 'Supabase Storage';
                elements.lastUpload.textContent = this.formatTimeAgo(status.lastUpload);
                elements.storageUsed.textContent = this.formatBytes(status.used);
                elements.availableSpace.textContent = this.formatBytes(status.available);
            } else {
                indicator.className = 'status-dot offline';
                Object.values(elements).forEach(el => el.textContent = 'Unavailable');
            }

            return status;
        } catch (error) {
            console.error('Storage status check failed:', error);
            return { online: false, error: error.message };
        }
    }

    async checkAPIStatus() {
        try {
            const startTime = Date.now();
            
            // Actual API health check
            const response = await fetch('/api/health');
            const responseTime = Date.now() - startTime;
            const status = response.ok;
            
            const indicator = document.getElementById('apiIndicator').querySelector('.status-dot');
            const elements = {
                serverStatus: document.getElementById('serverStatus'),
                apiResponseTime: document.getElementById('apiResponseTime'),
                serverUptime: document.getElementById('serverUptime'),
                activeSessions: document.getElementById('activeSessions')
            };

            if (status) {
                indicator.className = 'status-dot online';
                elements.serverStatus.textContent = 'Online';
                elements.apiResponseTime.textContent = `${responseTime}ms`;
                elements.serverUptime.textContent = this.calculateUptime();
                elements.activeSessions.textContent = Math.floor(Math.random() * 50) + 10;
            } else {
                indicator.className = 'status-dot offline';
                elements.serverStatus.textContent = 'Offline';
                elements.apiResponseTime.textContent = 'N/A';
                elements.serverUptime.textContent = 'N/A';
                elements.activeSessions.textContent = '0';
            }

            return { online: status, responseTime };
        } catch (error) {
            console.error('API status check failed:', error);
            
            const indicator = document.getElementById('apiIndicator').querySelector('.status-dot');
            indicator.className = 'status-dot offline';
            
            return { online: false, error: error.message };
        }
    }

    async loadSystemMetrics() {
        try {
            // Simulate metrics loading
            const metrics = await this.simulateMetricsLoad();
            
            // Update uptime statistics
            document.getElementById('uptime24h').textContent = metrics.uptime24h + '%';
            document.getElementById('uptime7d').textContent = metrics.uptime7d + '%';
            document.getElementById('uptime30d').textContent = metrics.uptime30d + '%';
            
            // Update performance metrics
            document.getElementById('avgResponseTime').textContent = metrics.avgResponseTime + 'ms';
            document.getElementById('requestsPerMin').textContent = metrics.requestsPerMin;
            document.getElementById('errorRate').textContent = metrics.errorRate + '%';
            
        } catch (error) {
            console.error('Failed to load system metrics:', error);
        }
    }

    async loadRecentEvents() {
        try {
            const [errors, activities] = await Promise.all([
                this.loadRecentErrors(),
                this.loadSystemActivities()
            ]);
            
            this.renderEventsList('errorsList', errors);
            this.renderEventsList('activitiesList', activities);
            
        } catch (error) {
            console.error('Failed to load recent events:', error);
        }
    }

    async loadRecentErrors() {
        // Simulate error loading
        return [
            {
                type: 'error',
                title: 'Database Connection Timeout',
                description: 'Connection to primary database timed out after 30 seconds',
                timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
                source: 'Database'
            },
            {
                type: 'warning',
                title: 'High Memory Usage',
                description: 'System memory usage exceeded 85% threshold',
                timestamp: new Date(Date.now() - 3600000), // 1 hour ago
                source: 'System Monitor'
            },
            {
                type: 'error',
                title: 'Failed Evidence Upload',
                description: 'Evidence upload failed due to storage quota exceeded',
                timestamp: new Date(Date.now() - 7200000), // 2 hours ago
                source: 'Storage Service'
            }
        ];
    }

    async loadSystemActivities() {
        // Simulate activity loading
        return [
            {
                type: 'success',
                title: 'System Backup Completed',
                description: 'Daily system backup completed successfully',
                timestamp: new Date(Date.now() - 900000), // 15 minutes ago
                source: 'Backup Service'
            },
            {
                type: 'info',
                title: 'User Session Started',
                description: 'New administrator session initiated',
                timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
                source: 'Authentication'
            },
            {
                type: 'info',
                title: 'Cache Cleared',
                description: 'System cache cleared by administrator',
                timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
                source: 'System Admin'
            }
        ];
    }

    renderEventsList(containerId, events) {
        const container = document.getElementById(containerId);
        
        if (events.length === 0) {
            container.innerHTML = `
                <div class="loading-placeholder">
                    <i data-lucide="check-circle"></i>
                    No recent events
                </div>
            `;
        } else {
            container.innerHTML = events.map(event => `
                <div class="event-item">
                    <div class="event-icon ${event.type}">
                        <i data-lucide="${this.getEventIcon(event.type)}"></i>
                    </div>
                    <div class="event-content">
                        <div class="event-title">${event.title}</div>
                        <div class="event-description">${event.description}</div>
                        <div class="event-meta">
                            <span>${this.formatTimeAgo(event.timestamp)}</span>
                            <span>Source: ${event.source}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    getEventIcon(type) {
        const icons = {
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info',
            success: 'check-circle'
        };
        return icons[type] || 'info';
    }

    updateOverallStatus() {
        const statusElements = document.querySelectorAll('.status-dot');
        let onlineCount = 0;
        let totalCount = 0;
        
        statusElements.forEach(dot => {
            if (!dot.classList.contains('checking')) {
                totalCount++;
                if (dot.classList.contains('online')) {
                    onlineCount++;
                }
            }
        });
        
        const overallStatusValue = document.getElementById('overallStatusValue');
        const overallStatusDesc = document.getElementById('overallStatusDesc');
        const overallStatusCard = document.getElementById('overallStatus');
        
        if (onlineCount === totalCount) {
            overallStatusValue.textContent = 'All Systems Operational';
            overallStatusDesc.textContent = 'All system components are functioning normally';
            overallStatusCard.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        } else if (onlineCount > totalCount / 2) {
            overallStatusValue.textContent = 'Partial System Issues';
            overallStatusDesc.textContent = `${totalCount - onlineCount} of ${totalCount} components experiencing issues`;
            overallStatusCard.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        } else {
            overallStatusValue.textContent = 'Major System Issues';
            overallStatusDesc.textContent = 'Multiple system components are offline';
            overallStatusCard.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName + 'Tab');
        });
    }

    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
        
        if (this.autoRefreshEnabled) {
            this.refreshTimer = setInterval(() => {
                this.refreshAllData();
            }, this.refreshInterval * 1000);
            
            this.startCountdown();
        }
    }

    startCountdown() {
        let countdown = this.refreshInterval;
        const countdownElement = document.getElementById('refreshCountdown');
        
        this.countdownTimer = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                countdown = this.refreshInterval;
            }
        }, 1000);
    }

    toggleAutoRefresh() {
        this.autoRefreshEnabled = !this.autoRefreshEnabled;
        const button = document.getElementById('toggleAutoRefresh');
        const icon = button.querySelector('i');
        
        if (this.autoRefreshEnabled) {
            button.innerHTML = '<i data-lucide="pause"></i> Pause Auto-refresh';
            this.startAutoRefresh();
        } else {
            button.innerHTML = '<i data-lucide="play"></i> Resume Auto-refresh';
            if (this.refreshTimer) clearInterval(this.refreshTimer);
            if (this.countdownTimer) clearInterval(this.countdownTimer);
            document.getElementById('refreshCountdown').textContent = '--';
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    showRefreshIndicator() {
        const indicator = document.getElementById('refreshIndicator');
        indicator.style.opacity = '0.6';
    }

    hideRefreshIndicator() {
        const indicator = document.getElementById('refreshIndicator');
        indicator.style.opacity = '1';
    }

    updateLastRefreshTime() {
        this.lastUpdateTime = new Date();
        document.getElementById('lastUpdated').textContent = 
            `Last updated: ${this.lastUpdateTime.toLocaleTimeString()}`;
    }

    async performSystemAction(action) {
        const actionMap = {
            clearCache: 'Clear System Cache',
            restartServices: 'Restart Services',
            exportLogs: 'Export System Logs',
            runDiagnostics: 'Run System Diagnostics'
        };
        
        const actionName = actionMap[action];
        
        if (!confirm(`Are you sure you want to ${actionName.toLowerCase()}?`)) {
            return;
        }
        
        try {
            // Show loading state
            if (window.blockchainFeedback) {
                window.blockchainFeedback.showToast('info', `
                    <i data-lucide="loader" style="width: 20px; height: 20px; animation: spin 1s linear infinite;"></i>
                    <div>${actionName} in progress...</div>
                `);
            }
            
            // Simulate action execution
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Handle specific actions
            switch (action) {
                case 'exportLogs':
                    this.downloadSystemLogs();
                    break;
                case 'runDiagnostics':
                    await this.runSystemDiagnostics();
                    break;
                default:
                    // Generic success
                    break;
            }
            
            // Show success
            if (window.blockchainFeedback) {
                window.blockchainFeedback.showToast('success', `
                    <i data-lucide="check-circle" style="width: 20px; height: 20px;"></i>
                    <div>${actionName} completed successfully</div>
                `);
            }
            
            // Refresh data after action
            setTimeout(() => this.refreshAllData(), 1000);
            
        } catch (error) {
            console.error(`${actionName} failed:`, error);
            
            if (window.blockchainFeedback) {
                window.blockchainFeedback.showToast('error', `
                    <i data-lucide="x-circle" style="width: 20px; height: 20px;"></i>
                    <div>${actionName} failed: ${error.message}</div>
                `);
            }
        }
    }

    downloadSystemLogs() {
        const logs = this.generateSystemLogs();
        const blob = new Blob([logs], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-logs-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    generateSystemLogs() {
        const timestamp = new Date().toISOString();
        return `EVID-DGC System Logs Export
Generated: ${timestamp}

=== SYSTEM STATUS ===
Blockchain: Online
Database: Online
Storage: Online
API: Online

=== RECENT ACTIVITIES ===
${timestamp} - System logs exported by administrator
${new Date(Date.now() - 900000).toISOString()} - System backup completed
${new Date(Date.now() - 1800000).toISOString()} - Database connection restored
${new Date(Date.now() - 3600000).toISOString()} - High memory usage warning

=== PERFORMANCE METRICS ===
Average Response Time: 150ms
Requests per Minute: 45
Error Rate: 0.2%
Uptime (24h): 99.8%

=== END OF LOGS ===`;
    }

    async runSystemDiagnostics() {
        // Simulate comprehensive diagnostics
        const diagnostics = [
            'Checking database connections...',
            'Verifying blockchain connectivity...',
            'Testing storage access...',
            'Validating API endpoints...',
            'Analyzing system performance...',
            'Checking security configurations...',
            'Verifying backup integrity...'
        ];
        
        for (const check of diagnostics) {
            console.log(check);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        return {
            status: 'completed',
            issues: 0,
            warnings: 1,
            recommendations: ['Consider increasing memory allocation']
        };
    }

    // Utility methods
    async simulateAsyncCheck(service) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
        
        const mockData = {
            blockchain: {
                online: Math.random() > 0.1,
                blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
                lastTxTime: new Date(Date.now() - Math.random() * 3600000)
            },
            database: {
                online: Math.random() > 0.05,
                lastQuery: new Date(Date.now() - Math.random() * 60000),
                responseTime: Math.floor(Math.random() * 100) + 50,
                connections: Math.floor(Math.random() * 20) + 5
            },
            storage: {
                online: Math.random() > 0.05,
                lastUpload: new Date(Date.now() - Math.random() * 1800000),
                used: Math.floor(Math.random() * 1000000000) + 500000000,
                available: Math.floor(Math.random() * 2000000000) + 1000000000
            }
        };
        
        return mockData[service] || { online: true };
    }

    async simulateMetricsLoad() {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            uptime24h: (99.5 + Math.random() * 0.5).toFixed(1),
            uptime7d: (99.2 + Math.random() * 0.8).toFixed(1),
            uptime30d: (98.8 + Math.random() * 1.2).toFixed(1),
            avgResponseTime: Math.floor(Math.random() * 100) + 100,
            requestsPerMin: Math.floor(Math.random() * 50) + 20,
            errorRate: (Math.random() * 0.5).toFixed(2)
        };
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
        return `${diffDays}d ago`;
    }

    formatBytes(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    calculateUptime() {
        // Mock uptime calculation
        const days = Math.floor(Math.random() * 30) + 1;
        const hours = Math.floor(Math.random() * 24);
        return `${days}d ${hours}h`;
    }

    showError(message) {
        if (window.blockchainFeedback) {
            window.blockchainFeedback.showToast('error', `
                <i data-lucide="x-circle" style="width: 20px; height: 20px;"></i>
                <div>${message}</div>
            `);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.systemHealthDashboard = new SystemHealthDashboard();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});