/**
 * Multi-Step Approval System for Role Changes
 * Handles approval workflow for sensitive operations
 */

class RoleChangeApproval {
    constructor() {
        this.pendingRequests = new Map();
        this.initializeStyles();
        this.loadPendingRequests();
    }

    initializeStyles() {
        if (!document.getElementById('approval-system-styles')) {
            const styles = document.createElement('style');
            styles.id = 'approval-system-styles';
            styles.textContent = `
                .approval-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .approval-modal.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .approval-content {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                }
                
                .approval-modal.show .approval-content {
                    transform: scale(1);
                }
                
                .approval-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .approval-icon {
                    width: 40px;
                    height: 40px;
                    background: #fff3cd;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #856404;
                }
                
                .change-summary {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 16px 0;
                }
                
                .change-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 8px 0;
                }
                
                .role-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    font-weight: 600;
                    color: white;
                }
                
                .role-badge.current {
                    background: #6c757d;
                }
                
                .role-badge.new {
                    background: #d32f2f;
                }
                
                .approval-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 24px;
                }
                
                .pending-requests-panel {
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 20px 0;
                }
                
                .request-item {
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 12px 0;
                    background: #f8f9fa;
                }
                
                .request-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 12px;
                }
                
                .request-meta {
                    font-size: 0.9em;
                    color: #666;
                }
                
                .request-actions {
                    display: flex;
                    gap: 8px;
                    margin-top: 12px;
                }
                
                .approval-badge {
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.7em;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .approval-badge.pending {
                    background: #fff3cd;
                    color: #856404;
                }
                
                .approval-badge.approved {
                    background: #d4edda;
                    color: #155724;
                }
                
                .approval-badge.rejected {
                    background: #f8d7da;
                    color: #721c24;
                }
                
                .rejection-reason {
                    margin-top: 12px;
                    padding: 8px;
                    background: #fff5f5;
                    border: 1px solid #fed7d7;
                    border-radius: 4px;
                    font-size: 0.9em;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    async requestRoleChange(requestingAdmin, targetUser, currentRole, newRole, reason = '') {
        // Prevent self-approval
        if (requestingAdmin === targetUser) {
            throw new Error('Administrators cannot change their own role');
        }

        // Check if high-privilege role change
        const highPrivilegeRoles = ['admin', 'auditor', 'evidence_manager'];
        const requiresApproval = highPrivilegeRoles.includes(newRole) || 
                               highPrivilegeRoles.includes(currentRole);

        if (!requiresApproval) {
            // Direct role change for low-privilege roles
            return await this.executeRoleChange(targetUser, newRole, requestingAdmin);
        }

        // Create approval request
        const requestId = this.generateRequestId();
        const request = {
            id: requestId,
            requestingAdmin,
            targetUser,
            currentRole,
            newRole,
            reason,
            status: 'pending',
            createdAt: new Date().toISOString(),
            approvedBy: null,
            approvedAt: null,
            rejectionReason: null
        };

        // Store request
        this.pendingRequests.set(requestId, request);
        this.savePendingRequests();

        // Notify other admins
        await this.notifyAdminsOfRequest(request);

        // Show confirmation to requesting admin
        if (window.blockchainFeedback) {
            window.blockchainFeedback.showToast('info', `
                <i data-lucide="clock" style="width: 20px; height: 20px;"></i>
                <div>Role change request submitted for approval</div>
            `);
        }

        return { requestId, status: 'pending' };
    }

    async showApprovalDialog(requestId) {
        const request = this.pendingRequests.get(requestId);
        if (!request) {
            throw new Error('Request not found');
        }

        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'approval-modal';
            modal.innerHTML = `
                <div class="approval-content">
                    <div class="approval-header">
                        <div class="approval-icon">
                            <i data-lucide="shield-alert" style="width: 20px; height: 20px;"></i>
                        </div>
                        <div>
                            <h3 style="margin: 0;">Role Change Approval Required</h3>
                            <p style="margin: 4px 0 0 0; color: #666; font-size: 0.9em;">
                                Requested by: ${request.requestingAdmin.substring(0, 8)}...
                            </p>
                        </div>
                    </div>
                    
                    <div class="change-summary">
                        <h4 style="margin: 0 0 12px 0;">Proposed Changes</h4>
                        <div class="change-item">
                            <span>Target User:</span>
                            <code>${request.targetUser.substring(0, 8)}...</code>
                        </div>
                        <div class="change-item">
                            <span>Current Role:</span>
                            <span class="role-badge current">${request.currentRole}</span>
                        </div>
                        <div class="change-item">
                            <span>New Role:</span>
                            <span class="role-badge new">${request.newRole}</span>
                        </div>
                        ${request.reason ? `
                            <div style="margin-top: 12px;">
                                <strong>Reason:</strong>
                                <p style="margin: 4px 0; font-style: italic;">${request.reason}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div style="margin: 16px 0;">
                        <label for="rejection-reason" style="display: block; margin-bottom: 8px; font-weight: 600;">
                            Rejection Reason (optional):
                        </label>
                        <textarea 
                            id="rejection-reason" 
                            class="form-control" 
                            rows="3" 
                            placeholder="Provide reason if rejecting this request..."
                            style="resize: vertical;"
                        ></textarea>
                    </div>
                    
                    <div class="approval-actions">
                        <button class="btn btn-outline cancel-btn">Cancel</button>
                        <button class="btn btn-danger reject-btn">
                            <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                            Reject
                        </button>
                        <button class="btn approve-btn">
                            <i data-lucide="check" style="width: 16px; height: 16px;"></i>
                            Approve
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            const closeModal = () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    resolve(null);
                }, 300);
            };
            
            // Event handlers
            modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
            
            modal.querySelector('.approve-btn').addEventListener('click', async () => {
                try {
                    await this.approveRequest(requestId, getCurrentUserWallet());
                    closeModal();
                    resolve('approved');
                } catch (error) {
                    alert('Approval failed: ' + error.message);
                }
            });
            
            modal.querySelector('.reject-btn').addEventListener('click', async () => {
                const reason = modal.querySelector('#rejection-reason').value.trim();
                try {
                    await this.rejectRequest(requestId, getCurrentUserWallet(), reason);
                    closeModal();
                    resolve('rejected');
                } catch (error) {
                    alert('Rejection failed: ' + error.message);
                }
            });
            
            // Show modal
            setTimeout(() => modal.classList.add('show'), 100);
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }

    async approveRequest(requestId, approvingAdmin) {
        const request = this.pendingRequests.get(requestId);
        if (!request) {
            throw new Error('Request not found');
        }

        if (request.status !== 'pending') {
            throw new Error('Request is no longer pending');
        }

        if (request.requestingAdmin === approvingAdmin) {
            throw new Error('Cannot approve your own request');
        }

        // Execute role change
        await this.executeRoleChange(request.targetUser, request.newRole, approvingAdmin);

        // Update request status
        request.status = 'approved';
        request.approvedBy = approvingAdmin;
        request.approvedAt = new Date().toISOString();

        this.savePendingRequests();

        // Log activity
        await this.logApprovalActivity(request, 'approved', approvingAdmin);

        // Notify involved parties
        await this.notifyApprovalDecision(request, 'approved');

        // Show success message
        if (window.blockchainFeedback) {
            window.blockchainFeedback.showToast('success', `
                <i data-lucide="check-circle" style="width: 20px; height: 20px;"></i>
                <div>Role change approved and executed</div>
            `);
        }

        return request;
    }

    async rejectRequest(requestId, rejectingAdmin, reason = '') {
        const request = this.pendingRequests.get(requestId);
        if (!request) {
            throw new Error('Request not found');
        }

        if (request.status !== 'pending') {
            throw new Error('Request is no longer pending');
        }

        if (request.requestingAdmin === rejectingAdmin) {
            throw new Error('Cannot reject your own request');
        }

        // Update request status
        request.status = 'rejected';
        request.approvedBy = rejectingAdmin;
        request.approvedAt = new Date().toISOString();
        request.rejectionReason = reason;

        this.savePendingRequests();

        // Log activity
        await this.logApprovalActivity(request, 'rejected', rejectingAdmin, reason);

        // Notify involved parties
        await this.notifyApprovalDecision(request, 'rejected', reason);

        // Show success message
        if (window.blockchainFeedback) {
            window.blockchainFeedback.showToast('info', `
                <i data-lucide="x-circle" style="width: 20px; height: 20px;"></i>
                <div>Role change request rejected</div>
            `);
        }

        return request;
    }

    async executeRoleChange(userWallet, newRole, changedBy) {
        // Mock implementation - replace with actual user management API
        const userData = JSON.parse(localStorage.getItem('evidUser_' + userWallet) || '{}');
        userData.role = newRole;
        userData.lastRoleChange = new Date().toISOString();
        userData.roleChangedBy = changedBy;
        
        localStorage.setItem('evidUser_' + userWallet, JSON.stringify(userData));
        
        // Log the change
        console.log(`Role changed: ${userWallet} -> ${newRole} by ${changedBy}`);
        
        return true;
    }

    generateRequestId() {
        return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadPendingRequests() {
        try {
            const stored = localStorage.getItem('pendingRoleRequests');
            if (stored) {
                const requests = JSON.parse(stored);
                this.pendingRequests = new Map(Object.entries(requests));
            }
        } catch (error) {
            console.error('Failed to load pending requests:', error);
        }
    }

    savePendingRequests() {
        try {
            const requestsObj = Object.fromEntries(this.pendingRequests);
            localStorage.setItem('pendingRoleRequests', JSON.stringify(requestsObj));
        } catch (error) {
            console.error('Failed to save pending requests:', error);
        }
    }

    async notifyAdminsOfRequest(request) {
        // Mock notification - replace with actual notification system
        console.log('Notifying admins of new role change request:', request);
    }

    async notifyApprovalDecision(request, decision, reason = '') {
        // Mock notification - replace with actual notification system
        console.log(`Role change request ${decision}:`, request, reason);
    }

    async logApprovalActivity(request, action, adminWallet, reason = '') {
        // Mock logging - replace with actual audit logging
        const logEntry = {
            timestamp: new Date().toISOString(),
            action: `role_change_${action}`,
            adminWallet,
            requestId: request.id,
            targetUser: request.targetUser,
            roleChange: `${request.currentRole} -> ${request.newRole}`,
            reason
        };
        
        console.log('Approval activity logged:', logEntry);
    }

    getPendingRequests(adminWallet = null) {
        const requests = Array.from(this.pendingRequests.values());
        
        if (adminWallet) {
            // Filter out requests made by this admin (they can't approve their own)
            return requests.filter(req => req.requestingAdmin !== adminWallet);
        }
        
        return requests;
    }

    renderPendingRequestsPanel(container, currentAdminWallet) {
        const pendingRequests = this.getPendingRequests(currentAdminWallet)
            .filter(req => req.status === 'pending');

        container.innerHTML = `
            <div class="pending-requests-panel">
                <h3 style="margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="clock" style="width: 20px; height: 20px; color: #d32f2f;"></i>
                    Pending Role Change Requests
                    <span class="badge" style="background: #d32f2f; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 4px;">
                        ${pendingRequests.length}
                    </span>
                </h3>
                
                ${pendingRequests.length === 0 ? `
                    <p style="color: #666; text-align: center; padding: 20px;">
                        No pending approval requests
                    </p>
                ` : pendingRequests.map(request => `
                    <div class="request-item">
                        <div class="request-header">
                            <div>
                                <strong>Role Change Request</strong>
                                <div class="request-meta">
                                    Requested by: ${request.requestingAdmin.substring(0, 8)}...
                                    • ${new Date(request.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <span class="approval-badge pending">Pending</span>
                        </div>
                        
                        <div class="change-summary">
                            <div class="change-item">
                                <span>Target User:</span>
                                <code>${request.targetUser.substring(0, 8)}...</code>
                            </div>
                            <div class="change-item">
                                <span>Role Change:</span>
                                <span>
                                    <span class="role-badge current">${request.currentRole}</span>
                                    →
                                    <span class="role-badge new">${request.newRole}</span>
                                </span>
                            </div>
                            ${request.reason ? `
                                <div style="margin-top: 8px;">
                                    <strong>Reason:</strong> ${request.reason}
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="request-actions">
                            <button class="btn btn-sm approve-request-btn" data-request-id="${request.id}">
                                <i data-lucide="check" style="width: 14px; height: 14px;"></i>
                                Review Request
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add event listeners
        container.querySelectorAll('.approve-request-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const requestId = btn.dataset.requestId;
                const result = await this.showApprovalDialog(requestId);
                if (result) {
                    // Refresh the panel
                    this.renderPendingRequestsPanel(container, currentAdminWallet);
                }
            });
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Utility function to get current user wallet
function getCurrentUserWallet() {
    return localStorage.getItem('currentUser') || '';
}

// Global instance
window.roleChangeApproval = new RoleChangeApproval();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoleChangeApproval;
}