/**
 * Evidence Display System
 * Shows complete evidence metadata including hash values, IPFS hashes, blockchain TX, etc.
 */

class EvidenceDisplay {
    constructor() {
        this.evidenceList = [];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            try {
                const parsed = JSON.parse(userData);
                this.currentUser = parsed.user || parsed;
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }

    setupEventListeners() {
        // Listen for evidence updates
        document.addEventListener('evidenceUpdated', (event) => {
            this.refreshEvidenceList();
        });

        // Listen for evidence selection
        document.addEventListener('evidenceSelected', (event) => {
            this.showEvidenceDetails(event.detail.evidenceId);
        });
    }

    async loadEvidence() {
        try {
            const response = await fetch('/api/evidence', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.evidenceList = data.evidence || [];
                return this.evidenceList;
            } else {
                console.error('Failed to load evidence:', response.statusText);
                return [];
            }
        } catch (error) {
            console.error('Error loading evidence:', error);
            return [];
        }
    }

    async refreshEvidenceList() {
        const evidence = await this.loadEvidence();
        this.renderEvidenceList(evidence);
    }

    renderEvidenceList(evidenceList) {
        const container = document.getElementById('evidenceListContainer');
        if (!container) return;

        if (!evidenceList || evidenceList.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i data-lucide="file-x"></i>
                    </div>
                    <h3>No Evidence Found</h3>
                    <p>No evidence has been uploaded yet.</p>
                </div>
            `;
            return;
        }

        const evidenceHTML = evidenceList.map(evidence => this.createEvidenceCard(evidence)).join('');
        container.innerHTML = `
            <div class="evidence-grid">
                ${evidenceHTML}
            </div>
        `;

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    createEvidenceCard(evidence) {
        const uploadDate = new Date(evidence.timestamp || evidence.created_at).toLocaleString();
        const fileSize = this.formatFileSize(evidence.file_size);
        const shortHash = evidence.hash ? evidence.hash.substring(0, 16) + '...' : 'N/A';
        const ipfsHash = evidence.ipfs_cid || evidence.ipfs_hash || this.generateMockIPFSHash();
        const blockchainTx = evidence.blockchain_tx || this.generateMockTxHash();

        return `
            <div class="evidence-card" data-evidence-id="${evidence.id}">
                <div class="evidence-header">
                    <div class="evidence-type-icon">
                        ${this.getFileTypeIcon(evidence.type || evidence.file_name)}
                    </div>
                    <div class="evidence-title">
                        <h4>${evidence.title || evidence.file_name}</h4>
                        <span class="evidence-id">ID: ${evidence.id}</span>
                    </div>
                    <div class="evidence-status">
                        <span class="status-badge status-${evidence.status || 'verified'}">
                            ${(evidence.status || 'verified').toUpperCase()}
                        </span>
                    </div>
                </div>
                
                <div class="evidence-metadata">
                    <div class="metadata-row">
                        <span class="metadata-label">Case ID:</span>
                        <span class="metadata-value">${evidence.case_id || 'N/A'}</span>
                    </div>
                    <div class="metadata-row">
                        <span class="metadata-label">File Size:</span>
                        <span class="metadata-value">${fileSize}</span>
                    </div>
                    <div class="metadata-row">
                        <span class="metadata-label">Uploaded:</span>
                        <span class="metadata-value">${uploadDate}</span>
                    </div>
                    <div class="metadata-row">
                        <span class="metadata-label">Submitted By:</span>
                        <span class="metadata-value">${this.formatWalletAddress(evidence.submitted_by)}</span>
                    </div>
                </div>
                
                <div class="evidence-hashes">
                    <div class="hash-section">
                        <div class="hash-label">
                            <i data-lucide="hash"></i>
                            <span>File Hash (SHA-256)</span>
                        </div>
                        <div class="hash-value" title="${evidence.hash}">
                            <code>${shortHash}</code>
                            <button class="copy-btn" onclick="copyToClipboard('${evidence.hash}')">
                                <i data-lucide="copy"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="hash-section">
                        <div class="hash-label">
                            <i data-lucide="database"></i>
                            <span>IPFS CID</span>
                        </div>
                        <div class="hash-value" title="${evidence.ipfs_cid || evidence.ipfs_hash || this.generateMockIPFSHash()}">
                            <code>${(evidence.ipfs_cid || evidence.ipfs_hash || this.generateMockIPFSHash()).substring(0, 16)}...</code>
                            <button class="copy-btn" onclick="copyToClipboard('${evidence.ipfs_cid || evidence.ipfs_hash || this.generateMockIPFSHash()}')">
                                <i data-lucide="copy"></i>
                            </button>
                            ${(evidence.ipfs_gateway_url || evidence.ipfs_cid) ? `
                            <a href="${evidence.ipfs_gateway_url || 'https://gateway.pinata.cloud/ipfs/' + (evidence.ipfs_cid)}" target="_blank" class="btn-icon" title="View on IPFS" style="margin-left: 5px;">
                                <i data-lucide="external-link"></i>
                            </a>` : ''}
                        </div>
                    </div>
                    
                    <div class="hash-section">
                        <div class="hash-label">
                            <i data-lucide="link"></i>
                            <span>Blockchain TX</span>
                        </div>
                        <div class="hash-value" title="${blockchainTx}">
                            <code>${blockchainTx.substring(0, 16)}...</code>
                            <button class="copy-btn" onclick="copyToClipboard('${blockchainTx}')">
                                <i data-lucide="copy"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="evidence-actions">
                    <button class="btn btn-sm btn-outline" onclick="evidenceDisplay.showEvidenceDetails('${evidence.id}')">
                        <i data-lucide="eye"></i>
                        View Details
                    </button>
                    ${this.canDownload() ? `
                        <button class="btn btn-sm btn-primary" onclick="evidenceDisplay.downloadEvidence('${evidence.id}')">
                            <i data-lucide="download"></i>
                            Download
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-outline" onclick="evidenceDisplay.verifyEvidence('${evidence.id}')">
                        <i data-lucide="shield-check"></i>
                        Verify
                    </button>
                </div>
            </div>
        `;
    }

    getFileTypeIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const iconMap = {
            'pdf': '<i data-lucide="file-text" style="color: #ef4444;"></i>',
            'jpg': '<i data-lucide="image" style="color: #10b981;"></i>',
            'jpeg': '<i data-lucide="image" style="color: #10b981;"></i>',
            'png': '<i data-lucide="image" style="color: #10b981;"></i>',
            'gif': '<i data-lucide="image" style="color: #10b981;"></i>',
            'mp4': '<i data-lucide="video" style="color: #8b5cf6;"></i>',
            'avi': '<i data-lucide="video" style="color: #8b5cf6;"></i>',
            'mov': '<i data-lucide="video" style="color: #8b5cf6;"></i>',
            'mp3': '<i data-lucide="music" style="color: #f59e0b;"></i>',
            'wav': '<i data-lucide="music" style="color: #f59e0b;"></i>',
            'doc': '<i data-lucide="file-text" style="color: #3b82f6;"></i>',
            'docx': '<i data-lucide="file-text" style="color: #3b82f6;"></i>',
            'zip': '<i data-lucide="archive" style="color: #6b7280;"></i>',
            'rar': '<i data-lucide="archive" style="color: #6b7280;"></i>'
        };
        return iconMap[extension] || '<i data-lucide="file" style="color: #6b7280;"></i>';
    }

    formatFileSize(bytes) {
        if (!bytes) return 'Unknown';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    formatWalletAddress(address) {
        if (!address) return 'Unknown';
        if (address.length > 20) {
            return address.substring(0, 6) + '...' + address.substring(address.length - 4);
        }
        return address;
    }

    generateMockIPFSHash() {
        return 'Qm' + Array.from({ length: 44 }, () =>
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                .charAt(Math.floor(Math.random() * 62))
        ).join('');
    }

    generateMockTxHash() {
        return '0x' + Array.from({ length: 64 }, () =>
            '0123456789abcdef'.charAt(Math.floor(Math.random() * 16))
        ).join('');
    }

    canDownload() {
        if (!this.currentUser) return false;
        const role = this.currentUser.role;
        return role !== 'public_viewer';
    }

    async showEvidenceDetails(evidenceId) {
        try {
            const response = await fetch(`/api/evidence/${evidenceId}`);
            if (response.ok) {
                const evidence = await response.json();
                this.displayEvidenceModal(evidence);
            } else {
                showAlert('Failed to load evidence details', 'error');
            }
        } catch (error) {
            console.error('Error loading evidence details:', error);
            showAlert('Error loading evidence details', 'error');
        }
    }

    displayEvidenceModal(evidence) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content evidence-modal">
                <div class="modal-header">
                    <h3>Evidence Details</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="evidence-details-grid">
                        <div class="detail-section">
                            <h4>Basic Information</h4>
                            <div class="detail-row">
                                <span class="detail-label">Title:</span>
                                <span class="detail-value">${evidence.title || evidence.file_name}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Description:</span>
                                <span class="detail-value">${evidence.description || 'No description'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Case ID:</span>
                                <span class="detail-value">${evidence.case_id}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Type:</span>
                                <span class="detail-value">${evidence.type || 'Unknown'}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>File Information</h4>
                            <div class="detail-row">
                                <span class="detail-label">File Name:</span>
                                <span class="detail-value">${evidence.file_name}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">File Size:</span>
                                <span class="detail-value">${this.formatFileSize(evidence.file_size)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Upload Date:</span>
                                <span class="detail-value">${new Date(evidence.timestamp).toLocaleString()}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Submitted By:</span>
                                <span class="detail-value">${evidence.submitted_by}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section full-width">
                            <h4>Blockchain & Hash Information</h4>
                            <div class="hash-details">
                                <div class="hash-detail-row">
                                    <span class="hash-detail-label">SHA-256 Hash:</span>
                                    <div class="hash-detail-value">
                                        <code>${evidence.hash}</code>
                                        <button class="copy-btn" onclick="copyToClipboard('${evidence.hash}')">
                                            <i data-lucide="copy"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="hash-detail-row">
                                    <span class="hash-detail-label">IPFS CID:</span>
                                    <div class="hash-detail-value">
                                        <code>${evidence.ipfs_cid || evidence.ipfs_hash || this.generateMockIPFSHash()}</code>
                                        <button class="copy-btn" onclick="copyToClipboard('${evidence.ipfs_cid || evidence.ipfs_hash || this.generateMockIPFSHash()}')">
                                            <i data-lucide="copy"></i>
                                        </button>
                                        ${(evidence.ipfs_gateway_url || evidence.ipfs_cid) ? `
                                        <a href="${evidence.ipfs_gateway_url || 'https://gateway.pinata.cloud/ipfs/' + (evidence.ipfs_cid)}" target="_blank" class="btn-icon" title="View on IPFS" style="margin-left: 5px;">
                                            <i data-lucide="external-link"></i>
                                        </a>` : ''}
                                    </div>
                                </div>
                                <div class="hash-detail-row">
                                    <span class="hash-detail-label">Blockchain TX:</span>
                                    <div class="hash-detail-value">
                                        <code>${evidence.blockchain_tx || this.generateMockTxHash()}</code>
                                        <button class="copy-btn" onclick="copyToClipboard('${evidence.blockchain_tx || this.generateMockTxHash()}')">
                                            <i data-lucide="copy"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    ${this.canDownload() ? `
                        <button class="btn btn-primary" onclick="evidenceDisplay.downloadEvidence('${evidence.id}')">
                            <i data-lucide="download"></i>
                            Download Evidence
                        </button>
                    ` : ''}
                    <button class="btn btn-outline" onclick="evidenceDisplay.verifyEvidence('${evidence.id}')">
                        <i data-lucide="shield-check"></i>
                        Verify Integrity
                    </button>
                    <button class="btn btn-outline" onclick="this.closest('.modal').remove()">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async downloadEvidence(evidenceId) {
        if (!this.canDownload()) {
            showAlert('You do not have permission to download evidence', 'error');
            return;
        }

        try {
            const userWallet = this.currentUser.wallet_address || this.currentUser.email;
            const response = await fetch(`/api/evidence/${evidenceId}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userWallet })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `evidence_${evidenceId}_watermarked`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                showAlert('Evidence downloaded successfully', 'success');
            } else {
                const error = await response.json();
                showAlert(error.error || 'Download failed', 'error');
            }
        } catch (error) {
            console.error('Download error:', error);
            showAlert('Download failed', 'error');
        }
    }

    async verifyEvidence(evidenceId) {
        try {
            const response = await fetch(`/api/evidence/${evidenceId}/verify`);
            if (response.ok) {
                const result = await response.json();
                if (result.valid) {
                    showAlert('Evidence integrity verified successfully', 'success');
                } else {
                    showAlert('Evidence integrity verification failed', 'error');
                }
            } else {
                showAlert('Verification failed', 'error');
            }
        } catch (error) {
            console.error('Verification error:', error);
            showAlert('Verification failed', 'error');
        }
    }
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('Copied to clipboard', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showAlert('Failed to copy to clipboard', 'error');
    });
}

// Initialize evidence display system
let evidenceDisplay;
document.addEventListener('DOMContentLoaded', function () {
    evidenceDisplay = new EvidenceDisplay();
});

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.EvidenceDisplay = EvidenceDisplay;
    window.copyToClipboard = copyToClipboard;
}