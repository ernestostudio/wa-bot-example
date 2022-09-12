// WhatsApp Modules API
const makeWASocket = require('@adiwajshing/baileys').default
const {
  DisconnectReason,
  useSingleFileAuthState,
  downloadContentFromMessage,
  downloadMediaMessage,
  getMessageFromStore,
  fetchLatestBaileysVersion
} = require('@adiwajshing/baileys')
const { Boom } = require('@hapi/boom')
// Modules Bawaan Nodejs
const fs = require('fs')
const path = require("path")
const os = require("os")
const exec = require("child_process").exec
const directoryFiles = path.resolve();

// Function Start
async function connectToWhatsApp() {
  // WhatsApp Sesi
 const { state, saveState } = useSingleFileAuthState('./session.json')
 // Initialsetup WhatsApp Socket
 const sock = makeWASocket({
   auth: state,
   printQRInTerminal: true,
   syncFullHistory: false,
   logger: require("pino")({ level: 'silent' }),
   browser: ["WhatsApp Bot", "chronme", '10.21.2']
 })
 // Memperbarui Kredential Sesi WhatsApp
 sock.ev.on('creds.update', saveState)

 // Memperbarui Koneksi
 sock.ev.on('connection.update', (update) => {
   const { connection, lastDisconnect } = update
     // Jika Koneksi Tertutup
     if(connection === 'close') {
       const shouldReconnect = lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut
         console.log(`Koneksi Ke WhatsApp Ditutup Karena ${lastDisconnect.error}`)
         console.log(`${shouldReconnect? "Mencoba Menghubungkan Kembali..." : "Tutup Proses..."}`)
        if(shouldReconnect) {
          connectToWhatsApp()
          console.log("Mencoba Untuk Terhubung...")
        }
      } else if(connection === 'open') {
        console.log("Terhubung Ke WhatsApp !")
      }
  })
  // Event Untuk Seseorang Menelpon / Panggil
  sock.ev.on('call', async (data) => {
    console.log(data)
    let calling = []
    calling.push(data[0].from)
    if(data[0].status === 'offer') {
      // Apa Yang Kamu Lakukan Jika Seseorang Memulai Menelpon Kamu...
    }
    if(data[0].status === 'timeout') {
      // Apa Yang Kamu Lakukan Jika Seseorang Berhenti Menelpon Kamu...
    }
  })
  // Socket Events Listener Message
  sock.ev.on('messages.upsert', async (Message) => {
    let m = Message.messages[0]
    let msg = m.message?.conversation
           || m.message?.text
           || m.message?.extendedTextMessage?.text
           || m.message?.buttonsResponseMessage?.selectedButtonId
           || m.message?.listResponseMessage?.singleSelectReply?.selectedRowId
           || m.message?.videoMessage?.caption
           || m.message?.imageMessage?.caption
    let mentionsId =  m.message?.extendedTextMessage?.contextInfo?.mentionedJid
           || m.message?.buttonsResponseMessage?.contextInfo?.mentionedJid
           || m.message?.listResponseMessage?.contextInfo?.mentionedJid
           || m.message?.videoMessage?.contextInfo?.mentionedJid
           || m.message?.imageMessage?.contextInfo?.mentionedJid
    let chatId = m.key.remoteJid
    let sender = m.key.participant || chatId
    let pushname = m.pushName?.replace(/\n/g, "")?.replace(/([.#$∆`*©®™℅£√~])/g, "").replace(/  /g, "") || "~"
    let tagusers = []; tagusers.push(sender)
    let cmd =  msg?.split(" ")[0]?.split(".")[1]?.toLowerCase() || ""
    let perfix = msg?.split(" ")[0]?.replace(cmd, "")
    let querymsg = msg?.replace(msg.split(" ")[0], "")?.replace(" ", "") || undefined

    // Memulai Fungsi
    if(cmd === "ping") {
      sock.sendMessage(chatId, {
       text: `@${sender?.split("@")[0]?.split(":")[0]} Pong 🏓!`,
       mentions: tagusers
      }, { quoted:m })
    }

    console.log(JSON.stringify(m, null, 2))
  })
}
// Start
connectToWhatsApp()
