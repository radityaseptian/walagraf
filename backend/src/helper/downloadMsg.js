import { downloadContentFromMessage } from '@whiskeysockets/baileys'

export async function downloadMessage(msg, msgType) {
  let buffer = Buffer.from([])
  try {
    const stream = await downloadContentFromMessage(msg, msgType)
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    return buffer.toString('base64')
  } catch (error) {
    console.log('error downloading file-message')
    return null
  }
}
