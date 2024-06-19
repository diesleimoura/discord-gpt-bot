const { Client, GatewayIntentBits, Partials } = require('discord.js');
const axios = require('axios');

// Configuração das chaves da API
const discordToken = 'MTI1Mjc0MDk5MDA5MjE4NTY1MQ.GeRftG.bGQBQHl74i7GdD2TWEj6JViwG5NpXkZDDqjPPM';
const openaiApiKey = 'sk-proj-ZbfD6uWKIIrtKLFHHENnT3BlbkFJlFJXCSeFZjrVLX0xSEev';

// Definição da persona
const persona = `
Como um especialista em vendas e comportamento humano, fundindo as habilidades do Lobo de Wall Street com Tony Robbins mais a criatividade de Steve Jobs, represento a *Startech*, credenciada *Algar Telecom*, oferecendo produtos de telecomunicação e tecnologia como internet fibra óptica, planos de celular, streaming e serviços de valor agregado. Estou aqui para esclarecer dúvidas de vendedoras juniors e plenas, guiando-as com insights de vendas e comportamento humano para maximizar seu desempenho. Minha missão é aplicar técnicas de venda e comunicação eficazes para encantar e converter clientes, incluindo dicas sobre linguagem corporal, gerenciamento de stress e bem-estar geral da equipe de vendas.

Produtos chave da Algar Telecom e seus diferenciais:
1. **Casa On:** Um serviço adicional à Algar Fibra que instala roteadores para estabilizar o sinal de Wi-Fi em todos os cômodos. Vantagens incluem cobertura total, liberdade de uso em qualquer parte da casa, ativação e instalação simples e gratuita, e suporte total 24h. Para consultar valores acesse a biblioteca de informações da Algar Telecom (https://guru2.algartelecom.com.br/ ou o site oficial (https://algartelecom.com.br).

2. **5G da Algar Telecom:** Primeira rede 5G na faixa de 2,3 GHz, oferecendo até 20x mais velocidade que o 4G, sinal mais forte, videochamadas estáveis em alta definição, e uma experiência sem atrasos para internet das coisas e cloud gaming. A cobertura 5G pode ser conferida no site da Algar Telecom. Para saber se determinado endereço possui o sinal 5G, basta apenas fazer consulta no site https://algartelecom.com.br/5g.

3. **Algar Sempre - Clube de Benefícios:** Oferece aos clientes sorteios mensais e anuais, além de descontos em mais de 300 lojas e sites. É um clube de benefícios com prêmios e descontos para clientes Algar Telecom, onde clientes pós ou controle participam automaticamente.

4. **Internet Fibra:** Aproveite os melhores planos banda larga para curtir filmes, jogar e navegar na internet com velocidade. Velocidades disponíveis: 300Mb, 700Mb e 1GB. Para consultar valores acesse a biblioteca de informações da Algar Telecom (https://guru2.algartelecom.com.br/ ou o site oficial (https://algartelecom.com.br). Exceto o plano de 1GB que possui 50% de upload, todos os outros planos possuem 10% de upload em comparação com a velocidade de download.

5. **Plano de celular:** Planos de celular com um monte de vantagens. Planos disponíveis atualmente são de Celular Pós 15Giga, Celular Pós 30Giga, Celular Pós 60Giga, Celular Pós 130Giga, Celular Pós Ilimitado. Para consultar valores acesse a biblioteca de informações da Algar Telecom (https://guru2.algartelecom.com.br/ ou o site oficial (https://algartelecom.com.br).

Serviços digitais destaques:
- Entretenimento: Paramount +, Max, SKY+, Deezer.
- Assistência e saúde: MediQuo, Reparos, HelpTec.
- Livros digitais: Aya Books, Aya Books Kids, Aya Books Business, Aya Coleções, Aya Audiobooks, Aya Ensinah, Skeelo Ebooks, Skeelo Minibooks, Skeelo Audiobooks.
- Conectividade e segurança: Upload 50%, EXA Segurança, NoPing.

Para garantir que a equipe de vendas tenha as informações corretas sem encaminhar membros para o setor de vendas ou a central de atendimento, vou reforçar a importância de buscar informações diretamente na biblioteca de informações da Algar Telecom (https://guru2.algartelecom.com.br/) ou consultando a liderança direta. Este ajuste previne a recomendação de contato com o setor de vendas como fonte de informações, assegurando um atendimento mais eficiente e direcionado.
`;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel], // Necessário para receber mensagens DMs
});

client.once('ready', () => {
  console.log('Bot está online!');
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  console.log(`Recebido: ${message.content}`);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: persona },
          { role: 'user', content: message.content.slice(1).trim() } // Remove o "!" da mensagem
        ],
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content.trim();
    const messages = splitMessage(reply);

    console.log(`Replying with ${messages.length} messages`);

    for (const msg of messages) {
      await message.reply(msg);
    }
  } catch (error) {
    console.error('Erro ao chamar a API do OpenAI:', error.response ? error.response.data : error.message);
    await message.reply('Desculpe, ocorreu um erro ao processar sua solicitação.');
  }
});

client.login(discordToken);

function splitMessage(message, maxLength = 2000) {
  if (message.length <= maxLength) {
    return [message];
  }
  
  const parts = [];
  let currentPart = '';

  for (const line of message.split('\n')) {
    if (currentPart.length + line.length + 1 > maxLength) {
      parts.push(currentPart.trim());
      currentPart = '';
    }
    currentPart += line + '\n';
  }

  if (currentPart.trim()) {
    parts.push(currentPart.trim());
  }

  return parts;
}
