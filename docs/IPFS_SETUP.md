# IPFS Integration Guide

This project uses **Pinata** as the IPFS pinning service to ensure decentralized and persistent storage for evidence files.

## Configuration

To enable IPFS storage, you need to configure your environment variables in `.env`.

### 1. Get Pinata Credentials
1. Sign up at [Pinata](https://www.pinata.cloud/).
2. Go to **API Keys**.
3. Create a new key with Admin permissions.
4. Copy the **API Key**, **API Secret**, and **JWT**.

### 2. Update .env File
Add the following variables to your `.env` file:

```env
# IPFS/Pinata Configuration
IPFS_ENABLED=true
IPFS_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/
PINATA_API_KEY=your_api_key
PINATA_SECRET_KEY=your_secret_key
# Recommended: Use JWT for better security
PINATA_JWT=your_jwt_token
```

## How It Works

1. **Upload**: When a file is uploaded via `/api/evidence/upload`, the server:
   - Calculates the SHA-256 hash for integrity.
   - Streams the file to Pinata IPFS.
   - Receives a Content Identifier (CID).
   - Stores the CID and Gateway URL in the database.

2. **Storage**:
   - Files are "pinned" to your Pinata account, ensuring they are not garbage collected by the IPFS network.
   - Metadata is stored in the `evidence` table in Supabase.

3. **Retrieval**:
   - Files can be accessed via the public IPFS gateway using the CID.
   - The frontend provides a "View on IPFS" button.

## Database Schema

The following columns were added to the `evidence` table:
- `ipfs_cid` (TEXT): The IPFS Content Identifier.
- `ipfs_gateway_url` (TEXT): Full URL to access the file.
- `ipfs_status` (TEXT): Status of the upload (`pending`, `uploaded`, `pinned`, `failed`).
- `ipfs_pinned_until` (TIMESTAMPTZ): Expiration date for pinning (null = permanent).

## Troubleshooting

- **Upload Failed**: Check your Pinata credentials and internet connection.
- **File Not Found**: Verify the CID on a public IPFS gateway explorer.
- **Rate Limits**: Pinata has rate limits on the free tier. Check your usage dashboard.
