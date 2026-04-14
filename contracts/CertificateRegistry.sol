// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    address public owner;
    
    struct CertificateInfo {
        bool exists;
        uint256 timestamp;
        string metadata;
    }
    
    mapping(bytes32 => CertificateInfo) public certificates;
    
    event CertificateAnchored(bytes32 indexed documentHash, address indexed anchoredBy);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function anchorCertificate(bytes32 documentHash, string memory metadata) public onlyOwner {
        require(!certificates[documentHash].exists, "Certificate already anchored");
        
        certificates[documentHash] = CertificateInfo({
            exists: true,
            timestamp: block.timestamp,
            metadata: metadata
        });
        
        emit CertificateAnchored(documentHash, msg.sender);
    }

    function verifyCertificate(bytes32 documentHash) public view returns (bool exists, uint256 timestamp, string memory metadata) {
        CertificateInfo memory info = certificates[documentHash];
        return (info.exists, info.timestamp, info.metadata);
    }
}
