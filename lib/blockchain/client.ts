import { ethers } from "ethers";

// ABI for the CertificateRegistry contract
export const CERTIFICATE_REGISTRY_ABI = [
    "function anchorCertificate(bytes32 documentHash, string memory metadata) public",
    "function verifyCertificate(bytes32 documentHash) public view returns (bool exists, uint256 timestamp, string memory metadata)",
    "event CertificateAnchored(bytes32 indexed documentHash, address indexed anchoredBy)"
];

/**
 * Gets a provider for the blockchain.
 * Uses environment variables for configuration.
 */
export function getBlockchainProvider() {
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
    if (!rpcUrl) {
        throw new Error("BLOCKCHAIN_RPC_URL is not defined in environment variables");
    }
    return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Gets a wallet for signing transactions.
 * Uses a private key from environment variables.
 */
export function getBlockchainWallet() {
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("BLOCKCHAIN_PRIVATE_KEY is not defined in environment variables");
    }
    const provider = getBlockchainProvider();
    return new ethers.Wallet(privateKey, provider);
}

/**
 * Gets an instance of the CertificateRegistry contract.
 */
export function getCertificateContract() {
    const contractAddress = process.env.CERTIFICATE_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error("CERTIFICATE_CONTRACT_ADDRESS is not defined in environment variables");
    }
    const wallet = getBlockchainWallet();
    return new ethers.Contract(contractAddress, CERTIFICATE_REGISTRY_ABI, wallet);
}
