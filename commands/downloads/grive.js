import fetch from 'node-fetch'

export default {
  command: ['drive', 'gdrive', 'googledrive'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply('《✧》 Por favor, envie um link válido do Google Drive.')
    }
    const url = args[0]
    if (!url.match(/drive\.google\.com\/(file\/d\/|open\?id=|uc\?id=)/)) {
      return m.reply('《✧》 O link não parece ser válido do Google Drive. Envie um link de compartilhamento correto.')
    }
    try {
      const result = await gdriveScraper(url)
      if (!result.status) {
        return m.reply('《✧》 Não foi possível obter o arquivo. Tente com outro link ou verifique se o arquivo está público.')
      }
      const { fileName, fileSize, mimetype, downloadUrl } = result.data
      const caption = `۟　ꕥ ᩧ　𓈒　ׄ　𝖦oogle 𝖣𝗋𝗂𝗏𝖾　ׅ　✿۟\n\n` +
        `ׄ ﹙ׅ☆﹚ּ *Nome* › ${fileName}\n` +
        `ׄ ﹙ׅ☆﹚ּ *Tamanho* › ${fileSize}\n` +
        `ׄ ﹙ׅ☆﹚ּ *Tipo* › ${mimetype}\n\n` +
        `𖣣ֶㅤ֯⌗ ☆  ⬭ *Link original* › ${url}`
      
      await client.sendMessage(m.chat, { 
        document: { url: downloadUrl }, 
        mimetype, 
        fileName, 
        caption 
      }, { quoted: m })
    } catch (e) {
      return m.reply(`> Ocorreu um erro inesperado ao executar o comando *\( {usedPrefix + command}*. Tente novamente ou contate o suporte se o problema persistir.\n> [Erro: * \){e.message}*]`)
    }
  }
}

async function gdriveScraper(url) {
  try {
    // Extrai o ID do arquivo do link (suporta vários formatos comuns de compartilhamento)
    let id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))?.[1]
    if (!id) throw new Error('Não foi possível encontrar o ID do arquivo no link.')

    let res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
      method: 'POST',
      headers: {
        'accept-encoding': 'gzip, deflate, br',
        'content-length': '0',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'origin': 'https://drive.google.com',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
        'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
        'x-drive-first-party': 'DriveWebUi',
        'x-json-requested': 'true'
      }
    })

    let responseText = await res.text()
    // Remove o prefixo ")]}'" que o Google adiciona em respostas JSON
    let jsonData = JSON.parse(responseText.slice(4))
    let { fileName, sizeBytes, downloadUrl } = jsonData

    if (!downloadUrl) {
      throw new Error('Limite de download excedido ou arquivo não público.')
    }

    let data = await fetch(downloadUrl)
    if (data.status !== 200) {
      throw new Error(data.statusText || 'Falha ao acessar o link de download.')
    }

    return {
      status: true,
      data: {
        downloadUrl,
        fileName,
        fileSize: `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`,
        mimetype: data.headers.get('content-type')
      }
    }
  } catch (error) {
    return { status: false, message: error.message }
  }
}