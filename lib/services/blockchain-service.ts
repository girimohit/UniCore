import { getCertificateContract } from "../blockchain/client";
import { ethers } from "ethers";

export interface AnchorResult {
    success: boolean;
    transactionHash?: string;
    error?: string;
}

export class BlockchainService {
    /**
     * Anchors a document hash onto the blockchain.
     * @param documentHash The SHA-256 hash of the certificate (without 0x prefix)
     * @param metadata Optional metadata string to store along with the hash
     */
    static async anchorHash(documentHash: string, metadata: string = ""): Promise<AnchorResult> {
        try {
            const contract = getCertificateContract();
            
            // Format the hash for Solidity bytes32 (needs 0x prefix if not present)
            const formattedHash = documentHash.startsWith("0x") ? documentHash : `0x${documentHash}`;
            
            const tx = await contract.anchorCertificate(formattedHash, metadata);
            const receipt = await tx.wait();
            
            return {
                success: true,
                transactionHash: receipt.hash || receipt.transactionHash
            };
        } catch (error: any) {
            console.error("Blockchain anchoring error:", error);
            return {
                success: false,
                error: error.message || "Unknown blockchain error"
            };
        }
    }

    /**
     * Verifies if a hash exists on the blockchain.
     * @param documentHash The hash to verify
     */
    static async verifyHash(documentHash: string) {
        try {
            const contract = getCertificateContract();
            const formattedHash = documentHash.startsWith("0x") ? documentHash : `0x${documentHash}`;
            
            const [exists, timestamp, metadata] = await contract.verifyCertificate(formattedHash);
            
            return {
                exists,
                timestamp: timestamp ? Number(timestamp) : 0,
                metadata
            };
        } catch (error) {
            console.error("Blockchain verification error:", error);
            return { exists: false };
        }
    }
}
