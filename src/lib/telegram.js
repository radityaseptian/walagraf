console.log('telegram')

// random message
const messageToSend = ['test message 1', 'test message 2', 'test message 3']

const random = (data) => data[Math.floor(Math.random() * data.length)]

window.addEventListener('message', async (event) => {
  if (event.source !== window) return
  if (event.data.action !== 'sendMessage') return

  const groups = apiManagerProxy.mirrors.peers
  // const groupEntries = Object.entries(groups).filter(
  //   ([key, data]) => data._ === 'channel' && data.participants_count >= 2000
  // )
  const groupEntries = Object.entries(groups).filter(([key, data]) => data._ === 'channel')

  if (!groupEntries.length) return

  const [peerId, group] = random(groupEntries)

  const text = random(messageToSend)

  const date = Date.now() / 1000

  const payload = {
    text,
    date,
    success: true,
    type: 'telegram',
    userId: window.appImManager.myId.toString(),
    group: {
      id: peerId,
      title: group.title,
    },
  }

  try {
    await appImManager.managers.appMessagesManager.sendText({ peerId, text })
  } catch (error) {
    payload.success = false
    payload.error = error?.stack || error?.message || String(error)
  } finally {
    window.postMessage({ action: 'payload', data: payload }, '*')
    console.log(group, payload)
  }
})
