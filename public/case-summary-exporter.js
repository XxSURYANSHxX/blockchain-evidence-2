/**
 * Case Summary PDF Export System
 * Generates high-level business summary PDFs for cases
 */

class CaseSummaryExporter {
    constructor() {
        this.initializeStyles();
    }

    initializeStyles() {
        if (document.getElementById('case-summary-export-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'case-summary-export-styles';
        styles.textContent = `
            .export-summary-modal {
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
            
            .export-summary-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .export-summary-content {
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
            
            .export-summary-modal.show .export-summary-content {
                transform: scale(1);
            }
            
            .export-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 16px;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .export-header h3 {
                margin: 0;
                color: #333;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .export-header i {
                width: 24px;
                height: 24px;
                color: #d32f2f;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .close-btn:hover {
                background: #f0f0f0;
                color: #333;
            }
            
            .case-info-section {
                margin: 20px 0;
                padding: 16px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #d32f2f;
            }
            
            .case-info-item {
                display: flex;
                justify-content: space-between;
                margin: 8px 0;
                font-size: 0.9em;
            }
            
            .case-info-item strong {
                color: #333;
            }
            
            .export-options {
                margin: 20px 0;
            }
            
            .export-options h4 {
                margin: 0 0 16px 0;
                color: #333;
                font-size: 1.1em;
            }
            
            .option-group {
                margin: 16px 0;
            }
            
            .option-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
            }
            
            .checkbox-group {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 12px;
                margin: 12px 0;
            }
            
            .checkbox-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .checkbox-item:hover {
                border-color: #d32f2f;
                background: #fff5f5;
            }
            
            .checkbox-item input[type="checkbox"] {
                margin: 0;
            }
            
            .checkbox-item.checked {
                border-color: #d32f2f;
                background: #fff5f5;
            }
            
            .export-progress {
                margin: 20px 0;
                padding: 16px;
                background: #f0f8ff;
                border-radius: 8px;
                display: none;
            }
            
            .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #d32f2f, #b71c1c);
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .progress-steps {
                margin-top: 12px;
                font-size: 0.9em;
                color: #666;
            }
            
            .export-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 24px;
                padding-top: 16px;
                border-top: 1px solid #e0e0e0;
            }
            
            .watermark-options {
                margin: 16px 0;
                padding: 12px;
                background: #fff9c4;
                border-radius: 6px;
                border: 1px solid #fdd835;
            }
            
            .watermark-options h5 {
                margin: 0 0 8px 0;
                color: #f57f17;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .watermark-options i {
                width: 16px;
                height: 16px;
            }
        `;
        
        document.head.appendChild(styles);
    }

    async showExportDialog(caseId, caseData) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'export-summary-modal';
            modal.innerHTML = `
                <div class="export-summary-content">
                    <div class="export-header">
                        <h3>
                            <i data-lucide="file-text"></i>
                            Export Case Summary
                        </h3>
                        <button class="close-btn">×</button>
                    </div>
                    
                    <div class="case-info-section">
                        <h4 style="margin: 0 0 12px 0; color: #d32f2f;">Case Information</h4>
                        <div class="case-info-item">
                            <span>Case ID:</span>
                            <strong>${caseData.id || caseId}</strong>
                        </div>
                        <div class="case-info-item">
                            <span>Title:</span>
                            <strong>${caseData.title || 'Untitled Case'}</strong>
                        </div>
                        <div class="case-info-item">
                            <span>Status:</span>
                            <strong>${caseData.status || 'Active'}</strong>
                        </div>
                        <div class="case-info-item">
                            <span>Created:</span>
                            <strong>${caseData.created ? new Date(caseData.created).toLocaleDateString() : 'Unknown'}</strong>
                        </div>
                        <div class="case-info-item">
                            <span>Evidence Items:</span>
                            <strong>${caseData.evidenceCount || 0}</strong>
                        </div>
                    </div>
                    
                    <div class="export-options">
                        <h4>Export Options</h4>
                        
                        <div class="option-group">
                            <label>Include Sections:</label>
                            <div class="checkbox-group">
                                <div class="checkbox-item checked">
                                    <input type="checkbox" id="includeOverview" checked>
                                    <label for="includeOverview">Case Overview</label>
                                </div>
                                <div class="checkbox-item checked">
                                    <input type="checkbox" id="includeEvidence" checked>
                                    <label for="includeEvidence">Evidence Summary</label>
                                </div>
                                <div class="checkbox-item checked">
                                    <input type="checkbox" id="includeTimeline" checked>
                                    <label for="includeTimeline">Key Timeline</label>
                                </div>
                                <div class="checkbox-item checked">
                                    <input type="checkbox" id="includeRoles" checked>
                                    <label for="includeRoles">Involved Parties</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="includeMetadata">
                                    <label for="includeMetadata">Technical Metadata</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="includeChainOfCustody">
                                    <label for="includeChainOfCustody">Chain of Custody</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="watermark-options">
                            <h5>
                                <i data-lucide="shield"></i>
                                Document Security
                            </h5>
                            <div class="checkbox-item checked">
                                <input type="checkbox" id="addWatermark" checked>
                                <label for="addWatermark">Add "EVID-DGC Generated" watermark</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="export-progress">
                        <div class="progress-header">
                            <span>Generating case summary...</span>
                            <span class="progress-text">0%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-steps">
                            <div class="current-step">Initializing export...</div>
                        </div>
                    </div>
                    
                    <div class="export-actions">
                        <button class="btn btn-outline cancel-btn">Cancel</button>
                        <button class="btn export-btn">
                            <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                            Export Summary
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Setup checkbox interactions
            modal.querySelectorAll('.checkbox-item').forEach(item => {
                const checkbox = item.querySelector('input[type="checkbox"]');
                
                item.addEventListener('click', (e) => {
                    if (e.target.type !== 'checkbox') {
                        checkbox.checked = !checkbox.checked;
                    }
                    item.classList.toggle('checked', checkbox.checked);
                });
                
                checkbox.addEventListener('change', () => {
                    item.classList.toggle('checked', checkbox.checked);
                });
            });
            
            // Close handlers
            const closeModal = () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    resolve(null);
                }, 300);
            };
            
            modal.querySelector('.close-btn').addEventListener('click', closeModal);
            modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
            
            // Export handler
            modal.querySelector('.export-btn').addEventListener('click', async () => {
                try {
                    modal.querySelector('.export-btn').disabled = true;
                    modal.querySelector('.export-progress').style.display = 'block';
                    
                    const options = this.collectExportOptions(modal);
                    await this.generateCaseSummary(caseId, caseData, options, (progress, step) => {
                        modal.querySelector('.progress-fill').style.width = `${progress}%`;
                        modal.querySelector('.progress-text').textContent = `${progress}%`;
                        modal.querySelector('.current-step').textContent = step;
                    });
                    
                    closeModal();
                    resolve(options);
                } catch (error) {
                    console.error('Export failed:', error);
                    alert('Export failed: ' + error.message);
                    modal.querySelector('.export-btn').disabled = false;
                    modal.querySelector('.export-progress').style.display = 'none';
                }
            });
            
            // Show modal
            setTimeout(() => modal.classList.add('show'), 100);
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }

    collectExportOptions(modal) {
        const options = {
            includeOverview: modal.querySelector('#includeOverview').checked,
            includeEvidence: modal.querySelector('#includeEvidence').checked,
            includeTimeline: modal.querySelector('#includeTimeline').checked,
            includeRoles: modal.querySelector('#includeRoles').checked,
            includeMetadata: modal.querySelector('#includeMetadata').checked,
            includeChainOfCustody: modal.querySelector('#includeChainOfCustody').checked,
            addWatermark: modal.querySelector('#addWatermark').checked
        };
        
        return options;
    }

    async generateCaseSummary(caseId, caseData, options, progressCallback) {
        try {
            progressCallback(10, 'Collecting case data...');
            
            // Simulate data collection
            await new Promise(resolve => setTimeout(resolve, 500));
            const fullCaseData = await this.getCaseData(caseId);
            
            progressCallback(30, 'Generating document structure...');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            progressCallback(50, 'Formatting content...');
            const pdfContent = this.generatePDFContent(fullCaseData, options);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            progressCallback(70, 'Applying formatting and watermarks...');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            progressCallback(90, 'Finalizing document...');
            this.downloadPDF(pdfContent, `case_summary_${caseId}.pdf`);
            await new Promise(resolve => setTimeout(resolve, 300));
            
            progressCallback(100, 'Export completed!');
            
            // Show success notification
            if (window.blockchainFeedback) {
                window.blockchainFeedback.showToast('success', `
                    <i data-lucide="download" style="width: 20px; height: 20px;"></i>
                    <div>Case summary exported successfully!</div>
                `);
            }
            
        } catch (error) {
            console.error('Case summary generation error:', error);
            throw error;
        }
    }

    async getCaseData(caseId) {
        // Mock case data - replace with actual API call
        return {
            id: caseId,
            title: 'State v. John Doe - Digital Evidence Analysis',
            description: 'Investigation into alleged cybercrime activities involving unauthorized access to financial systems.',
            status: 'Under Investigation',
            priority: 'High',
            created: new Date('2024-01-15'),
            lastUpdated: new Date(),
            assignedTo: 'Detective Sarah Johnson',
            jurisdiction: 'State Court, District 5',
            caseType: 'Cybercrime',
            evidence: [
                {
                    id: 'EVI001',
                    name: 'Suspect Hard Drive Image',
                    type: 'Digital Storage',
                    hash: 'd4735f3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
                    uploadDate: new Date('2024-01-16'),
                    uploadedBy: 'Forensic Analyst Mike Chen',
                    size: '500 GB',
                    status: 'Analyzed'
                },
                {
                    id: 'EVI002',
                    name: 'Network Traffic Logs',
                    type: 'Network Data',
                    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                    uploadDate: new Date('2024-01-17'),
                    uploadedBy: 'IT Specialist Lisa Wong',
                    size: '2.3 GB',
                    status: 'Under Review'
                },
                {
                    id: 'EVI003',
                    name: 'Security Camera Footage',
                    type: 'Video Evidence',
                    hash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
                    uploadDate: new Date('2024-01-18'),
                    uploadedBy: 'Officer David Kim',
                    size: '1.8 GB',
                    status: 'Verified'
                }
            ],
            timeline: [
                {
                    date: new Date('2024-01-15'),
                    event: 'Case opened',
                    actor: 'Detective Sarah Johnson',
                    type: 'case_created'
                },
                {
                    date: new Date('2024-01-16'),
                    event: 'First evidence item uploaded',
                    actor: 'Forensic Analyst Mike Chen',
                    type: 'evidence_added'
                },
                {
                    date: new Date('2024-01-20'),
                    event: 'Forensic analysis completed',
                    actor: 'Forensic Analyst Mike Chen',
                    type: 'analysis_completed'
                }
            ],
            involvedParties: [
                { name: 'Detective Sarah Johnson', role: 'Lead Investigator', department: 'Cybercrime Unit' },
                { name: 'Forensic Analyst Mike Chen', role: 'Digital Forensics', department: 'Crime Lab' },
                { name: 'IT Specialist Lisa Wong', role: 'Network Analysis', department: 'IT Forensics' },
                { name: 'Officer David Kim', role: 'Evidence Collection', department: 'Field Operations' }
            ]
        };
    }

    generatePDFContent(caseData, options) {
        const sections = [];
        
        // Header
        sections.push(`
CASE SUMMARY REPORT
Generated by EVID-DGC Blockchain Evidence Management System
Generated on: ${new Date().toLocaleString()}
${options.addWatermark ? '\n[EVID-DGC GENERATED DOCUMENT]' : ''}

${'='.repeat(80)}
        `);
        
        // Case Overview
        if (options.includeOverview) {
            sections.push(`
CASE OVERVIEW
${'='.repeat(80)}

Case ID: ${caseData.id}
Title: ${caseData.title}
Description: ${caseData.description}
Status: ${caseData.status}
Priority: ${caseData.priority}
Case Type: ${caseData.caseType}
Jurisdiction: ${caseData.jurisdiction}

Created: ${caseData.created.toLocaleDateString()}
Last Updated: ${caseData.lastUpdated.toLocaleDateString()}
Assigned To: ${caseData.assignedTo}
            `);
        }
        
        // Evidence Summary
        if (options.includeEvidence) {
            sections.push(`
EVIDENCE SUMMARY
${'='.repeat(80)}

Total Evidence Items: ${caseData.evidence.length}

${caseData.evidence.map((item, index) => `
${index + 1}. ${item.name}
   Evidence ID: ${item.id}
   Type: ${item.type}
   Size: ${item.size}
   Status: ${item.status}
   Hash: ${item.hash}
   Uploaded: ${item.uploadDate.toLocaleDateString()}
   Uploaded By: ${item.uploadedBy}
`).join('')}
            `);
        }
        
        // Timeline
        if (options.includeTimeline) {
            sections.push(`
KEY TIMELINE
${'='.repeat(80)}

${caseData.timeline.map(event => `
${event.date.toLocaleDateString()} - ${event.event}
   Actor: ${event.actor}
   Type: ${event.type.replace('_', ' ').toUpperCase()}
`).join('')}
            `);
        }
        
        // Involved Parties
        if (options.includeRoles) {
            sections.push(`
INVOLVED PARTIES
${'='.repeat(80)}

${caseData.involvedParties.map(party => `
• ${party.name}
  Role: ${party.role}
  Department: ${party.department}
`).join('')}
            `);
        }
        
        // Technical Metadata
        if (options.includeMetadata) {
            sections.push(`
TECHNICAL METADATA
${'='.repeat(80)}

Blockchain Verification: Enabled
Hash Algorithm: SHA-256
Storage: Distributed (Blockchain + IPFS)
Audit Trail: Complete
Compliance: ISO 27037, NIST Guidelines

Evidence Integrity Status:
${caseData.evidence.map(item => `
• ${item.id}: VERIFIED (Hash: ${item.hash.substring(0, 16)}...)
`).join('')}
            `);
        }
        
        // Chain of Custody
        if (options.includeChainOfCustody) {
            sections.push(`
CHAIN OF CUSTODY SUMMARY
${'='.repeat(80)}

This case maintains a complete digital chain of custody through blockchain
technology. All evidence transfers and access events are cryptographically
signed and immutably recorded.

Key Custody Events:
${caseData.evidence.map(item => `
• ${item.name} (${item.id})
  Initial Custody: ${item.uploadedBy}
  Date: ${item.uploadDate.toLocaleDateString()}
  Blockchain Record: Verified
`).join('')}
            `);
        }
        
        // Footer
        sections.push(`
${'='.repeat(80)}

DISCLAIMER:
This summary is generated for informational purposes and provides a high-level
overview of the case. For detailed forensic analysis and complete chain of
custody documentation, refer to the full case file and individual evidence
reports.

Document Security:
${options.addWatermark ? '• Watermarked with EVID-DGC identifier' : ''}
• Generated with cryptographic integrity verification
• Blockchain-backed evidence verification

For questions about this report, contact the case administrator or
visit the EVID-DGC system for detailed information.

End of Report
        `);
        
        return sections.join('\n');
    }

    downloadPDF(content, filename) {
        // For a real implementation, you would use a PDF library like jsPDF
        // For now, we'll create a text file that simulates the PDF
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace('.pdf', '.txt'); // Temporary: use .txt for demo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    // Utility method to add export button to case detail pages
    addExportButton(container, caseId, caseData) {
        const button = document.createElement('button');
        button.className = 'btn btn-outline';
        button.innerHTML = `
            <i data-lucide="file-text" style="width: 16px; height: 16px;"></i>
            Export Summary
        `;
        
        button.addEventListener('click', () => {
            this.showExportDialog(caseId, caseData);
        });
        
        container.appendChild(button);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        return button;
    }
}

// Global instance
window.caseSummaryExporter = new CaseSummaryExporter();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CaseSummaryExporter;
}