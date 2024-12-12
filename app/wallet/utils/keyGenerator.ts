import { 
  blake2AsHex, 
  mnemonicGenerate, 
  mnemonicToMiniSecret, 
  ed25519PairFromSeed , 
} from '@polkadot/util-crypto';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { secp256k1 } from '@noble/curves/secp256k1';

export interface WalletAccount {
  address: string;
  type: 'sr25519' | 'ecdsa';
  publicKey: string;
  privateKey: string;
}

export function generateDeterministicKey(
  username: string, 
  password: string, 
  type: 'sr25519' | 'ecdsa'
): WalletAccount {
  // Create a deterministic seed from username and password
  const combinedInput = `${username}:${password}`;
  const seedHex = blake2AsHex(combinedInput, 256); // returns a hex string like "0xabc..."
  
  // Convert hex string to Uint8Array, removing the '0x' prefix
  const seedBytes = hexToU8a(seedHex);

  if (type === 'sr25519') {
    // ed25519PairFromSeed expects a Uint8Array of length 32
    const keyPair = ed25519PairFromSeed(seedBytes);
    
    return {
      address: u8aToHex(keyPair.secretKey),
      type: 'sr25519',
      publicKey: keyPair.publicKey,
      privateKey: u8aToHex(keyPair.secretKey)
    };
  } else {
    // For ECDSA keys, we can use hashToPrivateKey with a Uint8Array as well
    const privateKey = secp256k1.utils.hashToPrivateKey(seedBytes);
    const publicKey = secp256k1.getPublicKey(privateKey);

    return {
      address: u8aToHex(publicKey),
      type: 'ecdsa',
      publicKey: u8aToHex(publicKey),
      privateKey: u8aToHex(privateKey)
    };
  }
}

export function storeWallet(wallet: WalletAccount) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('wallet', JSON.stringify(wallet));
  } else {
    console.warn('localStorage not available.');
  }
}

export function getStoredWallet(): WalletAccount | null {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('wallet');
    return stored ? JSON.parse(stored) : null;
  }
  console.warn('localStorage not available.');
  return null;
}
