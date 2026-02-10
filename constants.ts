import { FAQItem, CommandItem } from './types';

export const COLORS = {
  dexcoGold: '#D4A373',
  dexcoDark: '#1A1A1A',
};

export const PERGUNTAS_FREQUENTES: FAQItem[] = [
  // --- BLOCO 1: ACESSO E SUPORTE AO FORNECEDOR (Base Original) ---
  { p: "Como realizar o acesso ao portal?", r: "O parceiro recebe e-mail com usuário e senha. Deve acessar portaldexco.aevee.com.br, aceitar os Termos e alterar a senha." },
  { p: "Qual o prazo para o crédito cair na conta?", r: "O prazo de recebimento é até as 17h do dia, após aprovação interna e bancária." },
  { p: "Quais os requisitos para as notas aparecerem?", r: "Estar escriturada há 72h, valor mínimo de R$ 30,00 e janela de 7 dias úteis antes do vencimento." },
  { p: "Qual o horário de funcionamento do Portal?", r: "Das 10h às 14h (Horário de Brasília)." },
  { p: "Como recuperar meu usuário ou senha?", r: "No login, clique em 'Esqueceu a Senha' ou consulte seu comprador parceiro." },
  { p: "Por que minha nota não está disponível?", r: "Verifique o prazo de escrituração ou pendências em Certidões e Contrato Social." },
  { p: "Como altero meus dados bancários?", r: "Solicite formalmente ao seu comprador parceiro. A conta deve ser do mesmo CNPJ." },
  { p: "Posso usar conta de terceiros?", r: "Não. A conta bancária deve ser obrigatoriamente do mesmo CNPJ cadastrado." },
  { p: "Como libero o perfil de antecipação?", r: "Pelo portal: Home > Catálogo de serviços > CSC > CoE CSC > Atendimento ao Cervello > Solicitação de acesso ao Cervello CSC." },
  { p: "O que significa o status 'APROVADO'?", r: "Significa que a Dexco validou internamente; a liberação bancária ocorre na sequência." },
  { p: "Como vejo o comprovante de pagamento?", r: "No menu Contas a Pagar, filtre por status 'Pago' e clique no ícone de download." },
  { p: "Como exportar meu extrato de títulos?", r: "Clique no botão Download na tela de Contas a Pagar; o arquivo irá para o seu e-mail." },
  { p: "Qual o valor mínimo para antecipação?", r: "Títulos acima de R$ 30,00 líquidos." },
  { p: "A taxa de juros é fixa?", r: "A taxa é baseada no contrato e nos dias antecipados até o vencimento." },
  { p: "Com quem falo sobre erros técnicos?", r: "Sempre com seu comprador parceiro, que direcionará para TI ou Tesouraria." },
  { p: "Esqueci o e-mail cadastrado, o que fazer?", r: "O comprador parceiro deve informar qual e-mail consta no sistema SAP/Cervello." },
  { p: "Como cadastrar novos usuários da minha empresa?", r: "O usuário Master pode criar novos acessos no menu de Usuários do Grupo." },
  { p: "Qual a validade das certidões enviadas?", r: "Devem estar dentro do prazo de validade legal emitido pelo órgão (Junta/Receita)." },

  // --- BLOCO 2: CONHECIMENTO TÉCNICO AVANÇADO (Extraído dos POPs) ---
  { p: "Quais as transações SAP S/4HANA associadas ao Risco Sacado?", r: "As transações principais são: /n/AEV/TFI015 (Habilitação), /n/AEV/TFI092 (Retorno de Arquivo), /n/AEV/TFI14 (Remessa e Gestão de Títulos) e /n/AEV/TFI045 (Manutenção de Usuários)[cite: 93, 95, 187, 267]." },
  { p: "Quais os bancos parceiros e seus códigos?", r: "Atualmente operamos com: ABC Brasil (246), Bradesco (237), Daycoval (707), Santander (033), Itaú (341) e Safra (422)[cite: 213]." },
  { p: "Como processar a remessa diária de arquivos?", r: "Na TFI14, selecione as empresas BRDX/BRDF e o modo 'Remessa'. Marque 'Pendente' e 'Aprovado'. Às 14:00, selecione todos, clique em Aprovar e depois em 'Gerar Remessa' [cite: 103-109]." },
  { p: "Como tratar uma rejeição integral da remessa pelo banco (Erro 1)?", r: "Acesse a TFI14 no modo Remessa, selecione o banco rejeitado, clique em 'Desaprovar' e depois em 'Rejeitar'. Os títulos serão reabertos para o fornecedor [cite: 136-141]." },
  { p: "Como desbloquear um usuário ou renovar senha via SAP?", r: "Utilize a transação /n/AEV/TFI045. Localize o fornecedor, selecione a linha do usuário e clique em 'Usuário Portal'. Use F6 para alterar a senha ou Shift+Ctrl+0 para desbloquear [cite: 284-289]." },
  { p: "Qual a regra para o usuário aprovador (RCC)?", r: "O portal permite apenas 01 (um) usuário aprovador (RCC) por fornecedor, que deve ser configurado na aba CRM da TFI015[cite: 194, 207]." },
  { p: "Quais documentos são obrigatórios para o cadastro?", r: "Contrato Social/Estatuto, Procuração (se aplicável), RG/CPF do representante legal, Ficha da Junta Comercial atualizada e Termo de Responsabilidade para assinaturas conjuntas[cite: 195, 201]." }
];

export const COMANDOS_GEMS: CommandItem[] = [
  // --- BLOCO 1: TEMPLATES DE RESPOSTA (Base Original) ---
  { 
    t: "Cadastro Aprovado", 
    c: "Prezado(a) Fornecedor(a),\n\nInformamos que sua documentação foi avaliada e aprovada. Em breve, você receberá os dados de usuário e senha para acesso ao Portal de Antecipação.\n\nLembramos que:\n• O horário de funcionamento do Portal é das 10h às 14h.\n• As NFS estarão disponíveis para antecipação 03 dias após a escrituração.\n• A data mínima para solicitação de antecipação é de 07 dias úteis antes do vencimento.\n\nAtt\nGrupo Dexco" 
  },
  { 
    t: "Recuperar Acesso", 
    c: "Caro Fornecedor;\n\nFavor acessar o portal no endereço https://portaldexco.aevee.com.br/login, clicar em “Esqueceu a Senha”, inserir o usuário informado XXXXX e clicar em “Enviar”.\n\nAtt.\nGrupo Dexco" 
  },
  { 
    t: "Fluxo de Habilitação Antecipação de Recebiveis", 
    c: "Caro Fornecedor,\n\nPara iniciar o processo de adesão, siga as etapas:\n1ª Etapa: Solicitação de acesso no Cervello (Fila: Tesouraria -> Liberação Perfil de Antecipação).\n2ª Etapa: Após aprovação, abertura de chamado com documentação obrigatória.\nPrazo de atendimento: Até 5 dias úteis.\n\nAtenciosamente,\nGrupo Dexco" 
  },
  { 
    t: "Extrair", 
    c: "Extraia o Nome, RG e CPF desta imagem. Regras: Nome em MAIÚSCULO. RG e CPF apenas números, sem pontos ou traços." 
  },
  { 
    t: "Cancelado", 
    c: "Prezado(a) Fornecedor(a),\n\nInformamos que o chamado foi encerrado devido à ausência de interação. Caso ainda tenha interesse, solicite a reabertura.\n\nAtenciosamente,\nGrupo Dexco" 
  },
  { 
    t: "Alterar Email Cadastrado", 
    c: "Prezado(a) Fornecedor(a),\n\nInformamos que o e-mail vinculado ao seu cadastro foi alterado de [EMAIL_ANTIGO] para [EMAIL_NOVO]. Acesse o portal e use a opção 'Esqueceu a Senha' com o usuário [USUARIO].\n\nAtenciosamente,\nGrupo Dexco" 
  },
  { 
    t: "Usuário Criado", 
    c: "Prezado(a) Fornecedor(a),\n\nInformamos que o seu primeiro acesso ao Portal de Fornecedores foi criado com sucesso. Acesse: https://portaldexco.aevee.com.br/login.\n\nAtenciosamente,\nGrupo Dexco" 
  },
  { 
    t: "Termo de Responsabilidade", 
    c: "Prezado(a) Fornecedor(a),\n\nVerificamos que o modo de representação exige assinatura conjunta. Será necessário autorizar o operador via Termo de Responsabilidade (Assinatura ICP-Brasil ou Firma reconhecida por autenticidade).\n\nAtenciosamente,\nDexco S.A." 
  },
  { 
    t: "Regras de Antecipação", 
    c: "Prezado(a) Fornecedor(a),\n\nCritérios de exibição:\n1. Disponibilidade: 3 dias após escrituração.\n2. Janela: Até 7 dias úteis antes do vencimento.\n3. Valor Mínimo: Notas superiores a R$ 30,00.\n\nAtenciosamente,\nGrupo Dexco" 
  },

  // --- BLOCO 2: ROTEIROS TÉCNICOS INTERNOS (Extraído dos POPs) ---
  { 
    t: "Habilitação Técnica (TFI015)", 
    c: "PASSO A PASSO TFI015:\n1. Antecipação Financeira → Operação → Cadastro de Fornecedor.\n2. Localize via CNPJ e clique em Alterar.\n3. Aba CRM: Clique em '+' e preencha Nome, Cargo, E-mail, RG e CPF.\n4. Marque 'RCC' para o usuário aprovador.\n5. Aba Antecipação: Altere o status para 1 (Ativo).\n6. Clique em E-mail Boas-Vindas [cite: 202-209]." 
  },
  { 
    t: "Tratar Erro de Retorno (TFI092)", 
    c: "PROCEDIMENTO DE RETORNO:\n1. Transação /n/AEV/TFI092.\n2. Carregar variante 'BANCOS' (Shift+F5).\n3. Informar empresa e prefixo DXRS.\n4. Na TFI14, verificar se a coluna 'Baixa Lanç' está com 'X' [cite: 119-128]." 
  },
  { 
    t: "Estorno Manual (TFI014/Erro 3)", 
    c: "CASO DE BAIXA INDEVIDA:\n1. Acesse TFI14 no modo 'Por Nota' ou 'Por Solicitação'.\n2. Selecione o título ou fornecedor.\n3. Clique em 'Estornar' e depois em 'Rejeitar'.\nOs títulos serão reabertos para nova antecipação [cite: 149-156]." 
  }
];
