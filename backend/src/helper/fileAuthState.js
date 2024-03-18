const { initAuthCreds, BufferJSON, proto } = require('@whiskeysockets/baileys')
const { mkdir, readFile, stat, unlink, writeFile } = require('fs/promises')
const { join } = require('path')

/**
 * stores the full authentication state in a single folder.
 * Far more efficient than singlefileauthstate
 *
 * Again, I wouldn't endorse this for any production level use other than perhaps a bot.
 * Would recommend writing an auth state for use with a proper SQL or No-SQL DB
 * */
module.exports = useMultiFileAuthState = async (folder) => {
  const writeData = (data, file) => {
    return writeFile(join(folder, fixFileName(file)), JSON.stringify(data, BufferJSON.replacer))
  }

  const readData = async (file) => {
    try {
      const data = await readFile(join(folder, fixFileName(file)), { encoding: 'utf-8' })
      return JSON.parse(data, BufferJSON.reviver)
    } catch (error) {
      return null
    }
  }

  const removeData = async (file) => {
    try {
      await unlink(join(folder, fixFileName(file)))
    } catch {}
  }

  const folderInfo = await stat(folder).catch(() => {})
  if (folderInfo) {
    if (!folderInfo.isDirectory()) {
      throw new Error(
        `found something that is not a directory at ${folder}, either delete it or specify a different location`
      )
    }
  } else {
    await mkdir(folder, { recursive: true })
  }

  const fixFileName = (file) => file?.replace(/\//g, '__')?.replace(/:/g, '-')

  const creds = (await readData('creds.json')) || initAuthCreds()

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {}
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}.json`)
              if (type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value)
              }

              data[id] = value
            })
          )

          return data
        },
        set: async (data) => {
          const tasks = []
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id]
              const file = `${category}-${id}.json`
              tasks.push(value ? writeData(value, file) : removeData(file))
            }
          }

          await Promise.all(tasks)
        },
      },
    },
    saveCreds: () => {
      return writeData(creds, 'creds.json')
    },
  }
}
