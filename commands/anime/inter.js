import fetch from 'node-fetch';
import { resolveLidToRealJid } from "../../lib/utils.js"

// Legendas para cada ação (captions)
const captions = {
  peek: (from, to, genero) => from === to ? 'está espiando atrás de uma porta por diversão.' : 'está espiando',
  comfort: (from, to) => (from === to ? 'está se consolando sozinho.' : 'está consolando'),
  thinkhard: (from, to) => from === to ? 'ficou pensando muito intensamente.' : 'está pensando profundamente em',
  curious: (from, to) => from === to ? 'está curioso com tudo.' : 'está curioso com o que',
  sniff: (from, to) => from === to ? 'está cheirando como se procurasse algo estranho.' : 'está cheirando',
  stare: (from, to) => from === to ? 'ficou olhando pro teto sem motivo.' : 'está encarando fixamente',
  trip: (from, to) => from === to ? 'tropeçou em si mesmo, de novo.' : 'tropeçou acidentalmente em',
  blowkiss: (from, to) => (from === to ? 'mandou um beijo pro espelho.' : 'mandou um beijinho pra'),
  snuggle: (from, to) => from === to ? 'se aninhou com um travesseiro fofinho.' : 'se aninhou carinhosamente com',
  sleep: (from, to, genero) => from === to ? 'está dormindo tranquilamente.' : 'está dormindo com',
  cold: (from, to, genero) => (from === to ? 'está com muito frio.' : 'está congelando de frio por causa de'),
  sing: (from, to, genero) => (from === to ? 'está cantando.' : 'está cantando pra'),
  tickle: (from, to, genero) => from === to ? 'está fazendo cócegas em si mesmo.' : 'está fazendo cócegas em',
  scream: (from, to, genero) => (from === to ? 'está gritando pro vento.' : 'está gritando com'),
  push: (from, to, genero) => (from === to ? 'se empurrou sozinho.' : 'empurrou'),
  nope: (from, to, genero) => (from === to ? 'expressa claramente sua discordância.' : 'diz “Não!” pra'),
  jump: (from, to, genero) => (from === to ? 'pula de felicidade.' : 'pula feliz com'),
  heat: (from, to, genero) => (from === to ? 'está sentindo muito calor.' : 'está com calor por causa de'),
  gaming: (from, to, genero) => (from === to ? 'está jogando sozinho.' : 'está jogando com'),
  draw: (from, to, genero) => (from === to ? 'está fazendo um desenho fofo.' : 'está desenhando inspirado em'),
  call: (from, to, genero) => from === to ? 'ligou pro próprio número esperando resposta.' : 'ligou pro número de',
  seduce: (from, to, genero) => from === to ? 'lançou um olhar sedutor pro vazio.' : 'está tentando seduzir',
  shy: (from, to, genero) => from === to ? `ficou envergonhado e desviou o olhar.` : `está muito ${genero === 'Hombre' ? 'tímido' : genero === 'Mujer' ? 'tímida' : 'tímide'} pra olhar pra`,
  slap: (from, to, genero) => from === to ? `deu um tapa na própria cara.` : 'deu um tapa em',
  bath: (from, to) => (from === to ? 'está tomando banho.' : 'está dando banho em'),
  angry: (from, to, genero) => from === to ? `está muito ${genero === 'Hombre' ? 'bravo' : genero === 'Mujer' ? 'brava' : 'bravx'}.` : `está super ${genero === 'Hombre' ? 'bravo' : genero === 'Mujer' ? 'brava' : 'bravx'} com`,
  bored: (from, to, genero) => from === to ? `está muito ${genero === 'Hombre' ? 'entediado' : genero === 'Mujer' ? 'entediada' : 'entediadx'}.` : `está ${genero === 'Hombre' ? 'entediado' : genero === 'Mujer' ? 'entediada' : 'entediadx'} de`,
  bite: (from, to, genero) => from === to ? `mordeu a si mesm${genero === 'Hombre' ? 'o' : genero === 'Mujer' ? 'a' : 'x'}.` : 'mordeu',
  bleh: (from, to) => from === to ? 'mostrou a língua pro espelho.' : 'está fazendo careta com a língua pra',
  bonk: (from, to, genero) => from === to ? `deu um bonk na própria cabeça.` : 'deu um bonk em',
  blush: (from, to) => (from === to ? 'ficou corado.' : 'ficou corado por causa de'),
  impregnate: (from, to) => (from === to ? 'se engravidou.' : 'engravidou'),
  bully: (from, to, genero) => from === to ? `está fazendo bullying consigo mesm\( {genero === 'Hombre' ? 'o' : genero === 'Mujer' ? 'a' : 'x'}… alguém que abrace el \){genero === 'Hombre' ? 'e' : genero === 'Mujer' ? 'a' : 'x'}.` : 'está fazendo bullying com',
  cry: (from, to) => (from === to ? 'está chorando.' : 'está chorando por causa de'),
  happy: (from, to) => (from === to ? 'está feliz.' : 'está feliz com'),
  coffee: (from, to) => (from === to ? 'está tomando café.' : 'está tomando café com'),
  clap: (from, to) => (from === to ? 'está batendo palmas por algo.' : 'está batendo palmas por'),
  cringe: (from, to) => (from === to ? 'sentiu cringe.' : 'sentiu cringe por causa de'),
  dance: (from, to) => (from === to ? 'está dançando.' : 'está dançando com'),
  cuddle: (from, to, genero) => from === to ? `se aninhou sozinh${genero === 'Hombre' ? 'o' : genero === 'Mujer' ? 'a' : 'x'}.` : 'se aninhou com',
  drunk: (from, to, genero) => from === to ? `está muito ${genero === 'Hombre' ? 'bêbado' : genero === 'Mujer' ? 'bêbada' : 'bêbadx'}` : `está ${genero === 'Hombre' ? 'bêbado' : genero === 'Mujer' ? 'bêbada' : 'bêbadx'} com`,
  dramatic: (from, to) => from === to ? 'está fazendo um drama exagerado.' : 'está fazendo drama com',
  handhold: (from, to, genero) => from === to ? `segurou a própria mão.` : 'segurou a mão de',
  eat: (from, to) => (from === to ? 'está comendo algo delicioso.' : 'está comendo com'),
  highfive: (from, to) => from === to ? 'deu high-five no espelho.' : 'deu high-five com',
  hug: (from, to, genero) => from === to ? `se abraçou sozinh${genero === 'Hombre' ? 'o' : genero === 'Mujer' ? 'a' : 'x'}.` : 'deu um abraço em',
  kill: (from, to) => (from === to ? 'se auto-eliminou de forma dramática.' : 'matou'),
  kiss: (from, to) => (from === to ? 'mandou um beijo pro ar.' : 'deu um beijo em'),
  kisscheek: (from, to) => from === to ? 'beijou a própria bochecha no espelho.' : 'deu um beijo na bochecha de',
  lick: (from, to) => (from === to ? 'se lambeu por curiosidade.' : 'lambeu'),
  laugh: (from, to) => (from === to ? 'está rindo de algo.' : 'está rindo de'),
  pat: (from, to) => (from === to ? 'fez carinho na própria cabeça.' : 'fez carinho em'),
  love: (from, to, genero) => from === to ? `se ama muito a si mesm${genero === 'Hombre' ? 'o' : genero === 'Mujer' ? 'a' : 'x'}.` : 'sente atração por',
  pout: (from, to, genero) => from === to ? `está fazendo biquinho sozinh${genero === 'Hombre' ? 'o' : genero === 'Mujer' ? 'a' : 'x'}.` : 'está fazendo biquinho com',
  punch: (from, to) => (from === to ? 'deu um soco no ar.' : 'deu um soco em'),
  run: (from, to) => (from === to ? 'está correndo pela vida.' : 'está correndo com'),
  scared: (from, to, genero) => from === to ? `está ${genero === 'Hombre' ? 'assustado' : genero === 'Mujer' ? 'assustada' : 'assustadx'} com algo.` : `está ${genero === 'Hombre' ? 'assustado' : genero === 'Mujer' ? 'assustada' : 'assustadx'} por causa de`,
  sad: (from, to) => (from === to ? 'está triste.' : 'está expressando tristeza pra'),
  smoke: (from, to) => (from === to ? 'está fumando tranquilamente.' : 'está fumando com'),
  smile: (from, to) => (from === to ? 'está sorrindo.' : 'sorriu pra'),
  spit: (from, to, genero) => from === to ? `cuspiu em si mesm${genero === 'Hombre' ? 'o' : genero === 'Mujer' ? 'a' : 'x'} por acidente.` : 'cuspiu em',
  smug: (from, to) => (from === to ? 'está se achando muito ultimamente.' : 'está se achando pra'),
  think: (from, to) => from === to ? 'está pensando profundamente.' : 'não consegue parar de pensar em',
  step: (from, to, genero) => from === to ? `pisou no próprio pé por acidente.` : 'está pisando em',
  wave: (from, to, genero) => from === to ? `se acenou pra si mesm${genero === 'Hombre' ? 'o' : genero === 'Mujer' ? 'a' : 'x'} no espelho.` : 'está acenando pra',
  walk: (from, to) => (from === to ? 'saiu pra caminhar sozinho.' : 'decidiu passear com'),
  wink: (from, to, genero) => from === to ? `piscou pra si mesm${genero === 'Hombre' ? 'o' : genero === 'Mujer' ? 'a' : 'x'} no espelho.` : 'piscou pra',
  psycho: (from, to) => from === to ? 'está agindo como psicopata.' : 'está tendo um surto de loucura por causa de',
  poke: (from, to) => from === to ? 'cutucou a si mesmo.' : 'cutucou',
  cook: (from, to) => from === to ? 'está concentrado na cozinha.' : 'está se divertindo cozinhando com',
  lewd: (from, to) => from === to ? 'está se comportando de forma provocante.' : 'está se movendo de forma sedutora pra',
  greet: (from, to) => from === to ? 'estende a mão pra se cumprimentar.' : 'estende a mão pra cumprimentar',
  facepalm: (from, to) => from === to ? 'ficou frustrado e deu uma palmada na cara.' : 'deu uma palmada na cara por causa de',
}

// Símbolos fofos aleatórios
const symbols = ['(⁠◠⁠‿⁠◕⁠)', '˃͈◡˂͈', '૮(˶ᵔᵕᵔ˶)ა', '(づ｡◕‿‿◕｡)づ', '(✿◡‿◡)', '(꒪⌓꒪)', '(✿✪‿✪｡)', '(*≧ω≦)', '(✧ω◕)', '˃ 𖥦 ˂', '(⌒‿⌒)', '(¬‿¬)', '(✧ω✧)', '✿(◕ ‿◕)✿', 'ʕ•́ᴥ•̀ʔっ', '(ㅇㅅㅇ❀)', '(∩︵∩)', '(✪ω✪)', '(✯◕‿◕✯)', '(•̀ᴗ•́)و ̑̑']

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)]
}

// Aliases para comandos (palavras que ativam a ação)
const alias = {
  psycho: ['psycho', 'locura', 'louco', 'louca'],
  poke: ['poke', 'picar', 'cutucar'],
  cook: ['cook', 'cocinar', 'cozinhar'],
  lewd: ['lewd', 'provocativo', 'provocativa', 'safado', 'safada'],
  greet: ['greet', 'saludar', 'hola', 'oi', 'olá', 'hi'],
  facepalm: ['facepalm', 'palmada', 'frustração'],
  angry: ['angry', 'enojado', 'bravo', 'brava'],
  bleh: ['bleh', 'lingua'],
  bored: ['bored', 'entediado', 'entediada'],
  clap: ['clap', 'aplaudir', 'palmas'],
  coffee: ['coffee', 'cafe', 'café'],
  dramatic: ['dramatic', 'drama'],
  drunk: ['drunk', 'bebado', 'bebada'],
  cold: ['cold', 'frio'],
  impregnate: ['impregnate', 'preg', 'preñar', 'engravidar'],
  kisscheek: ['kisscheek', 'beijo', 'bochecha'],
  laugh: ['laugh', 'rir'],
  love: ['love', 'amor'],
  pout: ['pout', 'biquinho', 'mueca'],
  punch: ['punch', 'soco', 'golpear'],
  run: ['run', 'correr'],
  sad: ['sad', 'triste'],
  scared: ['scared', 'assustado', 'medo'],
  seduce: ['seduce', 'seduzir'],
  shy: ['shy', 'timido', 'timida', 'vergonha'],
  sleep: ['sleep', 'dormir'],
  smoke: ['smoke', 'fumar'],
  spit: ['spit', 'cuspir'],
  step: ['step', 'pisar'],
  think: ['think', 'pensar'],
  walk: ['walk', 'caminhar'],
  hug: ['hug', 'abraçar'],
  kill: ['kill', 'matar'],
  eat: ['eat', 'nom', 'comer'],
  kiss: ['kiss', 'muak', 'beijar'],
  wink: ['wink', 'piscar'],
  pat: ['pat', 'acariciar', 'cafuné'],
  happy: ['happy', 'feliz'],
  bully: ['bully', 'molestar', 'zoar'],
  bite: ['bite', 'morder'],
  blush: ['blush', 'corar', 'sonrojarse'],
  wave: ['wave', 'acenar'],
  bath: ['bath', 'banho'],
  smug: ['smug', 'se achar'],
  smile: ['smile', 'sorrir'],
  highfive: ['highfive', 'chocar', 'toca aqui'],
  handhold: ['handhold', 'segurar mão', 'dar as mãos'],
  cringe: ['cringe', 'mueca'],
  bonk: ['bonk', 'bonk', 'golpe'],
  cry: ['cry', 'chorar'],
  lick: ['lick', 'lamber'],
  slap: ['slap', 'tapa', 'bofetada'],
  dance: ['dance', 'dançar'],
  cuddle: ['cuddle', 'aninhar'],
  sing: ['sing', 'cantar'],
  tickle: ['tickle', 'cosquillas', 'cócegas'],
  scream: ['scream', 'gritar'],
  push: ['push', 'empurrar'],
  nope: ['nope', 'não'],
  jump: ['jump', 'pular'],
  heat: ['heat', 'calor'],
  gaming: ['gaming', 'jogar'],
  draw: ['draw', 'desenhar'],
  call: ['call', 'ligar'],
  snuggle: ['snuggle', 'aconchegar'],
  blowkiss: ['blowkiss', 'beijinho no ar'],
  trip: ['trip', 'tropeçar'],
  stare: ['stare', 'encarar'],
  sniff: ['sniff', 'cheirar'],
  curious: ['curious', 'curioso', 'curiosa'],
  thinkhard: ['thinkhard', 'pensar muito'],
  comfort: ['comfort', 'consolar'],
  peek: ['peek', 'espiar'],
};

export default {
  command: Object.keys(alias).flatMap(key => alias[key]), // Todos os aliases viram comandos
  category: 'anime',
  run: async (client, m, args, usedPrefix, command) => {
    // Encontra a ação principal pelo alias usado
    const currentCommand = Object.keys(alias).find(key => alias[key].includes(command)) || command;
    if (!captions[currentCommand]) return;

    let mentionedJid = m.mentionedJid;
    let who2 = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    const who = await resolveLidToRealJid(who2, client, m.chat);

    const fromName = global.db.data.users[m.sender]?.name || '@' + m.sender.split('@')[0];
    const toName = global.db.data.users[who]?.name || '@' + who.split('@')[0];
    const genero = global.db.data.users[m.sender]?.genre || 'Oculto';

    const captionText = captions[currentCommand](fromName, toName, genero);
    const caption = who !== m.sender 
      ? `\`${fromName}.\` \( {captionText} \` \){toName}.\` ${getRandomSymbol()}.`
      : `\`${fromName}\` ${captionText} ${getRandomSymbol()}.`;

    try {
      const response = await fetch(`https://tenor.googleapis.com/v2/search?q=anime+${encodeURIComponent(currentCommand)}&key=AIzaSyCY8VRFGjKZ2wpAoRTQ3faV_XcwTrYL5DA&limit=20`);
      const json = await response.json();
      const gifs = json.results;

      if (!gifs || gifs.length === 0) throw new Error('Nenhum resultado encontrado na API do Tenor.');

      const media = gifs[Math.floor(Math.random() * gifs.length)].media_formats;
      const url = media.mp4?.url || media.tinymp4?.url || media.loopedmp4?.url || media.gif?.url || media.tinygif?.url;

      if (!url) throw new Error('Nenhum formato compatível encontrado no Tenor.');

      await client.sendMessage(m.chat, { 
        video: { url }, 
        gifPlayback: true, 
        caption, 
        mentions: [who, m.sender] 
      }, { quoted: m });

    } catch (e) {
      await m.reply(`> Ocorreu um erro inesperado ao executar o comando *\( {usedPrefix + command}*. Tente novamente ou contate o suporte se o problema persistir.\n> [Erro: * \){e.message}*]`);
    }
  },
};