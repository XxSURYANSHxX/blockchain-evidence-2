const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const { Readable } = require('stream');

/**
 * IPFS Service for EVID-DGC
 * Handles interaction with IPFS via Pinata
 */
class IPFSService {
    constructor() {
        this.pinata = null;
        this.isEnabled = process.env.IPFS_ENABLED === 'true';
        this.gatewayUrl = process.env.IPFS_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/';

        if (this.isEnabled) {
            this.init();
        }
    }

    /**
     * Initialize Pinata SDK
     */
    init() {
        // Prefer JWT authentication if available
        if (process.env.PINATA_JWT) {
            this.pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
        } else if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_KEY) {
            this.pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);
        } else {
            console.warn('IPFS Service: No Pinata credentials found. IPFS features will be disabled.');
            this.isEnabled = false;
        }

        // Test connection
        if (this.isEnabled) {
            this.testConnection();
        }
    }

    /**
     * Test connection to Pinata
     */
    async testConnection() {
        try {
            const result = await this.pinata.testAuthentication();
            console.log('IPFS Service: Connected to Pinata successfully', result);
            return true;
        } catch (error) {
            console.error('IPFS Service: Failed to connect to Pinata', error);
            this.isEnabled = false;
            return false;
        }
    }

    /**
     * Upload file to IPFS
     * @param {Buffer} fileBuffer - File content buffer
     * @param {string} fileName - Original file name
     * @param {Object} metadata - key-value metadata to attach to pin
     * @returns {Promise<Object>} - Pinata upload result (IpfsHash, PinSize, Timestamp)
     */
    async uploadToIPFS(fileBuffer, fileName, metadata = {}) {
        if (!this.isEnabled) {
            throw new Error('IPFS Service is not enabled');
        }

        try {
            // Create a readable stream from buffer
            const stream = Readable.from(fileBuffer);
            // Add path property which Pinata SDK expects for file naming
            stream.path = fileName;

            const options = {
                pinataMetadata: {
                    name: fileName,
                    keyvalues: {
                        ...metadata,
                        uploadedAt: new Date().toISOString(),
                        system: 'EVID-DGC'
                    }
                },
                pinataOptions: {
                    cidVersion: 1
                }
            };

            const result = await this.pinata.pinFileToIPFS(stream, options);
            return {
                ...result,
                gatewayUrl: this.getGatewayUrl(result.IpfsHash)
            };
        } catch (error) {
            console.error('IPFS Service: Upload failed', error);
            throw new Error(`Failed to upload to IPFS: ${error.message}`);
        }
    }

    /**
     * Pin existing CID to hot storage
     * @param {string} cid - IPFS CID
     * @param {string} name - Name for the pin
     * @returns {Promise<Object>}
     */
    async pinContent(cid, name) {
        if (!this.isEnabled) return null;

        try {
            const result = await this.pinata.pinByHash(cid, {
                pinataMetadata: {
                    name: name
                }
            });
            return result;
        } catch (error) {
            console.error('IPFS Service: Pin by hash failed', error);
            throw error;
        }
    }

    /**
     * Unpin content (stop paying for storage)
     * @param {string} cid - IPFS CID
     * @returns {Promise<boolean>}
     */
    async unpinContent(cid) {
        if (!this.isEnabled) return false;

        try {
            await this.pinata.unpin(cid);
            return true;
        } catch (error) {
            console.error('IPFS Service: Unpin failed', error);
            return false;
        }
    }

    /**
     * Get public gateway URL for CID
     * @param {string} cid 
     * @returns {string}
     */
    getGatewayUrl(cid) {
        if (!cid) return null;
        return `${this.gatewayUrl}${cid}`;
    }

    /**
     * Check if service is healthy
     * @returns {Promise<boolean>}
     */
    async checkHealth() {
        if (!this.isEnabled) return false;
        try {
            await this.pinata.testAuthentication();
            return true;
        } catch (e) {
            return false;
        }
    }
}

// Export singleton instance
module.exports = new IPFSService();
