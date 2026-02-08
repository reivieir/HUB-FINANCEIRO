
export interface FAQItem {
  p: string; // Pergunta
  r: string; // Resposta
}

export interface CommandItem {
  t: string; // Título
  c: string; // Conteúdo/Comando
}

export type Origin = 'faq' | 'command' | 'ai';

export interface SelectedContent {
  title: string;
  body: string;
  origin: Origin;
  index?: number;
}
