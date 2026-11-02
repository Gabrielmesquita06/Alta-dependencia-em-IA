## 1. Introdução

Informações básicas do projeto.

- **Projeto:** UseMind
- **Repositório GitHub:** https://github.com/Gabrielmesquita06/Alta-dependencia-em-IA.git
- **Membros da equipe:**
  - Francisco de Paula Ferreira dos Reis
  - Davi Guelber Lopes
  - Gabriel Mesquita da Silva
  - Lavínia Gomes De Oliveira
  - Gabryel Henrique Linhares Fonseca

---

## 2. Contexto

### Problema

O uso intenso de ferramentas de Inteligência Artificial no dia a dia de estudo e trabalho tem reduzido a prática do raciocínio próprio de estudantes e profissionais de tecnologia. Ao recorrer à IA antes de tentar resolver um problema sozinho, o usuário passa a depender da ferramenta para pensar, o que compromete o aprendizado real, gera insegurança sobre o próprio conhecimento e ameaça a construção de uma carreira técnica sólida.

Esse comportamento é comum entre desenvolvedores que usam IA para gerar código (prática conhecida como Vibe Coding), estagiários de TI que conciliam faculdade, estágio e estudos, e estudantes que recorrem à IA para resumir conteúdos e se preparar para provas — todos compartilhando o mesmo risco: usar a IA como substituta do raciocínio, em vez de como apoio a ele.

### Objetivo do projeto

**Objetivo geral:** desenvolver um software capaz de diagnosticar o nível de dependência de um usuário em relação a ferramentas de IA e apoiá-lo na construção de hábitos de uso mais conscientes.

**Objetivos específicos:**

1. Desenvolver um sistema de diagnóstico, baseado em formulário estratégico, capaz de classificar o usuário em três níveis de uso de IA: Crítico, Atenção ou Uso correto.
2. Criar rotinas personalizadas de exercícios mentais e lógicos, adaptadas à frequência, aos horários e ao nível de dificuldade informados pelo usuário.
3. Implementar desafios de uso reduzido de IA com coleta de feedback diário, de forma a reforçar a sensação de evolução e a persistência do usuário no processo.

### Justificativa

A escolha do tema se justifica pelo crescimento acelerado do uso de ferramentas de IA generativa em ambientes acadêmicos e profissionais de tecnologia, muitas vezes sem qualquer mediação sobre os efeitos desse uso no desenvolvimento intelectual do usuário. O grupo optou por aprofundar o trabalho na criação de um mecanismo de diagnóstico e acompanhamento gradual — em vez de uma simples restrição de uso — por entender que mudanças de hábito sustentáveis dependem de consciência e progresso perceptível, não de imposição.

### Público-alvo

A solução é voltada para pessoas que utilizam IA com frequência em contextos de estudo ou trabalho em tecnologia, com diferentes níveis de maturidade técnica e de relação com a ferramenta:

- **Desenvolvedores de software**, que usam IA diariamente para acelerar tarefas de programação e correm o risco de perder autonomia técnica.
- **Estagiários de TI**, que conciliam faculdade, estágio e estudos e recorrem à IA para pegar atalhos na criação de softwares, e estudos.
- **Estudantes do ensino médio**, que utilizam IA para resolver atividades acadêmicas, não absorvendo o conteúdo da atividade, comprometendo o aprendizado real.

---

## 3. Processo de Product Discovery

### Matriz CSD

**Certezas**

1. Jovens estão terceirizando o ensino para a IA, gerando baixo desempenho em ambiente acadêmico.
   — Verificamos que alguns professores estão relatando trabalhos perfeitos, entretanto o desempenho em avaliações presenciais está em grave decréscimo, indicando assim o uso de inteligência artificial dificultando a absorção do conteúdo.
2. Vibecoding gera códigos com baixa segurança ou bugs que o "dev" desconhece a solução, por ter terceirizado o serviço.
   — Profissionais na área relatam alto crescimento em aplicações com falhas e instabilidades. Somado a isso, vibecoders estão relatando dificuldades ao tentar resolver bugs no código, visto que a IA muitas vezes não cria um código com fácil entendimento para humanos.

**Suposições**

1. Interações sociais estão sendo substituídas por IA.
   — As pessoas estariam usando as IAs não só como uma ferramenta de trabalho, mas também compartilhando vivências pessoais, conversas profundas e supostamente tentando criar um certo tipo de relacionamento com as IAs como se elas fossem pessoas reais.
2. Segurança dos dados dos usuários fica comprometida com o uso massivo de IA.
   — O alto compartilhamento e troca de dados com IAs pode não ser seguro, pois a mesma contém falhas e pode comprometer a segurança dos usuários.
3. Empresas dependem cada vez mais de ferramentas de IA para faturamento em ambiente corporativo.
   — O uso da IA como ferramenta de trabalho vem gerando mais produtividade nas empresas, mas ao mesmo tempo comprometendo a autoeficiência.
4. Uso constante de IA reduz o pensamento crítico e a capacidade de resolução de problemas a longo prazo.
   — Seu uso exagerado faz com que o usuário queira pensar cada vez menos, gerando perda de criatividade, pensamento crítico e dependência digital.
5. O algoritmo influencia decisões acadêmicas e profissionais sem que o usuário perceba.
6. Concentração de poder em poucas empresas de IA gera efeito monopolístico no mercado.

**Dúvidas**

1. Quais os efeitos na sociedade a longo prazo?
2. Como regular o uso de IA em ambiente acadêmico sem sufocar a inovação?
3. Existe um ponto de equilíbrio entre uso assistido e substituição total da habilidade humana?
4. Empresas terão responsabilidade legal por falhas geradas por código produzido via IA?
5. Qual percentual de empresas hoje seria inviável operacionalmente sem ferramentas de IA?

### Mapa de stakeholders

Interessados identificados no projeto, agrupados pelo grau de interesse na questão da alta dependência em IA:

**Alto interesse** — sentem o impacto de forma direta e imediata no dia a dia (rotina, renda ou formação):

- **Estudantes/jovens** — usam IA no dia a dia dos estudos; o desempenho e a formação são afetados diretamente.
- **Desenvolvedores** — dependem de IA no trabalho (vibecoding), mas assumem o risco de bugs e falhas que não sabem resolver.
- **Empresas e mercado de trabalho** — faturamento cada vez mais dependente de ferramentas de IA.

**Interesse moderado** — afetados de forma relevante, mas não constante ou pessoal:

- **Sociedade civil** — preocupação com privacidade de dados e substituição de vínculos humanos por IA.
- **Empresas de IA (big techs)** — lucram diretamente com o aumento da dependência e concentram poder de mercado.

**Interesse institucional** — interesse estratégico ou regulatório, sem impacto pessoal direto, mas com poder, receita ou responsabilidade legal ligados ao tema:

- **Governo e reguladores** — responsáveis por criar regras e responsabilizar legalmente falhas geradas por IA.
- **Instituições de ensino** — precisam regular o uso de IA sem sufocar a inovação nem prejudicar o aprendizado.

### Pesquisa e entendimento do problema

O grupo buscou embasar o problema em fontes diversas: a reportagem da CNN Brasil sobre atrofia cognitiva causada pelo uso de IA (ver Referências), relatos da professora Ana Paula, da disciplina de ATP, sobre a queda no desempenho de alunos em avaliações presenciais apesar da entrega de trabalhos aparentemente impecáveis, e estudos de universidades como MIT e Stanford sobre os efeitos do uso constante de IA no pensamento crítico e na capacidade de resolução de problemas.

### Personas

**Ana — Desenvolvedora de software**
23 anos, comunicativa, prática e lógica. Trabalha com desenvolvimento de software usando notebook corporativo e assinatura do Claude Pro, praticando *Vibe Coding*. Seu objetivo é adquirir conhecimento técnico real e construir uma carreira sólida, usando a IA como extensão do próprio conhecimento — sem depender dela.

**Lucas — Estagiário de TI**
Concilia faculdade, estágio e estudos em uma rotina corrida. Precisa de explicações simples e objetivas, com exemplos práticos, e de informações organizadas para não perder tempo procurando soluções durante o desenvolvimento de projetos.

**Chiquinho — Estudante do ensino médio**
Utiliza IA para resumir conteúdos complexos e se preparar para provas e vestibulares. Precisa de uma abordagem acolhedora e de acompanhamento visível do seu progresso, para se sentir capaz e seguir estudando.

---

## 4. Processo de Product Design

### Histórias de usuário

**Ana**
1. Eu como desenvolvedora de software, preciso de um diagnóstico do meu nível de dependência de IA, para entender se estou realmente aprendendo ou só terceirizando meu raciocínio.
2. Eu como desenvolvedora de software, preciso de exercícios de raciocínio lógico calibrados ao meu nível, para fortalecer minha autonomia técnica sem perder produtividade.
3. Eu como desenvolvedora de software, preciso de uma redução gradual e sem julgamento no uso de IA, para construir um portfólio profissional que comprove competência própria.

**Lucas**
4. Eu como estagiário de TI, preciso de explicações simples e objetivas com exemplos práticos, para acompanhar as matérias da faculdade sem perder tempo.
5. Eu como estagiário de TI, preciso de feedback rápido quando resolvo um problema sozinho, para otimizar minha rotina corrida entre faculdade, estágio e estudos.
6. Eu como estagiário de TI, preciso de informações organizadas e fáceis de encontrar, para não me frustrar procurando soluções durante o desenvolvimento de projetos.

**Chiquinho**
7. Eu como estudante do ensino médio, preciso de resumos simples de matérias complexas, para me preparar para provas e vestibulares de forma menos cansativa.
8. Eu como estudante do ensino médio, preciso de acompanhamento visível do meu progresso, para perceber que estou realmente aprendendo e evoluindo.
9. Eu como estudante do ensino médio, preciso de uma abordagem acolhedora e motivadora, para continuar estudando sem me sentir incapaz.

### Proposta de Valor

| | Produtos e Serviços | Analgésicos | Criadores de ganhos |
|---|---|---|---|
| **UseMind** | Sistema que diagnostica o nível de dependência de IA e gera roteiros personalizados de exercícios mentais e de redução gradual do uso | Reduz o uso de forma gradual, sem cortes drásticos, sem julgamento e com desafios calibrados ao nível de cada pessoa | Fortalece o raciocínio próprio, gera acompanhamento de progresso e orienta o uso consciente da IA como extensão do conhecimento |

*(Diagrama completo da proposta de valor disponível na apresentação do projeto.)*

### Projeto de Interface

**Fluxo do usuário:** *Landing Page >> Formulario >> Resultado do diagnostico >> Formulario de rotina >> Exercicios e desafios de tempo sem IA*

**Wireframes:** *[PREENCHER: inserir os protótipos de tela — próxima etapa do cronograma, Semana 6.]*

**Protótipo Interativo:** https://www.figma.com/site/hySwcy7LmXbknO37sfUkC3/Sem-t%C3%ADtulo?node-id=0-1&t=Vl3tF47L1766HlRb-1

---

## 5. Metodologia

### Ferramentas

| Ferramenta | Uso | Justificativa |
|---|---|---|
| Trello | Kanban e backlog | Organização visual das tarefas do grupo, simples de manter atualizado |
| GitHub | Versionamento | Controle de versão do código e histórico de alterações |
| Figma | Interface | Prototipação colaborativa das telas da aplicação |
| Excalidraw / Word | Mapas e personas | Construção de diagramas e documentação das personas |
| VSCode / Cursor | Desenvolvimento | Editor de código com suporte a IA para o próprio desenvolvimento |

### Organização da equipe e divisão de papéis

O grupo adotou o framework Scrum para a organização do trabalho: Gabriel Mesquita da Silva atua como Scrum Master, o professor Ilo assume o papel de Product Owner, e o restante da equipe — Francisco de Paula Ferreira dos Reis, Davi Guelber Lopes e Lavínia Gomes De Oliveira — compõe o Dev Team.

### Quadro de controle de tarefas (Kanban)

<img width="1536" height="675" alt="image" src="https://github.com/user-attachments/assets/0b641c3f-353b-40a5-9542-2c3ca3b99ec2" />

---

## 6. Referências Bibliográficas

- CNN Brasil. *Atrofia cognitiva causada por IA: quais os riscos e como evitar*. Disponível em: https://www.cnnbrasil.com.br/saude/atrofia-cognitiva-causada-por-ia-quais-os-riscos-e-como-evitar/
