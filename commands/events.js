import fetch from 'node-fetch'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import chalk from 'chalk'

export default async (client, m) => {
  client.ev.on('group-participants.update', async (anu) => {
    try {
      const metadata = await client.groupMetadata(anu.id).catch(() => null)
      const groupAdmins = metadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
      const chat = global?.db?.data?.chats?.[anu.id]
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const primaryBotId = chat?.primaryBot
      const memberCount = metadata.participants.length      
      const isSelf = global.db.data.settings[botId]?.self ?? false
      if (isSelf) return
      for (const p of anu.participants) {
        const jid = p  // Aqui parece um erro no original; deve ser p.id ou similar, mas mantive como está
        const phone = jid.split('@')[0] || jid.split('@')[0]
        const pp = await client.profilePictureUrl(jid, 'image').catch(_ => 'https://cdn.yuki-wabot.my.id/files/2PVh.jpeg')       
        const mensagens = { 
          add: chat.sWelcome ? `\n┊➤ \( {chat.sWelcome.replace(/{usuario}/g, `@ \){phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sem Descrição ✿')}` : '', 
          remove: chat.sGoodbye ? `\n┊➤ \( {chat.sGoodbye.replace(/{usuario}/g, `@ \){phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sem Descrição ✿')}` : '', 
          leave: chat.sGoodbye ? `\n┊➤ \( {chat.sGoodbye.replace(/{usuario}/g, `@ \){phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sem Descrição ✿')}` : '' 
        }
        const fakeContext = {
          contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: global.db.data.settings[botId].id,
              serverMessageId: '0',
              newsletterName: global.db.data.settings[botId].nameid
            },
            externalAdReply: {
              title: global.db.data.settings[botId].namebot,
              body: dev,  // 'dev' provavelmente é uma variável definida em outro lugar (dev info?)
              mediaUrl: null,
              description: null,
              previewType: 'PHOTO',
              thumbnailUrl: global.db.data.settings[botId].icon,
              sourceUrl: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].link,
              mediaType: 1,
              renderLargerThumbnail: false
            },
            mentionedJid: [jid]
          }
        }
        if (anu.action === 'add' && chat?.welcome && (!primaryBotId || primaryBotId === botId)) {
          const caption = `╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Bem-vindo(a) (⁠ ⁠ꈍ⁠ᴗ⁠ꈍ⁠)* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nome ›* @${phone}
┊  *Grupo ›* ${metadata.subject}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Use /menu para ver os comandos.*
┊➤ *Agora somos ${memberCount} membros.* ${mensagens[anu.action]}
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯`
          await client.sendMessage(anu.id, { image: { url: pp }, caption, ...fakeContext })     
        }
        if ((anu.action === 'remove' || anu.action === 'leave') && chat?.goodbye && (!primaryBotId || primaryBotId === botId)) {
          const caption = `╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Até logo (⁠╥⁠﹏⁠╥⁠)* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nome ›* @${phone}
┊  *Grupo ›* ${metadata.subject}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Espero que volte logo.*
┊➤ *Agora somos ${memberCount} membros.* ${mensagens[anu.action]}
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯`
          await client.sendMessage(anu.id, { image: { url: pp }, caption, ...fakeContext })
        }
        if (anu.action === 'promote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, { text: `「✎」 *@\( {phone}* foi promovido a Administrador por *@ \){usuario.split('@')[0]}*.`, mentions: [jid, usuario, ...groupAdmins.map(v => v.id)] })
        }
        if (anu.action === 'demote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, { text: `「✎」 *@\( {phone}* foi rebaixado de Administrador por *@ \){usuario.split('@')[0]}*.`, mentions: [jid, usuario, ...groupAdmins.map(v => v.id)] })
        }
      }
    } catch (err) {
      console.log(chalk.gray(`[ BOT  ]  → ${err}`))
    }
  })
  client.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.messageStubType) return
    const id = m.key.remoteJid
    const chat = global.db.data.chats[id]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const primaryBotId = chat?.primaryBot
    if (!chat?.alerts || (primaryBotId && primaryBotId !== botId)) return
    const isSelf = global.db.data.settings[botId]?.self ?? false
    if (isSelf) return
    const actor = m.key?.participant || m.participant || m.key?.remoteJid
    const phone = actor.split('@')[0]
    const groupMetadata = await client.groupMetadata(id).catch(() => null)
    const groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
    if (m.messageStubType == 21) {
      await client.sendMessage(id, { text: `「✎」 @\( {phone} mudou o nome do grupo para * \){m.messageStubParameters[0]}*`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 22) {
      await client.sendMessage(id, { text: `「✎」 @${phone} mudou o ícone do grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 23) {
      await client.sendMessage(id, { text: `「✎」 @${phone} redefiniu o link do grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 24) {
      await client.sendMessage(id, { text: `「✎」 @${phone} mudou a descrição do grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 25) {
      await client.sendMessage(id, { text: `「✎」 @${phone} mudou as configurações do grupo para permitir que ${m.messageStubParameters[0] == 'on' ? 'apenas admins' : 'todos'} possam editar as infos do grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 26) {
      await client.sendMessage(id, { text: `「✎」 @${phone} mudou as configurações do grupo para permitir que ${m.messageStubParameters[0] === 'on' ? 'apenas os administradores possam enviar mensagens.' : 'todos os membros possam enviar mensagens.'}`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
  })
}