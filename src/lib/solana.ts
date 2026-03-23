import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

export const SOLANA_RPC = 'https://api.devnet.solana.com'
export const connection = new Connection(SOLANA_RPC, 'confirmed')

// 에이전트 사용 수수료: 0.001 SOL (devnet 테스트용)
export const AGENT_USE_FEE = 0.001

export async function sendPayment(
  senderPublicKey: PublicKey,
  recipientWallet: string,
  amountSOL: number,
  signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<string> {
  const recipient = new PublicKey(recipientWallet)
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: recipient,
      lamports: Math.floor(amountSOL * LAMPORTS_PER_SOL),
    })
  )

  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = senderPublicKey

  const signed = await signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signed.serialize())
  await connection.confirmTransaction(signature)

  return signature
}
