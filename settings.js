import fs from 'fs';
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'

global.owner = ['573196588149', '5492916450307', '5216671548329', '573247662531', '51921826291', '50493732693']
global.botNumber = ''

global.sessionName = 'Sessions/Owner'
global.version = '^2.0 - Latest'
global.dev = "© ⍴᥆ᥕᥱrᥱძ ᑲᥡ ⁱᵃᵐ|𝔇ĕ𝐬†𝓻⊙γ𒆜"
global.links = {
  api: 'https://api.stellarwa.xyz',
  channel: "https://whatsapp.com/channel/0029Vb64nWqLo4hb8cuxe23n",
  github: "https://github.com/iamDestroy/YukiBot-MD",
  gmail: "thekingdestroy507@gmail.com"
}
global.my = {
  ch: '120363401404146384@newsletter',
  name: 'ೃ࿔ ყµҡเ ωαɓσƭร - σƒƒเ૮เαℓ ૮ɦαɳɳεℓ .ೃ࿐',
}

global.mess = {
  socket: '《✧》 Este comando só pode ser executado por um Socket.',
  admin: '《✧》 Este comando só pode ser executado pelos Administradores do Grupo.',
  botAdmin: '《✧》 Este comando só pode ser executado se o Socket for Administrador do Grupo.'
}

global.APIs = {
  adonix: { url: "https://api-adonix.ultraplus.click", key: "Yuki-WaBot" },
  vreden: { url: "https://api.vreden.web.id", key: null },
  nekolabs: { url: "https://api.nekolabs.web.id", key: null },
  siputzx: { url: "https://api.siputzx.my.id", key: null },
  delirius: { url: "https://api.delirius.store", key: null },
  ootaizumi: { url: "https://api.ootaizumi.web.id", key: null },
  stellar: { url: "https://api.stellarwa.xyz", key: "YukiWaBot" },
  apifaa: { url: "https://api-faa.my.id", key: null },
  xyro: { url: "https://api.xyro.site", key: null },
  yupra: { url: "https://api.yupra.my.id", key: null }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  import(`\( {file}?update= \){Date.now()}`)
})