# Task Manager - Sistema de Gerenciamento de Tarefas (Kanban)

Projeto desenvolvido durante a graduação na disciplina de **Projeto Integrador** com o objetivo de aplicar conhecimentos em desenvolvimento web full stack, autenticação, modelagem de dados, desenvolvimento backend e frontend responsivo.

A aplicação é um sistema de gerenciamento de tarefas colaborativo, onde usuários podem criar quadros kanban, gerenciar tarefas e acompanhar estatísticas de produtividade.

---

## Funcionalidades

- Login com Google utilizando OIDC (OpenID Connect) via NextAuth;
- Criação de quadros Kanban;
  - Adição de usuários ao quadro através de identificador único de 6 dígitos;
  - Criação de tarefas vinculadas a um quadro;
  - Vinculação e gerenciamento de tarefas entre os integrantes do quadro;
  - Visualização do quadro em formato Kanban (Para Fazer, Fazendo, Feito);
  - Aba de estatísticas com tarefas finalizadas (arquivadas);
- Visão geral **"Minhas Tarefas"**, exibindo todas as tarefas vinculadas ao usuário em diferentes quadros.

---

## Conceitos Aplicados

- **Next.js**  
  - Estruturação da aplicação full stack com renderização híbrida.

- **NextAuth (OIDC com Google)**  
  - Autenticação segura utilizando provedor externo;  
  - Gerenciamento de sessão do usuário.

- **Prisma ORM**  
  - Modelagem e manipulação do banco de dados;  
  - Mapeamento objeto-relacional.

- **tRPC**  
  - Comunicação tipada entre frontend e backend.

- **Tailwind CSS**  
  - Estilização com abordagem utility-first.

- **Arquitetura em Camadas**  
  - Separação entre lógica de apresentação, regras de negócio e persistência de dados.

- **Controle de Acesso**  
  - Ações restritas a usuários autenticados;  
  - Associação de tarefas e quadros a usuários específicos.

---

## Estrutura Funcional do Sistema

### Quadros

Cada usuário pode criar múltiplos quadros Kanban.  

Os quadros possuem:
- Nome;
- Descrição;
- Lista de membros vinculados.

---

### Tarefas

Cada tarefa pertence a um quadro e contém:
- Título;
- Descrição;
- Responsável;
- Data limite;
- Status (Para fazer, Fazendo ou Feito).

Tarefas finalizadas são arquivadas e exibidas na aba de estatísticas do quadro.

---

### Identificador de Usuário

Cada usuário possui um identificador numérico de 6 dígitos, gerado aleatoriamente em intervalos de tempo, utilizado para ser adicionado a novos quadros.

---

### Minhas Tarefas

Visão consolidada que permite ao usuário visualizar todas as tarefas atribuídas a ele, independentemente do quadro ao qual pertençam.

---

## Como Executar o Projeto (Localmente)

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Banco de dados configurado (ex: PostgreSQL)

---

### Instalação

Na raiz do projeto, execute:

```bash
npm install
```

Configuração das Variáveis de Ambiente

Altere o arquivo **.env.example** para **.env**

Defina as seguintes variáveis:
```bash
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

Gerando o banco com base no schema:
```bash
npx prisma db push
```

Iniciando o projeto:
```bash
npm run dev
```

A aplicação estará disponível em:
```bash
http://localhost:3000
```

### Melhorias Futuras
- Implementação de notificações entre usuários;
- Filtros avançados de tarefas e visualizações personalizadas;
- Melhorias de responsividade das interfaces web;
- Dashboard global com métricas de produtividade;
- Dockerização da aplicação para facilitar deploy;
- Gerenciamento de banco de dados com migrations do Prisma
  - Atualmente é usado `prisma db push` para desenvolvimento rápido;  
  - Futuras versões podem adotar `prisma migrate` para versionamento do schema, migrações seguras e histórico de alterações.
