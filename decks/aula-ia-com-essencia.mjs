/* ---------------------------------------------------------------------------
   AULA · IA COM ESSÊNCIA
   Como usar o livro para construir o Brand Book Vivo da sua marca.

   Formato didatico: o aluno acompanha de celular na mao. Cada capitulo tem
   sua ficha, com o QR do Google Docs e o QR do agente extraidos do livro.

   Duracao: 50 minutos. Cada slide leva nota de orador com o minuto de entrada.

   Conteudo extraido do livro "IA com Essencia" (Kelly Albert, 1a edicao).
   QR codes decodificados do PDF do livro e regerados — ver decks/links-livro.json.

   Montar:  node decks/aula-ia-com-essencia.mjs
   --------------------------------------------------------------------------- */

import {
  novoDeck, slide, salvar, rodape, rotulo, microRotulo, titulo, lead, corpo,
  legenda, fio, reguaAcento, card, numeroSecao, colunas, marcadores, citacao,
  percurso, listaNumerada, contraposicao, qrBloco, molduraImagem,
  slideAbertura, slideCapa, slideSecao, slidePergunta, slideDeclaracao,
  slideEncerramento, slideFicha, GRADE, TAM, COR,
} from '../build/pptx/sistema-pptx.mjs';

const ENTREGA = 'IA com Essência · A Aula';
const ALUNO = 'Kelly Albert';
const pres = novoDeck({ titulo: 'IA com Essência — A Aula' });

const rod = (s) => rodape(s, ENTREGA, ALUNO);
const nota = (s, minuto, txt) => s.addNotes(`[${minuto}]\n${txt}`);
const qr = (cap, tipo) => `assets/qr/cap${cap}-${tipo}.png`;

/* ===========================================================================
   BLOCO 0 · ABERTURA — 4 min
   =========================================================================== */

nota(slideAbertura(pres), '00:00 · 30s',
  'Silencio de abertura. Nome, o que voce faz, e por que esta aula existe: ' +
  'o livro so funciona se for usado. Esta aula garante que ele seja.');

nota(slideCapa(pres, {
  titulo: 'IA com Essência',
  cliente: 'A Aula',
  subtitulo: 'Como transformar o livro no Brand Book Vivo da sua marca',
  data: '«mês/ano»',
}), '00:30 · 30s',
  'Leia o subtitulo em voz alta. Esta aula nao resume o livro: ensina a opera-lo.');

{
  const s = slide(pres);
  rotulo(s, 'Antes de começar', { y: 1.9 });
  titulo(s, 'Deixe estas quatro coisas\nabertas agora', { y: 2.45, w: 14 });
  fio(s, { y: 4.4, w: 16.2 });
  colunas(s, [
    { numero: 1, titulo: 'O livro', texto: 'Digital ou físico. Você vai escanear QR Codes a partir dele durante toda a aula.' },
    { numero: 2, titulo: 'O celular', texto: 'Com a câmera pronta. É por ele que você acessa os documentos e os agentes.' },
    { numero: 3, titulo: 'O ChatGPT', texto: 'Logado, no navegador ou no aplicativo. Os agentes vivem dentro dele.' },
    { numero: 4, titulo: 'Uma pasta', texto: 'No Drive ou no computador, chamada “Marca — IA com Essência”. Tudo será salvo ali.' },
  ], { y: 4.85, w: 16.2, alturaTexto: 1.8 });
  reguaAcento(s, { y: 7.7, w: 1.2 });
  lead(s, 'Esta aula é para fazer junto, não para assistir. Você sai daqui com o Capítulo 04 concluído.',
    { y: 8.0, w: 15, h: 0.9 });
  rod(s);
  nota(s, '01:00 · 1min30s',
    'Espere de verdade eles abrirem. Se ninguem abrir, a aula vira palestra e ' +
    'a entrega nao acontece. Confira em voz alta item por item.');
}

{
  const s = slide(pres);
  rotulo(s, 'O caminho de hoje', { y: 1.9 });
  titulo(s, 'Onze capítulos, um destino', { y: 2.45, w: 14 });
  fio(s, { y: 4.0, w: 16.2 });
  percurso(s, [
    'Cap. 01 a 03\nEntender a ferramenta',
    'Cap. 04\nQuem é você no negócio',
    'Cap. 05 a 08\nPosicionamento, voz,\narquitetura e forma',
    'Cap. 09 e 10\nPromessa e presença',
    'Cap. 11\nBrand Book Vivo',
  ], { y: 5.4, w: 16.2 });
  reguaAcento(s, { y: 8.1, w: 1.2 });
  lead(s, 'Cada capítulo gera um relatório. O Capítulo 11 junta todos e devolve o documento oficial da sua marca.',
    { y: 8.4, w: 15, h: 0.9 });
  rod(s);
  nota(s, '02:30 · 1min30s',
    'Mapa mental da aula. Mostre que os capitulos 1 a 3 sao preparo, e que a ' +
    'entrega comeca no 4.');
}

/* ===========================================================================
   BLOCO 1 · O ESSENCIAL ANTES DE COMECAR — 6 min
   =========================================================================== */

nota(slideSecao(pres, { numero: 1, nome: 'Antes da IA', entrega: ENTREGA, cliente: ALUNO }),
  '04:00 · 20s', 'Capitulos 01 a 03 do livro, condensados no que muda a pratica.');

nota(slideDeclaracao(pres, {
  sobretitulo: 'Capítulo 01 · O princípio',
  frase: 'Essência não se replica.\nClareza não se terceiriza.',
  desdobramento: 'A IA é um espelho matemático: devolve na mesma medida em que você a alimenta. Com confusão, devolve confusão. Com clareza, devolve precisão.',
  entrega: ENTREGA, cliente: ALUNO,
}), '04:20 · 1min20s',
  'Frase-chave do livro. Diga devagar. Tudo o que vem depois se apoia nela.');

{
  const s = slide(pres);
  numeroSecao(s, 'Capítulo 02', { x: GRADE.margem, y: 1.9 });
  rotulo(s, 'Como a IA pensa', { y: 2.3 });
  titulo(s, 'Não é sobre saber usar tecnologia.\nÉ sobre saber pedir com intenção.', { y: 2.85, w: 15 });
  fio(s, { y: 5.1, w: 16.2 });
  contraposicao(s, {
    y: 5.55,
    esquerda: {
      rotulo: 'Pedido genérico',
      titulo: '“Quero uma ideia de post.”',
      texto: 'A resposta vai ser qualquer coisa — porque qualquer coisa atende ao pedido.',
    },
    direita: {
      rotulo: 'Pedido com contexto', acento: true,
      titulo: '“Quero uma ideia de post para minha cafeteria artesanal, que valoriza pequenos produtores, para quem busca experiência e não preço.”',
      texto: 'A resposta muda por completo. O contexto não é enfeite: é o que produz precisão.',
    },
  });
  rod(s);
  nota(s, '05:40 · 1min50s',
    'Se houver tela, faca os dois pedidos AO VIVO no ChatGPT. O contraste e o ' +
    'argumento mais forte da aula inteira.');
}

{
  const s = slide(pres);
  numeroSecao(s, 'Capítulo 02', { x: GRADE.margem, y: 1.9 });
  rotulo(s, 'O que você precisa vigiar', { y: 2.3 });
  titulo(s, 'A IA não tem critério.\nO critério é seu.', { y: 2.85, w: 14 });
  fio(s, { y: 5.0, w: 16.2 });
  colunas(s, [
    { titulo: 'Alucinação', texto: 'Ela inventa informação falsa com total confiança. Sempre peça as fontes.' },
    { titulo: 'Viés', texto: 'Ela repete preconceitos que estavam nos dados com que foi treinada.' },
    { titulo: 'Desconexão', texto: 'O texto fica bonito, mas não tem nada a ver com a sua marca real.' },
    { titulo: 'Limite de memória', texto: 'Conversa longa começa a esquecer ou inventar. Quando notar, abra um chat novo.' },
  ], { y: 5.45, w: 16.2, alturaTexto: 1.7 });
  reguaAcento(s, { y: 8.1, w: 1.2 });
  lead(s, 'Por isso, no método, quem valida o relatório é sempre você.', { y: 8.4, w: 14, h: 0.7 });
  rod(s);
  nota(s, '07:30 · 1min30s',
    'Capitulo 02. O limite de memoria e o que mais faz aluno perder trabalho. ' +
    'Avise agora, antes de eles comecarem.');
}

/* ===========================================================================
   BLOCO 2 · O CICLO — 6 min
   =========================================================================== */

nota(slideSecao(pres, { numero: 2, nome: 'O ciclo', entrega: ENTREGA, cliente: ALUNO }),
  '09:00 · 20s', 'Capitulo 03 do livro. O bloco mais importante da aula. Avise que vale anotar.');

{
  const s = slide(pres);
  numeroSecao(s, 'Capítulo 03', { x: GRADE.margem, y: 1.9 });
  rotulo(s, 'O ciclo', { y: 2.3 });
  titulo(s, 'Cinco passos, repetidos\nem cada capítulo', { y: 2.85, w: 14 });
  percurso(s, [
    '1 · Ler\no capítulo',
    '2 · Ouvir\no áudio no Spotify',
    '3 · Responder\nno Google Docs',
    '4 · Processar\nno agente de IA',
    '5 · Salvar\no relatório',
  ], { y: 6.1, w: 16.2 });
  reguaAcento(s, { y: 8.5, w: 1.2 });
  lead(s, 'Nenhum passo é opcional. O relatório de cada capítulo é o insumo do capítulo seguinte.',
    { y: 8.8, w: 15, h: 0.8 });
  rod(s);
  nota(s, '09:20 · 1min40s',
    'Mostre o ciclo inteiro antes de detalhar. Eles precisam ver o desenho ' +
    'completo para entender por que nao se pula etapa.');
}

{
  const s = slide(pres);
  rotulo(s, 'Onde fica cada coisa', { y: 1.9 });
  titulo(s, 'A anatomia de um capítulo', { y: 2.45, w: 14 });
  fio(s, { y: 4.0, w: 10.6 });
  listaNumerada(s, [
    { numero: 1, titulo: 'O texto do capítulo', descricao: 'O conceito, com exemplos reais.' },
    { numero: 2, titulo: 'O QR do áudio', descricao: 'No fim do texto. Leva ao episódio no Spotify.' },
    { numero: 3, titulo: 'A página RESPONDA', descricao: 'As perguntas do capítulo, impressas para você ler antes.' },
    { numero: 4, titulo: 'O QR do Google Docs', descricao: 'Abre o arquivo onde você responde de verdade.' },
    { numero: 5, titulo: 'O QR do agente', descricao: 'Abre o consultor de IA daquele capítulo, no ChatGPT.' },
  ], { y: 4.35, w: 10.6, passo: 0.86 });
  molduraImagem(s, {
    x: 12.4, y: 2.3, w: 6.2, h: 7.0,
    legenda: 'print da página final de um capítulo do livro,\nmostrando os dois QR Codes',
  });
  rod(s);
  nota(s, '11:00 · 1min40s',
    'Abra o livro fisico na camera, se houver. O aluno precisa reconhecer a ' +
    'pagina que vai procurar sozinho depois.');
}

{
  const s = slide(pres);
  rotulo(s, 'A regra que salva o método', { y: 1.9 });
  titulo(s, 'Dois arquivos por capítulo,\ncom o nome exato', { y: 2.45, w: 14 });
  fio(s, { y: 4.4, w: 16.2 });
  contraposicao(s, {
    y: 4.85,
    esquerda: {
      rotulo: 'Arquivo 1 · Suas respostas',
      titulo: 'Capítulo 04 – Perguntas e Respostas',
      texto: 'É o Google Docs que você preencheu. Salve na pasta da sua marca, sem renomear de outro jeito.',
    },
    direita: {
      rotulo: 'Arquivo 2 · O retorno do agente', acento: true,
      titulo: 'Relatório/Diagnóstico – Capítulo 04',
      texto: 'É o que o agente devolveu. Este é o arquivo que você vai anexar em todos os capítulos seguintes.',
    },
  });
  reguaAcento(s, { y: 8.6, w: 1.2 });
  lead(s, 'A nomenclatura não é burocracia: é o que faz o efeito acumulado funcionar lá na frente.',
    { y: 8.9, w: 15, h: 0.8 });
  rod(s);
  nota(s, '12:40 · 1min20s',
    'Escreva os dois nomes no quadro ou no chat. Este slide evita 80% dos ' +
    'problemas que eles teriam sozinhos.');
}

/* ===========================================================================
   BLOCO 3 · CAPITULO 04 PASSO A PASSO — 12 min · CORACAO DA AULA
   =========================================================================== */

nota(slideSecao(pres, { numero: 3, nome: 'Capítulo 04 ao vivo', entrega: ENTREGA, cliente: ALUNO }),
  '14:00 · 20s', 'Fim da teoria. Aqui eles pegam o celular. Anuncie: vamos fazer juntos, agora.');

nota(slideFicha(pres, {
  numero: 4,
  titulo: 'Autoimagem Estratégica:\nquem é você no seu negócio?',
  revela: 'Antes de posicionar uma marca, é preciso posicionar quem está por trás dela. Se a liderança está confusa, a comunicação será confusa.',
  oQueFaz: [
    'Responde 7 perguntas sobre a sua história e o seu papel no negócio.',
    'Recebe o primeiro diagnóstico da sua marca.',
    'Gera o relatório que sustenta todos os capítulos seguintes.',
  ],
  qrAudio: qr(4, 'audio'),
  qrDocs: qr(4, 'docs'),
  qrAgente: qr(4, 'agente'),
  anexar: 'Este é o único capítulo em que você não anexa nada além das suas respostas.',
  entrega: ENTREGA, cliente: ALUNO,
}), '14:20 · 1min40s',
  'A FICHA. Este e o formato que se repete em todos os capitulos. Explique a ' +
  'leitura da ficha uma vez, com calma: esquerda e o conteudo, direita sao os ' +
  'acessos. Depois disso, as outras fichas correm rapido.');

{
  const s = slide(pres);
  numeroSecao(s, 'Passo 3', { x: GRADE.margem, y: 1.6 });
  rotulo(s, 'Responder no Google Docs', { y: 2.0 });
  titulo(s, 'As 7 perguntas do Capítulo 04', { y: 2.5, w: 13, size: 38 });
  fio(s, { x: GRADE.margem, y: 4.0, w: 12.2 });
  listaNumerada(s, [
    { numero: 1, titulo: 'Quais momentos da sua história moldaram quem você é como empresário?' },
    { numero: 2, titulo: 'Que características da sua personalidade aparecem no seu negócio?' },
    { numero: 3, titulo: 'Qual papel você mais exerce — e qual você evita assumir?' },
    { numero: 4, titulo: 'Que decisões você percebe que costuma repetir ao longo do tempo?' },
    { numero: 5, titulo: 'Que influências da sua história afetam o jeito como você toca o negócio?' },
    { numero: 6, titulo: 'O que já está mudando em você, mas ainda não apareceu na marca?' },
    { numero: 7, titulo: 'O que hoje já não combina mais com você — e não deve mais ser da marca?' },
  ], { x: GRADE.margem, y: 4.35, w: 12.2, passo: 0.74, size: 20 });

  qrBloco(s, {
    arquivo: qr(4, 'docs'), rotulo: 'Escaneie para responder', x: 15.6, y: 4.2, lado: 2.4,
    instrucao: 'Abre o Google Docs\ndo Capítulo 04.',
  });
  rod(s);
  nota(s, '16:00 · 4min',
    'EXERCICIO AO VIVO. Cronometre 3 minutos de silencio real para responderem ' +
    'as tres primeiras. Nao fale durante. Depois peca um voluntario para ler a 1.');
}

{
  const s = slide(pres);
  rotulo(s, 'A qualidade da resposta', { y: 1.9 });
  titulo(s, 'Resposta rasa gera diagnóstico raso', { y: 2.45, w: 14 });
  fio(s, { y: 4.1, w: 16.2 });
  contraposicao(s, {
    y: 4.55,
    esquerda: {
      rotulo: 'O raso',
      titulo: '“Sou clínico geral.”',
      texto: 'Correto, mas não comunica nada além do básico. No meio de milhares de médicos, fica invisível.',
    },
    direita: {
      rotulo: 'O profundo', acento: true,
      titulo: '“Ajudo famílias a manterem a saúde ao longo do tempo, prevenindo e cuidando com proximidade.”',
      texto: 'História, diferencial real e essência revelada. Não é inventar um título: é nomear o que já estava ali.',
    },
  });
  citacao(s, 'A IA é um espelho estratégico — não um terapeuta. Ela não cria a sua verdade: devolve com nitidez o que você já disse.',
    { y: 8.6, w: 15 });
  rod(s);
  nota(s, '20:00 · 1min40s',
    'Exemplo do medico, do Capitulo 04. Use para corrigir ao vivo a resposta do ' +
    'voluntario: mostre como aprofundar uma frase rasa.');
}

{
  const s = slide(pres);
  numeroSecao(s, 'Passo 4', { x: GRADE.margem, y: 1.6 });
  rotulo(s, 'Levar para o agente', { y: 2.0 });
  titulo(s, 'O agente do Capítulo 04', { y: 2.5, w: 11, size: 38 });
  fio(s, { x: GRADE.margem, y: 4.0, w: 9.6 });
  marcadores(s, [
    'Escaneie o QR e abra o agente no ChatGPT.',
    'Clique primeiro no atalho que aparece dentro dele.',
    'Só então cole ou anexe suas perguntas e respostas.',
    'Confira: o agente é o do Capítulo 04, igual às suas respostas.',
  ], { x: GRADE.margem, y: 4.4, w: 9.6, passo: 0.72 });
  reguaAcento(s, { x: GRADE.margem, y: 7.5, w: 0.9 });
  lead(s, 'Colar antes de clicar no atalho é o erro número um. O agente responde — mas responde genérico.',
    { x: GRADE.margem, y: 7.8, w: 9.6, h: 1.0 });

  qrBloco(s, {
    arquivo: qr(4, 'agente'), rotulo: 'O agente do Cap. 04', x: 11.4, y: 2.5, lado: 2.4,
    instrucao: 'Agente KA · Cap. 04\nAutoimagem Estratégica',
  });
  molduraImagem(s, {
    x: 15.0, y: 2.9, w: 3.6, h: 5.4,
    legenda: 'print da tela\ndo agente aberto\nno ChatGPT',
  });
  rod(s);
  nota(s, '21:40 · 2min20s',
    'ERRO NUMERO UM. Repita duas vezes: atalho primeiro, respostas depois. ' +
    'Se houver tela, mostre o atalho ao vivo dentro do agente.');
}

{
  const s = slide(pres);
  numeroSecao(s, 'Passo 5', { x: GRADE.margem, y: 1.6 });
  rotulo(s, 'O que volta e o que fazer com isso', { y: 2.0 });
  titulo(s, 'O relatório é o ativo —\nnão a conversa', { y: 2.5, w: 11, size: 38 });
  fio(s, { x: GRADE.margem, y: 4.6, w: 9.6 });
  microRotulo(s, 'Antes de aceitar, pergunte-se', { x: GRADE.margem, y: 4.9, w: 9.6 });
  marcadores(s, [
    'Isso é verdade sobre a minha marca, ou só soa bem?',
    'Eu sustento essa promessa na próxima segunda-feira?',
    'Há alguma afirmação aqui que eu não reconheço como minha?',
  ], { x: GRADE.margem, y: 5.4, w: 9.6, passo: 0.72 });
  reguaAcento(s, { x: GRADE.margem, y: 7.8, w: 0.9 });
  lead(s, 'Salve como: Relatório/Diagnóstico – Capítulo 04. Este arquivo vai com você até o Capítulo 11.',
    { x: GRADE.margem, y: 8.1, w: 9.6, h: 1.0 });

  molduraImagem(s, {
    x: 11.7, y: 2.4, w: 6.9, h: 6.3,
    legenda: 'print de um relatório real devolvido pelo agente\n(pode ser o seu, anonimizado)',
  });
  rod(s);
  nota(s, '24:00 · 2min',
    'Mostre um relatorio de verdade. Ver o formato do retorno tira a ansiedade ' +
    'e e o que mais convence de que o metodo entrega.');
}

/* ===========================================================================
   BLOCO 4 · OS DEMAIS CAPITULOS — 14 min
   =========================================================================== */

nota(slideSecao(pres, { numero: 4, nome: 'O caminho completo', entrega: ENTREGA, cliente: ALUNO }),
  '26:00 · 20s',
  'Avise: as proximas telas sao o mapa de cada capitulo. Peca para fotografarem ' +
  'ou dizer que o PDF vai junto com o material.');

{
  const s = slide(pres);
  rotulo(s, 'A regra que muda tudo a partir daqui', { y: 1.9 });
  titulo(s, 'Do Capítulo 05 em diante, você sempre\nanexa os relatórios anteriores', { y: 2.45, w: 16 });
  percurso(s, [
    'Cap. 04\nsuas respostas',
    'Cap. 05\n+ relatório 04',
    'Cap. 06\n+ relatórios 04-05',
    'Cap. 07\n+ relatórios 04-06',
    'Cap. 08 a 10\n+ tudo o que veio antes',
    'Cap. 11\ntodos os relatórios',
  ], { y: 5.9, w: 16.2 });
  reguaAcento(s, { y: 8.4, w: 1.2 });
  lead(s, 'Cada agente vai “lembrando” do que já foi construído. É um quebra-cabeça: cada peça tem valor, mas só o conjunto forma a imagem da sua marca.',
    { y: 8.7, w: 15, h: 0.9 });
  rod(s);
  nota(s, '26:20 · 1min40s',
    'Sem o relatorio anterior, o agente seguinte trabalha cego. E por isso que ' +
    'a ordem importa e nao se pula capitulo.');
}

const fichas = [
  {
    numero: 5,
    titulo: 'Posicionamento Claro:\no lugar da sua marca no mundo',
    revela: 'Toda marca já ocupa um lugar. A diferença é se esse lugar foi escolhido por você ou pelo mercado.',
    oQueFaz: [
      'Nomeia o território que sua marca já ocupa sem ter declarado.',
      'Define o que você precisa ter coragem de renunciar.',
    ],
    anexar: 'Anexe junto: o Relatório do Capítulo 04.',
    minuto: '28:00 · 2min',
    dica: 'A pergunta 7 e a mais dificil e a mais valiosa: do que voce renuncia.',
  },
  {
    numero: 6,
    titulo: 'Personalidade e Voz:\na linguagem viva da sua marca',
    revela: 'Sua marca já fala. A pergunta é se ela está dizendo o que você realmente acredita — ou copiando quem grita mais alto.',
    oQueFaz: [
      'Define o tom, o vocabulário e o ritmo da sua marca.',
      'Lista as palavras que combinam e as que nunca combinariam.',
    ],
    anexar: 'Anexe junto: os Relatórios dos Capítulos 04 e 05.',
    minuto: '30:00 · 2min',
    dica: 'Este e o capitulo que mais muda o Instagram do aluno na semana seguinte.',
  },
  {
    numero: 7,
    titulo: 'Arquitetura de Marca:\nclareza estrutural para crescer',
    revela: 'Se a estrutura que organiza suas ofertas for confusa, o crescimento será sempre limitado. O cliente que não entende, desiste.',
    oQueFaz: [
      'Lista tudo o que você oferece hoje, inclusive o que já não faz sentido.',
      'Organiza o portfólio em três níveis: entrada, meio e topo.',
    ],
    anexar: 'Anexe junto: os Relatórios dos Capítulos 04, 05 e 06.',
    minuto: '32:00 · 2min',
    dica: 'Peca que listem TUDO na pergunta 1, mesmo o desatualizado. E ali que ' +
      'aparece o que precisa ser cortado.',
  },
  {
    numero: 8,
    titulo: 'Expressão Visual com Propósito:\nidentidade visual que comunica',
    revela: 'Forma sem verdade gera maquiagem. Verdade sem forma gera invisibilidade. A força da marca nasce da coerência entre as duas.',
    oQueFaz: [
      'Avalia se a estética atual representa quem você é de verdade.',
      'Nomeia as sensações que a marca precisa despertar de imediato.',
    ],
    anexar: 'Anexe junto: os Relatórios dos Capítulos 04 a 07.',
    minuto: '34:00 · 2min',
    dica: 'Se o aluno for refazer a identidade visual, o relatorio deste capitulo ' +
      'e o briefing que ele leva ao designer.',
  },
  {
    numero: 9,
    titulo: 'Posicionamento na Prática:\nproposta de valor e narrativa central',
    revela: 'Sem proposta, não há foco. Sem narrativa, não há alma. A promessa é um contrato simbólico — não um slogan.',
    oQueFaz: [
      'Escreve a proposta de valor em uma frase clara, relevante e específica.',
      'Conta por que a marca nasceu e o que ela defende.',
    ],
    anexar: 'Anexe junto: os Relatórios dos Capítulos 04 a 08.',
    minuto: '36:00 · 2min',
    dica: 'Este relatorio costuma virar a bio do Instagram e a abertura da ' +
      'proposta comercial. Diga isso — aumenta a percepcao de valor.',
  },
  {
    numero: 10,
    titulo: 'Presença e Comunicação\nEstratégica',
    revela: 'Comunicação não é só rede social. É o atendimento, o e-mail, o contrato, a postura numa reunião. O cliente não separa: ele sente o todo.',
    oQueFaz: [
      'Mapeia todos os pontos em que a marca aparece hoje.',
      'Decide o que reforçar e o que a marca não vai mais dizer.',
    ],
    anexar: 'Anexe junto: os Relatórios dos Capítulos 04 a 09.',
    minuto: '38:00 · 2min',
    dica: 'Ultima ficha antes do Brand Book. Reforce que so faltam os relatorios ' +
      'reunidos para o documento final sair.',
  },
];

for (const f of fichas) {
  nota(slideFicha(pres, {
    numero: f.numero,
    titulo: f.titulo,
    revela: f.revela,
    oQueFaz: f.oQueFaz,
    qrAudio: qr(f.numero, 'audio'),
    qrDocs: qr(f.numero, 'docs'),
    qrAgente: qr(f.numero, 'agente'),
    anexar: f.anexar,
    entrega: ENTREGA, cliente: ALUNO,
  }), f.minuto, f.dica);
}

/* ===========================================================================
   BLOCO 5 · BRAND BOOK VIVO — 5 min
   =========================================================================== */

nota(slideSecao(pres, { numero: 5, nome: 'Brand Book Vivo', entrega: ENTREGA, cliente: ALUNO }),
  '40:00 · 20s', 'O destino. Aqui tudo o que eles fizeram vira um documento so.');

nota(slideFicha(pres, {
  numero: 11,
  titulo: 'Brand Book e Diagnóstico\nda Marca',
  revela: 'Não é um PDF morto. É a chama acesa da sua identidade — um documento vivo, feito com você, por você, a partir das suas próprias respostas.',
  oQueFaz: [
    'Reúne os relatórios dos Capítulos 04 a 10 em um só documento.',
    'Organiza o que sua marca é, entrega, promete e como se comunica.',
    'Permite atualizar sempre que a marca evoluir.',
  ],
  qrAudio: qr(11, 'audio'),
  qrAgente: qr(11, 'agente'),
  anexar: 'Anexe todos os sete relatórios de uma vez. Salve como: Brand Book + nome da marca + data.',
  entrega: ENTREGA, cliente: ALUNO,
}), '40:20 · 2min',
  'Note que este capitulo nao tem Google Docs: nao ha perguntas novas. O insumo ' +
  'sao os sete relatorios. Esse detalhe costuma confundir — explique.');

{
  const s = slide(pres);
  rotulo(s, 'O que você tem no fim', { y: 1.9 });
  titulo(s, 'O primeiro documento oficial\nda sua marca', { y: 2.45, w: 13 });
  fio(s, { y: 4.4, w: 10.9 });
  marcadores(s, [
    'O que sua marca é, entrega e promete.',
    'Como ela se comunica, em qualquer ponto de contato.',
    'Um critério para avaliar cada nova ação: isso é coerente?',
    'Um documento que se atualiza quando a marca evolui.',
  ], { y: 4.8, w: 10.9, passo: 0.74 });
  reguaAcento(s, { y: 8.0, w: 1.2 });
  lead(s, 'Não para arquivar. Para usar, para ensinar a equipe e para sustentar a marca quando a operação acelera.',
    { y: 8.3, w: 10.9, h: 1.0 });
  molduraImagem(s, {
    x: 12.9, y: 2.3, w: 5.7, h: 6.9,
    legenda: 'print da capa ou de\numa página de um\nBrand Book gerado',
  });
  rod(s);
  nota(s, '42:20 · 2min',
    'Mostre um Brand Book real. E a prova final de que o metodo entrega — e o ' +
    'que justifica o preco da aula e do livro.');
}

/* ===========================================================================
   BLOCO 6 · PLANO E OFERTA — 6 min
   =========================================================================== */

{
  const s = slide(pres);
  rotulo(s, 'O ritmo que funciona', { y: 1.9 });
  titulo(s, 'Quatro semanas até o seu\nBrand Book Vivo', { y: 2.45, w: 14 });
  fio(s, { y: 4.4, w: 16.2 });
  colunas(s, [
    { numero: 1, titulo: 'Semana 1', texto: 'Capítulos 1 a 4. Termine a Autoimagem Estratégica que você começou aqui.' },
    { numero: 2, titulo: 'Semana 2', texto: 'Capítulos 5 e 6. Posicionamento e voz — o par que mais muda a comunicação.' },
    { numero: 3, titulo: 'Semana 3', texto: 'Capítulos 7 e 8. Arquitetura e expressão visual.' },
    { numero: 4, titulo: 'Semana 4', texto: 'Capítulos 9, 10 e 11. Proposta, presença e o Brand Book.' },
  ], { y: 4.85, w: 16.2, alturaTexto: 1.8 });
  reguaAcento(s, { y: 7.7, w: 1.2 });
  lead(s, 'Um capítulo por vez, sem pular. Quem tenta fazer tudo num fim de semana entrega respostas rasas — e recebe diagnóstico raso.',
    { y: 8.0, w: 15, h: 0.9 });
  rod(s);
  nota(s, '44:20 · 1min40s',
    'Peca para abrirem a agenda AGORA e marcarem os quatro blocos. ' +
    'Compromisso com data cumpre; intencao nao.');
}

{
  const s = slide(pres);
  rotulo(s, 'O que faz o método falhar', { y: 1.9 });
  titulo(s, 'Cinco erros — todos evitáveis', { y: 2.45, w: 14 });
  fio(s, { y: 4.1, w: 13.4 });
  marcadores(s, [
    'Pular etapas. Cada relatório é insumo do capítulo seguinte.',
    'Não salvar os dois arquivos: as respostas e o relatório.',
    'Aceitar o relatório sem validar o que está escrito.',
    'Misturar capítulos: confira se o agente é o mesmo das respostas.',
    'Colar as respostas antes de clicar no atalho dentro do agente.',
  ], { y: 4.5, w: 13.4, passo: 0.78 });
  reguaAcento(s, { y: 8.2, w: 1.2 });
  lead(s, 'Nenhum deles é sobre inteligência. Todos são sobre método.', { y: 8.5, w: 13.4, h: 0.7 });
  rod(s);
  nota(s, '46:00 · 1min40s',
    'Recapitulacao operacional. Se eles lembrarem de um slide da aula, que ' +
    'seja este. Vale como imagem de recado no grupo depois.');
}

{
  const s = slide(pres, { textura: true });
  card(s, { x: 1.125, y: 1.5, w: 17.75, h: 8.0 });
  microRotulo(s, 'Para continuar a partir daqui', { x: 1.9, y: 2.3, w: 10, acento: true });
  titulo(s, 'O livro na sua mão', { x: 1.86, y: 2.75, w: 15, size: 52 });
  fio(s, { x: 1.9, y: 4.5, w: 16.2 });
  colunas(s, [
    { numero: 1, titulo: 'Você já tem o livro digital', texto: 'Ele acompanha esta aula. Todos os QR Codes, links, agentes e documentos estão nele.' },
    { numero: 2, titulo: '30% de desconto no livro físico', texto: 'Quem fez esta aula leva a edição impressa com 30% de desconto.\n\nCupom: «INSERIR CUPOM»' },
    { numero: 3, titulo: 'Por que ter o físico também', texto: 'Este é um livro para ser escrito, marcado e riscado. O digital dá acesso; o físico sustenta o hábito.' },
  ], { x: 1.9, y: 4.95, w: 16.2, alturaTexto: 2.2 });
  legenda(s, '«INSERIR LINK DE COMPRA»   ·   Oferta válida até «INSERIR PRAZO»',
    { x: 1.9, y: 8.6, w: 14, cor: COR.tinta });
  rod(s);
  nota(s, '47:40 · 2min20s',
    'OFERTA. Preencher cupom, link e prazo antes de apresentar. Argumento ' +
    'central: o digital da acesso, o fisico sustenta o habito de escrever no ' +
    'livro — e o metodo depende de escrever.');
}

nota(slideEncerramento(pres, { titulo: 'Agora é com você.' }), '50:00 · 1min',
  'Encerramento. Convide para postar uma foto com o livro e marcar ' +
  '@kellyalbert.brand. Abra para perguntas se o formato permitir.');

/* ========================================================================= */

const destino = 'decks/saida/aula-ia-com-essencia.pptx';
await salvar(pres, destino);
console.log(`Deck gerado: ${destino}`);
