import { FAQItem, CommandItem } from './types';

export const COLORS = {
  dexcoGold: '#D4A373',
  dexcoDark: '#1A1A1A',
};

export const PERGUNTAS_FREQUENTES: FAQItem[] = [
  { p: "Como realizar o acesso ao portal?", r: "O parceiro recebe e-mail com usuário e senha. Deve acessar portaldexco.aevee.com.br, aceitar os Termos e alterar a senha." },
  { p: "Qual o prazo para o crédito cair na conta?", r: "O prazo de recebimento é até as 17h do dia, após aprovação interna e bancária." },
  { p: "Quais os requisitos para as notas aparecerem?", r: "Estar escriturada há 72h, valor mínimo de R$ 30,00 e janela de 7 dias úteis antes do vencimento." },
  { p: "Qual o horário de funcionamento do Portal?", r: "Das 10h às 14h (Horário de Brasília)." },
  { p: "Como recuperar meu usuário ou senha?", r: "No login, clique em 'Esqueceu a Senha' ou consulte seu comprador parceiro." },
  { p: "Por que minha nota não está disponível?", r: "Verifique o prazo de escrituração ou pendências em Certidões e Contrato Social." },
  { p: "Como altero meus dados bancários?", r: "Solicite formalmente ao seu comprador parceiro. A conta deve ser do mesmo CNPJ." },
  { p: "Posso usar conta de terceiros?", r: "Não. A conta bancária deve ser obrigatoriamente do mesmo CNPJ cadastrado." },
  { p: "Como libero o perfil de antecipação?", r: "Pelo portal: Home > Catálogo de serviços > CSC > CoE CSC > Atendimento ao Cervello > Solicitação de acesso ao Cervello CSC." },
  { p: "Quais documentos são obrigatórios para o cadastro?", r: "Contrato Social / Estatuto Social / Ata de Eleição da Diretoria\nProcuração, quando o solicitante não for administrador legal\nRG e CPF (ou CNH) do representante legal ou procurador\nFicha cadastral completa da Junta Comercial, atualizada e contendo o último arquivamento\nTermo de Responsabilidade, quando houver assinatura conjunta e necessidade de autorização de assinatura isolada." },
  { p: "O que significa o status 'APROVADO'?", r: "Significa que a Dexco validou internamente; a liberação bancária ocorre na sequência." },
  { p: "Como vejo o comprovante de pagamento?", r: "No menu Contas a Pagar, filtre por status 'Pago' e clique no ícone de download." },
  { p: "Como exportar meu extrato de títulos?", r: "Clique no botão Download na tela de Contas a Pagar; o arquivo irá para o seu e-mail." },
  { p: "Qual o valor mínimo para antecipação?", r: "Títulos acima de R$ 30,00 líquidos." },
  { p: "A taxa de juros é fixa?", r: "A taxa é baseada no contrato e nos dias antecipados até o vencimento." },
  { p: "Com quem falo sobre erros técnicos?", r: "Sempre com seu comprador parceiro, que direcionará para TI ou Tesouraria." },
  { p: "Esqueci o e-mail cadastrado, o que fazer?", r: "O comprador parceiro deve informar qual e-mail consta no sistema SAP/Cervello." },
  { p: "Como cadastrar novos usuários da minha empresa?", r: "O usuário Master pode criar novos acessos no menu de Usuários do Grupo." },
  { p: "Qual a validade das certidões enviadas?", r: "Devem estar dentro do prazo de validade legal emitido pelo órgão (Junta/Receita)." }
];

export const COMANDOS_GEMS: CommandItem[] = [
  { 
    t: "Cadastro Aprovado", 
    c: `Prezado(a) Fornecedor(a),

Informamos que sua documentação foi avaliada e aprovada. Em breve, você receberá os dados de usuário e senha para acesso ao Portal de Antecipação.

Lembramos que:
• O horário de funcionamento do Portal é das 10h às 14h.
• As NFS estarão disponíveis para antecipação 03 dias após a escrituração.
• A data mínima para solicitação de antecipação é de 07 dias úteis antes do vencimento.

Agradecemos o envio e pedimos que fique atento(a) à data de validade de seus documentos, enviando-os para atualização sempre que necessário.

Att
Grupo Dexco` 
  },
  { 
    t: "Recuperar Acesso", 
    c: `Caro Fornecedor;

Favor acessar o portal no endereço https://portaldexco.aevee.com.br/login, clicar em “Esqueceu a Senha”, inserir o usuário informado XXXXX e clicar em “Enviar”.

Você receberá um e-mail com as informações para acesso no "E-mail para Cadastro" informado nesse chamado.

Att.
Grupo Dexco` 
  },
  { 
    t: "Fluxo de Habilitação Antecipação de Recebiveis", 
    c: `Caro Fornecedor,

Para dar início ao processo de adesão ao Risco Sacado, solicitamos que, primeiramente, entre em contato com o comprador responsável pela sua negociação. Ele será o seu ponto de apoio inicial e disponibilizará todas as informações necessárias para a adesão ao programa.

No primeiro contato entre você e o comprador parceiro, serão tratadas as condições comerciais obrigatórias para participação no Risco Sacado. Após a definição e aprovação dessas condições pelo comprador, solicitamos que siga o fluxo descrito abaixo:

1ª Etapa – Solicitação de acesso
Acessar o endereço: https://www.cervelloesm.com.br/Dexco/Portal/Home
Navegar por: Home > Catálogo de serviços > CSC > CoE CSC > Atendimento ao Cervello > Solicitação de acesso ao Cervello CSC
Qual tipo de solicitação: Solicitante
Área: Tesouraria
Fila: Liberação Perfil de Antecipação de Recebíveis.

Após essa solicitação, o chamado seguirá para aprovação dos administradores internos.

2ª Etapa – Liberação do Perfil de Antecipação de Recebíveis
Após a aprovação da 1ª etapa, acessar novamente o portal: https://www.cervelloesm.com.br/Dexco/Portal/Home
Navegar por: Home > Catálogo de Serviços > CSC > Tesouraria > Liberação Perfil de Antecipação de Recebíveis.

Preencha todas as informações solicitadas para abertura do chamado. Após isso, o chamado será encaminhado ao comprador responsável, para aprovação do chamado. Ele aprovando, o chamado seguirá para a área de Tesouraria, que realizará a análise da documentação enviada. Estando tudo conforme, o acesso ao portal de antecipações será liberado. Enviaremos usuário e senha.

Documentação obrigatória:
- Contrato Social / Estatuto Social / Ata de Eleição da Diretoria
- Procuração, quando o solicitante não for administrador legal
- RG e CPF (ou CNH) do representante legal ou procurador
- Ficha cadastral completa da Junta Comercial, atualizada e contendo o último arquivamento
- Termo de Responsabilidade, quando houver assinatura conjunta e necessidade de autorização de assinatura isolada

Prazo de atendimento: Até 5 dias úteis.

Atenciosamente,
Grupo Dexco` 
  },
  { 
    t: "Extrair", 
    c: "Sempre que eu disser Extrair, eu vou colar uma imagem e você extraia o Nome, RG e CPF, o nome em maiúsculo e o RG e o CPF sem formatação." 
  },
  { 
    t: "Cancelado", 
    c: `Prezado(a) Fornecedor(a),

Informamos que o chamado foi encerrado devido à ausência de interação. Caso ainda tenha interesse em obter acesso ao Portal de Antecipações, solicitamos a gentileza de reabrir o chamado.

Atenciosamente,
Grupo Dexco` 
  },
  { 
    t: "Alterar Email Cadastrado", 
    c: `Prezado(a) Fornecedor(a),

Informamos que o e-mail vinculado ao seu cadastro foi alterado de [EMAIL_ANTIGO] para [EMAIL_NOVO], conforme este chamado.

Para gerar nova senha de acesso:
Acesse: https://portaldexco.aevee.com.br/login
Clique em "Esqueceu a Senha"
No campo de usuário, insira: [USUARIO]
Clique em "Enviar"

Atenciosamente,
Grupo Dexco` 
  },
  { 
    t: "Usuário Criado", 
    c: `Prezado(a) Fornecedor(a),

Informamos que o seu primeiro acesso ao Portal de Fornecedores foi criado com sucesso. Acesse: https://portaldexco.aevee.com.br/login.

Atenciosamente,
Grupo Dexco` 
  },
  { 
    t: "Termo de Responsabilidade", 
    c: `Prezado(a) Fornecedor(a),

Durante a análise da documentação enviada, verificamos que o modo de representação da empresa estabelece assinatura conjunta. Será necessário que os administradores autorizem formalmente o operador indicado via Termo de Responsabilidade.

Orientações:
1. Assinatura Digital: Via certificado ICP-Brasil.
2. Assinatura em Cartório: Reconhecimento de firma por autenticidade.

Atenciosamente,
Dexco S.A.` 
  },
  { 
    t: "Regras de Antecipação", 
    c: `Prezado(a) Fornecedor(a),

Os títulos somente serão exibidos para solicitação de antecipação quando atenderem aos critérios abaixo:
1. Disponibilidade: 3 dias após a escrituração.
2. Janela: Até 7 dias úteis antes do vencimento.
3. Valor Mínimo: Notas inferiores a R$ 30,00 não ficam disponíveis.

Atenciosamente,
Grupo Dexco` 
  }
];
