import fetch from 'node-fetch'

export default {
  command: ['fb', 'facebook', 'fbvideo', 'fbdown'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply('《✧》 Por favor, envie um link do Facebook válido.')
    }
    if (!args[0].match(/facebook\.com|fb\.watch|video\.fb\.com/)) {
      return m.reply('《✧》 O link é inválido. Envie um link válido do Facebook (post, vídeo, reel, etc.).')
    }
    try {
      const data = await getFacebookMedia(args[0])
      if (!data) return m.reply('《✧》 Não foi possível obter o conteúdo. Tente outro link ou API.')
      
      const caption =
        `ㅤ۟∩　ׅ　★　ׅ　🅕𝖡 🅓ownload　ׄᰙ　\n\n` +
        `${data.title ? `𖣣ֶㅤ֯⌗ ☆  ׄ ⬭ *Título* › ${data.title}\n` : ''}` +
        `${data.resolution ? `𖣣ֶㅤ֯⌗ ☆  ׄ ⬭ *Resolução* › ${data.resolution}\n` : ''}` +
        `${data.format ? `𖣣ֶㅤ֯⌗ ☆  ׄ ⬭ *Formato* › ${data.format}\n` : ''}` +
        `${data.duration ? `𖣣ֶㅤ֯⌗ ☆  ׄ ⬭ *Duração* › ${data.duration}\n` : ''}` +
        `𖣣ֶㅤ֯⌗ ☆  ׄ ⬭ *Link original* › ${args[0]}`
      
      if (data.type === 'video') {
        await client.sendMessage(m.chat, { 
          video: { url: data.url }, 
          caption, 
          mimetype: 'video/mp4', 
          fileName: 'fbvideo.mp4' 
        }, { quoted: m })
      } else if (data.type === 'image') {
        await client.sendMessage(m.chat, { 
          image: { url: data.url }, 
          caption 
        }, { quoted: m })
      } else {
        throw new Error('Tipo de conteúdo não suportado.')
      }
    } catch (e) {
      await m.reply(`> Ocorreu um erro inesperado ao executar o comando *\( {usedPrefix + command}*. Tente novamente ou contate o suporte se o problema persistir.\n> [Erro: * \){e.message}*]`)
    }
  }
}

async function getFacebookMedia(url) {
  const apis = [
    { 
      endpoint: `\( {global.APIs.stellar.url}/dl/facebook?url= \){encodeURIComponent(url)}&key=${global.APIs.stellar.key}`, 
      extractor: res => {
        if (!res.status || !Array.isArray(res.resultados)) return null
        const hd = res.resultados.find(x => x.quality?.includes('720p'))
        const sd = res.resultados.find(x => x.quality?.includes('360p'))
        const media = hd || sd
        if (!media?.url) return null
        return { 
          type: 'video', 
          title: null, 
          resolution: media.quality || null, 
          format: 'mp4', 
          url: media.url 
        }
      }
    },
    { 
      endpoint: `\( {global.APIs.ootaizumi.url}/downloader/facebook?url= \){encodeURIComponent(url)}`, 
      extractor: res => {
        if (!res.status || !res.result?.downloads?.length) return null
        const hd = res.result.downloads.find(x => x.quality?.includes('720p'))
        const sd = res.result.downloads.find(x => x.quality?.includes('360p'))
        const media = hd || sd
        if (!media?.url) return null
        return { 
          type: media.url.includes('.jpg') ? 'image' : 'video', 
          title: null, 
          resolution: media.quality || null, 
          format: media.url.includes('.jpg') ? 'jpg' : 'mp4', 
          url: media.url, 
          thumbnail: res.result.thumbnail || null 
        }
      }
    },    
    { 
      endpoint: `\( {global.APIs.vreden.url}/api/v1/download/facebook?url= \){encodeURIComponent(url)}`, 
      extractor: res => {
        if (!res.status || !res.result?.download) return null
        const hd = res.result.download.hd
        const sd = res.result.download.sd
        const urlVideo = hd || sd
        if (!urlVideo) return null
        return { 
          type: 'video', 
          title: res.result.title || null, 
          resolution: hd ? 'HD' : 'SD', 
          format: 'mp4', 
          url: urlVideo, 
          thumbnail: res.result.thumbnail || null, 
          duration: res.result.durasi || null 
        }
      }
    },
    { 
      endpoint: `\( {global.APIs.delirius.url}/download/facebook?url= \){encodeURIComponent(url)}`, 
      extractor: res => {
        if (!res.urls || !Array.isArray(res.urls)) return null
        const hd = res.urls.find(x => x.hd)?.hd
        const sd = res.urls.find(x => x.sd)?.sd
        const urlVideo = hd || sd
        if (!urlVideo) return null
        return { 
          type: 'video', 
          title: res.title || null, 
          resolution: hd ? 'HD' : 'SD', 
          format: 'mp4', 
          url: urlVideo 
        }
      }
    }
  ]

  for (const { endpoint, extractor } of apis) {
    try {
      const res = await fetch(endpoint).then(r => r.json())
      const result = extractor(res)
      if (result) return result
    } catch {}
    await new Promise(r => setTimeout(r, 500)) // Delay entre tentativas para evitar ban
  }
  return null
}