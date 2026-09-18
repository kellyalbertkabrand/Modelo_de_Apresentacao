/* ---------------------------------------------------------------------------
   AULA · IA COM ESSÊNCIA
   Como usar o livro para construir o Brand Book Vivo da sua marca.

   Duracao: 50 minutos. Cada slide leva nota de orador com o minuto de
   entrada — some as notas e o tempo fecha.

   Conteudo extraido do livro "IA com Essencia" (Kelly Albert, 1a edicao).
   Identidade visual: sistema deste repositorio.

   Montar:  node decks/aula-ia-com-essencia.mjs
   --------------------------------------------------------------------------- */

import {
  novoDeck, slide, salvar, rodape, rotulo, microRotulo, titulo, lead, corpo,
  legenda, fio, reguaAcento, card, numeroSecao, colunas, marcadores, citacao,
  percurso, listaNumerada, contraposicao, tituloSecao,
  slideAbertura, slideCapa, slideSecao, slidePergunta, slideDeclaracao,
  slideEncerramento, GRADE, TAM, COR,
} from '../build/pptx/sistema-pptx.mjs';

const ENTREGA = 'IA com Essência · A Aula';
const ALUNO = 'Kelly Albert';
const pres = novoDeck({ titulo: 'IA com Essência — A Aula' });

/* Atalhos, para o corpo do deck ficar legivel. */
const rod = (s) => rodape(s, ENTREGA, ALUNO);
const nota = (s, minuto, txt) => s.addNotes(`[${minuto}]\n${txt}`);

/* ===========================================================================
   BLOCO 0 · ABERTURA — 3 min
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
  'Leia o subtitulo em voz alta. Ele e a promessa da aula: nao e resumo do ' +
  'livro, e o metodo de uso.');

nota(slidePergunta(pres, {
  sobretitulo: 'A pergunta que conduz esta aula',
  pergunta: 'Quantos livros de negócio você já comprou —\ne quantos realmente mudaram a sua marca?',
  entrega: ENTREGA, cliente: ALUNO,
}), '01:00 · 1min',
  'Deixe a pergunta no ar. Peca para pensarem num numero. A diferenca entre ' +
  'ler e mudar nao e o livro: e o uso. Esta aula e sobre o uso.');

{
  const s = slide(pres);
  rotulo(s, 'O que você leva desta aula', { y: 2.2 });
  titulo(s, 'Em 50 minutos, três coisas\nsaem daqui com você', { y: 2.75, w: 14 });
  fio(s, { y: 4.5, w: 16.2 });
  colunas(s, [
    { numero: 1, titulo: 'O método de uso', texto: 'O ciclo de cinco passos que transforma cada capítulo em um diagnóstico da sua marca.' },
    { numero: 2, titulo: 'O Capítulo 04 feito', texto: 'Você sai desta aula com a sua Autoimagem Estratégica já respondida e processada.' },
    { numero: 3, titulo: 'O plano de 4 semanas', texto: 'O ritmo para chegar ao Brand Book Vivo sem abandonar no meio do caminho.' },
  ], { y: 4.95, w: 16.2, alturaTexto: 1.7 });
  rod(s);
  nota(s, '02:00 · 1min',
    'Contrato da aula. Diga que o mais importante e o segundo item: eles nao ' +
    'saem so com teoria, saem com uma entrega pronta.');
}

/* ===========================================================================
   BLOCO 1 · O ERRO — 5 min
   =========================================================================== */

nota(slideSecao(pres, { numero: 1, nome: 'O erro de origem', entrega: ENTREGA, cliente: ALUNO }),
  '03:00 · 20s', 'Transicao. Antes do metodo, o diagnostico do erro.');

{
  const s = slide(pres);
  rotulo(s, 'O erro de origem', { y: 2.2 });
  titulo(s, 'A IA virou substituta\ndo que nunca foi construído', { y: 2.75, w: 14 });
  fio(s, { y: 4.7, w: 16.2 });
  contraposicao(s, {
    y: 5.15,
    esquerda: {
      rotulo: 'A cafeteria sem raiz',
      titulo: 'Posta fotos bonitas de xícaras, mas nunca diz o que a diferencia.',
      texto: 'Conteúdo genérico. Some no ruído. A IA aqui só acelera a produção de mais do mesmo.',
    },
    direita: {
      rotulo: 'A cafeteria com essência', acento: true,
      titulo: 'Nasceu para resgatar o café artesanal, de pequenos produtores locais.',
      texto: 'Território claro. A IA aqui amplifica uma mensagem que já existe — e por isso funciona.',
    },
  });
  rod(s);
  nota(s, '03:20 · 1min40s',
    'Exemplo das duas cafeterias, do Capitulo 01. Pergunte: qual delas voce ' +
    'recomendaria a um amigo? A tecnologia ajuda as duas — mas so a segunda ' +
    'tem o que amplificar.');
}

nota(slideDeclaracao(pres, {
  sobretitulo: 'O princípio do livro',
  frase: 'Essência não se replica.\nClareza não se terceiriza.',
  desdobramento: 'A IA é um espelho matemático: ela devolve na mesma medida em que você a alimenta. Com confusão, devolve confusão. Com clareza, devolve precisão.',
  entrega: ENTREGA, cliente: ALUNO,
}), '05:00 · 1min20s',
  'Esta e a frase-chave do livro. Diga devagar. Tudo o que vem depois na aula ' +
  'se apoia nela.');

{
  const s = slide(pres);
  rotulo(s, 'Autodiagnóstico', { y: 2.2 });
  titulo(s, 'Reconhece algum destes sintomas\nna sua marca?', { y: 2.75, w: 14 });
  fio(s, { y: 4.7, w: 13 });
  marcadores(s, [
    'Sua marca é constantemente comparada com concorrentes genéricos.',
    'Seus clientes chegam sem saber o que você faz exatamente.',
    'Você muda o discurso conforme a tendência do dia.',
    'Você atrai quem paga, mas não valoriza.',
    'Seu conteúdo tem forma, mas não tem força.',
  ], { y: 5.15, w: 13, passo: 0.78 });
  legenda(s, 'Se você marcou dois ou mais, o problema não é falta de conteúdo. É falta de estrutura.',
    { y: 9.3, w: 13, cor: COR.tinta });
  rod(s);
  nota(s, '06:20 · 1min40s',
    'Os cinco sintomas do Capitulo 05. Peca para levantarem a mao em cada um. ' +
    'Essa contagem cria a consciencia do problema — e a necessidade do metodo.');
}

/* ===========================================================================
   BLOCO 2 · COMO A IA PENSA — 6 min
   =========================================================================== */

nota(slideSecao(pres, { numero: 2, nome: 'Como a IA pensa', entrega: ENTREGA, cliente: ALUNO }),
  '08:00 · 20s', 'Transicao. Para usar bem a ferramenta, basta entender como ela pensa.');

{
  const s = slide(pres);
  rotulo(s, 'O motor', { y: 2.2 });
  titulo(s, 'A IA não adivinha. Ela calcula.', { y: 2.75, w: 14 });
  fio(s, { y: 4.3, w: 16.2 });
  lead(s, 'A cada palavra que você escreve, ela analisa o contexto e prevê a próxima mais provável, com base em tudo o que já leu. Não é magia. É previsão.',
    { y: 4.75, w: 14.5, h: 1.2 });
  colunas(s, [
    { titulo: 'Reconhecimento de padrões', texto: 'Foi treinada com milhões de textos e aprendeu a identificar padrões de palavras e ideias.' },
    { titulo: 'Previsão', texto: 'Quando você escreve, ela calcula qual é a próxima palavra mais provável.' },
    { titulo: 'Sentido aparente', texto: 'O texto parece inteligente, mas é cálculo. A IA não pensa — ela prevê.' },
  ], { y: 6.6, w: 16.2, alturaTexto: 1.6 });
  rod(s);
  nota(s, '08:20 · 1min40s',
    'Capitulo 02. Use o jogo do "Era uma vez..." — qual a proxima palavra? ' +
    'Eles entendem em cinco segundos o que e previsao.');
}

{
  const s = slide(pres);
  rotulo(s, 'A consequência prática', { y: 2.2 });
  titulo(s, 'Não é sobre saber usar tecnologia.\nÉ sobre saber pedir com intenção.', { y: 2.75, w: 15 });
  fio(s, { y: 5.0, w: 16.2 });
  contraposicao(s, {
    y: 5.45,
    esquerda: {
      rotulo: 'Pedido genérico',
      titulo: '“Quero uma ideia de post.”',
      texto: 'A resposta vai ser qualquer coisa — porque qualquer coisa atende ao pedido.',
    },
    direita: {
      rotulo: 'Pedido com contexto', acento: true,
      titulo: '“Quero uma ideia de post para minha cafeteria artesanal, que valoriza pequenos produtores, voltada a um público que busca experiência e não preço.”',
      texto: 'A resposta muda completamente. O contexto não é enfeite: é o que produz precisão.',
    },
  });
  rod(s);
  nota(s, '10:00 · 1min30s',
    'Se der tempo e houver tela, faca os dois pedidos ao vivo. O contraste ' +
    'e o argumento mais forte da aula inteira.');
}

{
  const s = slide(pres);
  rotulo(s, 'O tripé', { y: 2.2 });
  titulo(s, 'Três inteligências precisam\nestar alinhadas', { y: 2.75, w: 14 });
  fio(s, { y: 4.8, w: 16.2 });
  colunas(s, [
    { numero: 1, titulo: 'Inteligência Humana', texto: 'Sua visão, sua história, seus valores. O que só você tem.' },
    { numero: 2, titulo: 'Inteligência Estratégica', texto: 'Clareza sobre onde quer chegar, com quais produtos, com qual posicionamento.' },
    { numero: 3, titulo: 'Inteligência Artificial', texto: 'A ferramenta que amplifica tudo isso — desde que bem orientada.' },
  ], { y: 5.25, w: 16.2, alturaTexto: 1.7 });
  reguaAcento(s, { y: 7.9, w: 1.2 });
  lead(s, 'Se faltar uma das três, a marca enfraquece. Se as três estiverem alinhadas, a IA se torna sua sócia invisível.',
    { y: 8.2, w: 14, h: 1.0 });
  rod(s);
  nota(s, '11:30 · 1min30s',
    'Conceito central do Capitulo 02. Reforce: a maioria do mercado tenta ' +
    'usar so a terceira. Por isso o resultado e generico.');
}

{
  const s = slide(pres);
  rotulo(s, 'O que dá errado sem clareza', { y: 2.2 });
  titulo(s, 'Três riscos que você precisa\nsaber reconhecer', { y: 2.75, w: 14 });
  fio(s, { y: 4.8, w: 16.2 });
  colunas(s, [
    { titulo: 'Alucinação', texto: 'Ela inventa informação falsa com total confiança. Sempre peça as fontes.' },
    { titulo: 'Viés', texto: 'Ela repete preconceitos que estavam nos dados com que foi treinada.' },
    { titulo: 'Desconexão', texto: 'O texto fica bonito, mas não tem nada a ver com a sua marca real.' },
  ], { y: 5.25, w: 16.2, alturaTexto: 1.6 });
  reguaAcento(s, { y: 7.7, w: 1.2 });
  lead(s, 'A IA não tem consciência crítica. Ela devolve padrões. Quem filtra, adapta e decide é você.',
    { y: 8.0, w: 14, h: 0.9 });
  legenda(s, 'Toda conversa tem limite de memória. Quando ele estoura, ela começa a esquecer ou a inventar — abra um chat novo.',
    { y: 9.1, w: 14 });
  rod(s);
  nota(s, '13:00 · 1min30s',
    'Capitulo 02. A nota do rodape sobre tokens e pratica: muita gente perde ' +
    'trabalho por nao saber disso.');
}

/* ===========================================================================
   BLOCO 3 · O MAPA DO LIVRO — 5 min
   =========================================================================== */

nota(slideSecao(pres, { numero: 3, nome: 'O mapa do livro', entrega: ENTREGA, cliente: ALUNO }),
  '14:30 · 20s', 'Transicao. Agora que sabem como a IA pensa, o mapa do caminho.');

{
  const s = slide(pres);
  rotulo(s, 'A estrutura', { y: 2.2 });
  titulo(s, 'Quatro pilares, onze capítulos,\num destino', { y: 2.75, w: 14 });
  fio(s, { y: 4.8, w: 16.2 });
  colunas(s, [
    { numero: 1, titulo: 'Consciência & Essência', texto: 'Fundamentos, despertar e autoconsciência. Capítulos 1 a 4.' },
    { numero: 2, titulo: 'Estrutura & Posicionamento', texto: 'Organização da base, identidade e expressão. Capítulos 5 a 8.' },
    { numero: 3, titulo: 'Expansão & Experiência', texto: 'Consolidação, entrega e experiência de marca. Capítulos 9 e 10.' },
    { numero: 4, titulo: 'Gestão Viva & Cultura', texto: 'Liderança, perenidade e cultura interna. Capítulo 11.' },
  ], { y: 5.25, w: 16.2, alturaTexto: 1.7 });
  reguaAcento(s, { y: 7.9, w: 1.2 });
  lead(s, 'A ordem não é sugestão. Cada pilar só se sustenta sobre o anterior.', { y: 8.2, w: 14, h: 0.7 });
  rod(s);
  nota(s, '14:50 · 2min',
    'Insista na ordem. O erro mais comum e pular para o Capitulo 10 ' +
    '(comunicacao) sem ter feito o 4 e o 5.');
}

{
  const s = slide(pres);
  rotulo(s, 'Os capítulos que geram entrega', { y: 1.5 });
  titulo(s, 'Cada um responde uma camada\nda sua identidade', { y: 2.0, w: 14, size: 36 });
  listaNumerada(s, [
    { numero: 4, titulo: 'Autoimagem Estratégica', descricao: 'Quem é você no seu negócio.' },
    { numero: 5, titulo: 'Posicionamento Claro', descricao: 'O lugar da sua marca no mundo.' },
    { numero: 6, titulo: 'Personalidade e Voz', descricao: 'A linguagem viva da sua marca.' },
    { numero: 7, titulo: 'Arquitetura de Marca', descricao: 'Clareza estrutural como fundamento do crescimento.' },
    { numero: 8, titulo: 'Expressão Visual com Propósito', descricao: 'Identidade visual que comunica.' },
    { numero: 9, titulo: 'Posicionamento na Prática', descricao: 'Proposta de valor e narrativa central.' },
    { numero: 10, titulo: 'Presença e Comunicação', descricao: 'A marca em todos os pontos de contato.' },
  ], { y: 3.75, w: 16.2, passo: 0.88 });
  rod(s);
  nota(s, '16:50 · 2min10s',
    'Passe rapido. O ponto nao e detalhar cada capitulo — e mostrar que sao ' +
    'sete entregas, nao sete leituras.');
}

/* ===========================================================================
   BLOCO 4 · O CICLO — 12 min · CORACAO DA AULA
   =========================================================================== */

nota(slideSecao(pres, { numero: 4, nome: 'O ciclo', entrega: ENTREGA, cliente: ALUNO }),
  '19:00 · 20s', 'Transicao. Este e o bloco mais importante. Avise que vale anotar.');

nota(slidePergunta(pres, {
  sobretitulo: 'O que separa quem lê de quem muda',
  pergunta: 'O que transforma\numa leitura em marca?',
  entrega: ENTREGA, cliente: ALUNO,
}), '19:20 · 40s',
  'Pausa. Resposta: um ciclo repetido sete vezes. Nao e inspiracao — e metodo.');

{
  const s = slide(pres);
  rotulo(s, 'O ciclo', { y: 2.2 });
  titulo(s, 'Cinco passos, repetidos\nem cada capítulo', { y: 2.75, w: 14 });
  percurso(s, [
    'Ler o capítulo',
    'Ouvir o áudio no Spotify',
    'Responder no Google Docs',
    'Processar no Agente de IA',
    'Salvar o relatório',
  ], { y: 6.0, w: 16.2 });
  reguaAcento(s, { y: 8.4, w: 1.2 });
  lead(s, 'Nenhum passo é opcional. O relatório de cada capítulo é o insumo do capítulo seguinte.',
    { y: 8.7, w: 14, h: 0.8 });
  rod(s);
  nota(s, '20:00 · 1min30s',
    'Mostre o ciclo inteiro antes de detalhar. Eles precisam ver o desenho ' +
    'completo para entender por que nao se pula etapa.');
}

{
  const s = slide(pres);
  numeroSecao(s, '1 · 2', { x: GRADE.margem, y: 2.2 });
  rotulo(s, 'O capítulo e o áudio', { y: 2.6 });
  titulo(s, 'Ler e ouvir — nessa ordem', { y: 3.15, w: 14 });
  fio(s, { y: 4.7, w: 16.2 });
  contraposicao(s, {
    y: 5.15,
    esquerda: {
      rotulo: 'Passo 1 · O capítulo',
      titulo: 'Leia sem pressa, com caneta na mão.',
      texto: 'Este não é um livro para ser lido correndo. É para ser vivido e usado como ferramenta real. Marque o que doeu — geralmente é ali que está a resposta.',
    },
    direita: {
      rotulo: 'Passo 2 · O áudio', acento: true,
      titulo: 'Escaneie o QR Code e ouça o áudio complementar no Spotify.',
      texto: 'O áudio não repete o capítulo: ele aprofunda. Ouça antes de responder as perguntas — muda a qualidade das respostas.',
    },
  });
  rod(s);
  nota(s, '21:30 · 2min',
    'Muita gente pula o audio. Diga explicitamente que o audio muda a ' +
    'qualidade do insumo que vai para o agente.');
}

{
  const s = slide(pres);
  numeroSecao(s, 3, { x: GRADE.margem, y: 2.2 });
  rotulo(s, 'O documento', { y: 2.6 });
  titulo(s, 'Responder no Google Docs —\ne salvar com o nome certo', { y: 3.15, w: 14 });
  fio(s, { y: 5.1, w: 16.2 });
  colunas(s, [
    { numero: 1, titulo: 'Acesse', texto: 'Escaneie o QR Code do capítulo ou clique no link para abrir o arquivo de perguntas no Google Docs.' },
    { numero: 2, titulo: 'Responda ali mesmo', texto: 'No próprio arquivo, sem resumir. Resposta curta gera diagnóstico raso.' },
    { numero: 3, titulo: 'Salve com este nome', texto: 'Capítulo X – Perguntas e Respostas\n\nA nomenclatura não é burocracia: é o que faz o efeito acumulado funcionar.' },
  ], { y: 5.55, w: 16.2, alturaTexto: 2.1 });
  rod(s);
  nota(s, '23:30 · 2min',
    'A nomenclatura e o detalhe que mais gera problema depois. Mostre na tela ' +
    'o nome exato do arquivo.');
}

{
  const s = slide(pres);
  numeroSecao(s, 4, { x: GRADE.margem, y: 2.2 });
  rotulo(s, 'O agente', { y: 2.6 });
  titulo(s, 'O Agente de IA não é um chat comum', { y: 3.15, w: 14 });
  fio(s, { y: 4.7, w: 13.4 });
  corpo(s, 'São consultores criados no ChatGPT especialmente para este livro. Eles interpretam o que você escreve, conectam suas ideias e devolvem um relatório estruturado — não uma resposta genérica.',
    { y: 5.15, w: 13.4, h: 1.4, cor: COR.tinta, size: TAM.lead });
  marcadores(s, [
    'Escaneie o QR Code do capítulo para abrir o agente correspondente.',
    'Clique primeiro no atalho que existe dentro de todos os agentes.',
    'Só depois cole ou anexe suas perguntas e respostas.',
    'Confira se o capítulo do agente é o mesmo das suas respostas.',
  ], { y: 6.9, w: 13.4, passo: 0.72 });
  rod(s);
  nota(s, '25:30 · 2min',
    'O atalho dentro do agente e obrigatorio e quase todo mundo esquece. ' +
    'Repita duas vezes: atalho primeiro, respostas depois.');
}

{
  const s = slide(pres);
  numeroSecao(s, 5, { x: GRADE.margem, y: 2.2 });
  rotulo(s, 'O relatório', { y: 2.6 });
  titulo(s, 'O relatório é o ativo —\nnão a conversa', { y: 3.15, w: 14 });
  fio(s, { y: 5.1, w: 16.2 });
  contraposicao(s, {
    y: 5.55,
    esquerda: {
      rotulo: 'O que a maioria faz',
      titulo: 'Lê a resposta na tela, acha interessante e fecha o chat.',
      texto: 'O trabalho evapora. No capítulo seguinte, não há o que anexar — e o efeito acumulado nunca começa.',
    },
    direita: {
      rotulo: 'O que o método pede', acento: true,
      titulo: 'Salve o relatório como: Relatório/Diagnóstico – Capítulo X.',
      texto: 'Dois arquivos por capítulo, sempre: as respostas e o relatório. Eles são a base de todo o processo.',
    },
  });
  rod(s);
  nota(s, '27:30 · 2min',
    'Este e o ponto de falha numero um do metodo. Insista: dois arquivos por ' +
    'capitulo, sempre.');
}

{
  const s = slide(pres);
  rotulo(s, 'O efeito acumulado', { y: 2.2 });
  titulo(s, 'A partir do Capítulo 5, você sempre\nanexa os relatórios anteriores', { y: 2.75, w: 15 });
  percurso(s, [
    'Cap. 04\nAutoimagem',
    'Cap. 05\n+ relatório 04',
    'Cap. 06\n+ relatórios 04-05',
    'Cap. 07\n+ relatórios 04-06',
    'Cap. 08 a 10\n+ tudo o que veio antes',
    'Cap. 11\nBrand Book Vivo',
  ], { y: 6.1, w: 16.2 });
  reguaAcento(s, { y: 8.6, w: 1.2 });
  lead(s, 'Cada agente vai “lembrando” do que já foi construído. É um quebra-cabeça: cada peça tem valor, mas só o conjunto forma a imagem da sua marca.',
    { y: 8.9, w: 15, h: 0.9 });
  rod(s);
  nota(s, '29:30 · 1min30s',
    'Aqui eles entendem por que a ordem importa. Sem o relatorio anterior, ' +
    'o agente seguinte trabalha cego.');
}

/* ===========================================================================
   BLOCO 5 · NA PRATICA — 8 min
   =========================================================================== */

nota(slideSecao(pres, { numero: 5, nome: 'Agora com a sua marca', entrega: ENTREGA, cliente: ALUNO }),
  '31:00 · 20s', 'Transicao. Fim da teoria. Aqui eles abrem o computador.');

{
  const s = slide(pres);
  rotulo(s, 'Capítulo 04 · Autoimagem Estratégica', { y: 1.5 });
  titulo(s, 'Antes de posicionar uma marca, é preciso\nposicionar quem está por trás dela', { y: 2.0, w: 16, size: 36 });
  fio(s, { y: 3.9, w: 16.2 });
  legenda(s, 'Responda três destas sete perguntas agora. As outras quatro, hoje à noite.', { y: 4.2, w: 14, cor: COR.tinta });
  listaNumerada(s, [
    { numero: 1, titulo: 'Quais momentos da sua história moldaram quem você é como empresário?' },
    { numero: 2, titulo: 'Que características da sua personalidade aparecem no seu negócio?' },
    { numero: 3, titulo: 'Qual papel você mais exerce — e qual você evita assumir?' },
    { numero: 4, titulo: 'Que decisões você percebe que costuma repetir ao longo do tempo?' },
    { numero: 5, titulo: 'Que influências da sua história afetam o jeito como você toca o negócio?' },
    { numero: 6, titulo: 'O que já está mudando em você, mas ainda não apareceu na marca?' },
    { numero: 7, titulo: 'O que hoje já não combina mais com você — e não deve mais ser da marca?' },
  ], { y: 4.85, w: 16.2, passo: 0.66 });
  rod(s);
  nota(s, '31:20 · 4min',
    'EXERCICIO AO VIVO. Cronometre 3 minutos de silencio real para escreverem. ' +
    'Nao fale durante. Depois peca um voluntario para ler a resposta da 1.');
}

{
  const s = slide(pres);
  rotulo(s, 'A qualidade do insumo', { y: 2.2 });
  titulo(s, 'Resposta rasa gera diagnóstico raso', { y: 2.75, w: 14 });
  fio(s, { y: 4.4, w: 16.2 });
  contraposicao(s, {
    y: 4.85,
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
  citacao(s, 'A IA é um espelho estratégico — não um terapeuta. Ela não cria sua verdade: devolve com nitidez o que você já disse.',
    { y: 8.9, w: 15 });
  rod(s);
  nota(s, '35:20 · 2min',
    'Exemplo do medico, do Capitulo 04. Use para corrigir ao vivo a resposta ' +
    'do voluntario: mostre como aprofundar.');
}

{
  const s = slide(pres);
  rotulo(s, 'Antes de aceitar qualquer relatório', { y: 2.2 });
  titulo(s, 'O agente organiza.\nQuem valida é você.', { y: 2.75, w: 14 });
  fio(s, { y: 4.9, w: 13.4 });
  marcadores(s, [
    'Isso é realmente verdade sobre a minha marca, ou só soa bem?',
    'Eu conseguiria sustentar essa promessa na próxima segunda-feira?',
    'Há alguma afirmação aqui que eu não reconheço como minha?',
    'Ele citou alguma informação como fato? Peça a fonte.',
  ], { y: 5.35, w: 13.4, passo: 0.78 });
  reguaAcento(s, { y: 8.7, w: 1.2 });
  lead(s, 'O que você não validar hoje vira base errada para os sete capítulos seguintes.',
    { y: 9.0, w: 13.4, h: 0.8 });
  rod(s);
  nota(s, '37:20 · 1min40s',
    'Momento de responsabilidade. A IA devolve padroes; criterio e deles. ' +
    'Sem essa etapa, o Brand Book final sai bonito e falso.');
}

/* ===========================================================================
   BLOCO 6 · O DESTINO — 4 min
   =========================================================================== */

nota(slideSecao(pres, { numero: 6, nome: 'Brand Book Vivo', entrega: ENTREGA, cliente: ALUNO }),
  '39:00 · 20s', 'Transicao. Mostre onde tudo isso desemboca.');

{
  const s = slide(pres);
  rotulo(s, 'Capítulo 11', { y: 2.2 });
  titulo(s, 'Não é um PDF morto.\nÉ a chama acesa da sua identidade.', { y: 2.75, w: 15 });
  fio(s, { y: 5.0, w: 16.2 });
  colunas(s, [
    { titulo: 'O que ele organiza', texto: 'O que sua marca é, o que entrega, o que promete, como se comunica e como se sustenta no tempo.' },
    { titulo: 'De onde ele nasce', texto: 'Dos seus sete relatórios — não de um modelo genérico. É feito com você, por você.' },
    { titulo: 'Para que ele serve', texto: 'Avaliar se cada nova ação é coerente com a essência declarada. Não para arquivar: para usar.' },
  ], { y: 5.45, w: 16.2, alturaTexto: 2.0 });
  reguaAcento(s, { y: 8.6, w: 1.2 });
  lead(s, 'Reúna os relatórios dos capítulos 4 ao 10, anexe no agente do Capítulo 11 e salve como: Brand Book + nome da marca + data.',
    { y: 8.9, w: 15, h: 0.9 });
  rod(s);
  nota(s, '39:20 · 2min',
    'A maioria nunca usa o proprio brand book porque ele foi feito como ' +
    'entrega final. Este e diferente: nasce das respostas deles.');
}

nota(slideDeclaracao(pres, {
  sobretitulo: 'O limite e o poder da ferramenta',
  frase: 'A IA não cria a sua essência.\nEla cuida dela.',
  desdobramento: 'A IA só organiza o que você tiver coragem de declarar. A tecnologia não substitui sua essência — ela amplifica.',
  entrega: ENTREGA, cliente: ALUNO,
}), '41:20 · 1min40s',
  'Frase de fechamento conceitual da aula. Depois dela, so plano e oferta.');

/* ===========================================================================
   BLOCO 7 · PLANO E OFERTA — 6 min
   =========================================================================== */

nota(slideSecao(pres, { numero: 7, nome: 'Seu plano', entrega: ENTREGA, cliente: ALUNO }),
  '43:00 · 20s', 'Transicao. Saem daqui com data marcada, nao com intencao.');

{
  const s = slide(pres);
  rotulo(s, 'O ritmo que funciona', { y: 2.2 });
  titulo(s, 'Quatro semanas até o seu\nBrand Book Vivo', { y: 2.75, w: 14 });
  fio(s, { y: 4.8, w: 16.2 });
  colunas(s, [
    { numero: 1, titulo: 'Semana 1', texto: 'Capítulos 1 a 4. Termine a Autoimagem Estratégica que você começou aqui.' },
    { numero: 2, titulo: 'Semana 2', texto: 'Capítulos 5 e 6. Posicionamento e voz — o par que mais muda a comunicação.' },
    { numero: 3, titulo: 'Semana 3', texto: 'Capítulos 7 e 8. Arquitetura e expressão visual.' },
    { numero: 4, titulo: 'Semana 4', texto: 'Capítulos 9, 10 e 11. Proposta de valor, presença e o Brand Book.' },
  ], { y: 5.25, w: 16.2, alturaTexto: 1.8 });
  reguaAcento(s, { y: 8.0, w: 1.2 });
  lead(s, 'Um capítulo por vez, sem pular. Quem tenta fazer tudo em um fim de semana entrega respostas rasas — e recebe diagnóstico raso.',
    { y: 8.3, w: 15, h: 0.9 });
  rod(s);
  nota(s, '43:20 · 1min40s',
    'Peca para abrirem a agenda agora e marcarem os quatro blocos. ' +
    'Compromisso com data cumpre; intencao nao.');
}

{
  const s = slide(pres);
  rotulo(s, 'O que faz o método falhar', { y: 2.2 });
  titulo(s, 'Cinco erros — todos evitáveis', { y: 2.75, w: 14 });
  fio(s, { y: 4.4, w: 13.4 });
  marcadores(s, [
    'Pular etapas. Cada relatório é insumo do capítulo seguinte.',
    'Não salvar os dois arquivos: as respostas e o relatório.',
    'Aceitar o relatório sem validar o que está escrito.',
    'Misturar capítulos: verifique sempre se o agente é o mesmo das respostas.',
    'Colar as respostas antes de clicar no atalho dentro do agente.',
  ], { y: 4.85, w: 13.4, passo: 0.78 });
  reguaAcento(s, { y: 8.5, w: 1.2 });
  lead(s, 'Nenhum deles é sobre inteligência. Todos são sobre método.', { y: 8.8, w: 13.4, h: 0.7 });
  rod(s);
  nota(s, '45:00 · 1min40s',
    'Recapitulacao operacional. Se eles lembrarem so de um slide da aula, ' +
    'que seja este.');
}

{
  const s = slide(pres, { textura: true });
  card(s, { x: 1.125, y: 1.5, w: 17.75, h: 8.0 });
  microRotulo(s, 'Para continuar a partir daqui', { x: 1.9, y: 2.3, w: 10, acento: true });
  tituloSecao(s, 'O livro na sua mão', { x: 1.86, y: 2.8, w: 15, size: 52 });
  fio(s, { x: 1.9, y: 4.5, w: 16.2 });
  colunas(s, [
    { numero: 1, titulo: 'Você já tem o livro digital', texto: 'Ele acompanha esta aula. Todos os QR Codes, links, agentes e documentos estão nele.' },
    { numero: 2, titulo: '30% de desconto no livro físico', texto: 'Quem fez esta aula leva a edição impressa com 30% de desconto.\n\nCupom: «INSERIR CUPOM»' },
    { numero: 3, titulo: 'Por que ter o físico também', texto: 'Este é um livro para ser escrito, marcado e riscado. O digital dá acesso; o físico sustenta o hábito.' },
  ], { x: 1.9, y: 4.95, w: 16.2, alturaTexto: 2.2 });
  legenda(s, '«INSERIR LINK DE COMPRA»   ·   Oferta válida até «INSERIR PRAZO»', { x: 1.9, y: 8.6, w: 14, cor: COR.tinta });
  rod(s);
  nota(s, '46:40 · 2min20s',
    'OFERTA. Preencher cupom, link e prazo antes de apresentar. ' +
    'Argumento central: o digital da acesso, o fisico sustenta o habito de ' +
    'escrever no livro — e o metodo depende de escrever.');
}

nota(slideEncerramento(pres, { titulo: 'Agora é com você.' }), '49:00 · 1min',
  'Encerramento. Convide para postar uma foto com o livro e marcar ' +
  '@kellyalbert.brand. Abra para perguntas se o formato permitir.');

/* ========================================================================= */

const destino = 'decks/saida/aula-ia-com-essencia.pptx';
await salvar(pres, destino);
console.log(`Deck gerado: ${destino}`);
