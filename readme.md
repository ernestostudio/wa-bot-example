## WhatsApp Bot

Hanya Sebuah Sample Scripts Untuk WhatsApp Bot

### Normal Pengiriman
```js
// Default
const id = "62812233452316@s.whatsapp.net"
sock.sendMessage(id, {
  text: "Pong 🏓"
})
```
```js
// Dari Fungsi
if(cmd === "ping") {
  sock.sendMessage(chatId, {
    text: "Pong 🏓"
  })
}
```

### Tambahin "quoted" untuk reply chat
```js
// Default
const id = "62812233452316@s.whatsapp.net"
sock.sendMessage(id, {
  text: "Pong 🏓"
}, { quoted: {
  key: {
    remoteJid: "status@broadcast",
    fromMe: true,
    id: '893ADKHDN930KFLSVJS94002JFISJF',
    participant: id
  },
    messageTimestamp: 1662974601,
    pushName: 'Fake Kominfo',
    status: 2,
    message: { conversation: '.ping' }
  }
})
```
```js
// Dari Fungsi
if(cmd === "ping") {
  sock.sendMessage(chatId, {
    text: "Pong 🏓"
  }, { quoted:m })
}
```

### Tag Saya
```js
sock.sendMessage(chatId, {
  text: "@"+ sender.split("@")[0]?.split(":")[0],
  mentions: tagusers
}, { quoted:m })
```
