const { Keypair, Connection, LAMPORTS_PER_SOL, clusterApiUrl } = require('@solana/web3.js');
const bip39 = require('bip39');
const Store = require('electron-store');

const store = new Store({
  name: 'agentshare-wallet',
  encryptionKey: 'agentshare-local-enc-key-v1',
});

const RPC_ENDPOINT = process.env.SOLANA_RPC || clusterApiUrl('mainnet-beta');

let keypair = null;
let connection = null;

async function init() {
  connection = new Connection(RPC_ENDPOINT, 'confirmed');

  const savedSecret = store.get('keypair.secret');
  if (savedSecret) {
    const secretKey = Uint8Array.from(JSON.parse(savedSecret));
    keypair = Keypair.fromSecretKey(secretKey);
    console.log('[wallet] 기존 키페어 로드:', keypair.publicKey.toBase58());
  } else {
    // 최초 실행: 새 keypair 생성
    const mnemonic = bip39.generateMnemonic();
    keypair = Keypair.generate();

    store.set('keypair.secret', JSON.stringify(Array.from(keypair.secretKey)));
    store.set('keypair.mnemonic', mnemonic); // 백업용 (실제론 니모닉→시드 파생 필요)
    console.log('[wallet] 새 키페어 생성:', keypair.publicKey.toBase58());
  }
}

function getPublicKey() {
  if (!keypair) return null;
  return keypair.publicKey.toBase58();
}

async function getBalance() {
  if (!keypair || !connection) return 0;
  try {
    const lamports = await connection.getBalance(keypair.publicKey);
    return lamports / LAMPORTS_PER_SOL;
  } catch (err) {
    console.warn('[wallet] 잔액 조회 실패:', err.message);
    return 0;
  }
}

function signTransaction(transaction) {
  if (!keypair) throw new Error('키페어 미초기화');
  transaction.sign(keypair);
  return transaction;
}

function getKeypair() {
  return keypair;
}

module.exports = { init, getPublicKey, getBalance, signTransaction, getKeypair };
