# OneG8 - Plataforma Bancária Moderna

Uma solução bancária moderna para uma gestão financeira simplificada e transações seguras.

## 🚀 Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Appwrite](https://appwrite.io/)
- [Plaid](https://plaid.com/)
- [Dwolla](https://www.dwolla.com/)

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Conta no Appwrite
- Conta no Plaid (sandbox)
- Conta no Dwolla (sandbox)

## 🔧 Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/bank-one-g8.git
cd bank-one-g8
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Copie o conteúdo de `.env.example` (se existir) ou adicione as seguintes variáveis:

```env
# Next
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT=
APPWRITE_DATABASE_ID=
APPWRITE_USER_COLLECTION_ID=
APPWRITE_BANK_COLLECTION_ID=
APPWRITE_TRANSACTION_COLLECTION_ID=
NEXT_APPWRITE_KEY=

# Plaid
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox
PLAID_PRODUCTS=auth,transactions,identity
PLAID_COUNTRY_CODES=US,CA

# Dwolla
DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox
```

## 🚀 Executando o Projeto

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

2. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📦 Build para Produção

1. Gere a build do projeto:
```bash
npm run build
# ou
yarn build
```

2. Inicie o servidor de produção:
```bash
npm start
# ou
yarn start
```

## 🌟 Funcionalidades

- 🔐 Autenticação segura de usuários
- 💳 Integração com múltiplos bancos
- 💸 Transferências bancárias
- 📊 Gestão de transações
- 📱 Interface responsiva e moderna
- 🔄 Atualização em tempo real de saldo e transações

## 📄 Estrutura do Projeto

```
bank-one-g8/
├── app/                    # Rotas e páginas da aplicação
├── components/            # Componentes React reutilizáveis
├── lib/                   # Funções utilitárias e ações
├── public/               # Arquivos estáticos
└── types/                # Definições de tipos TypeScript
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Erick Martins

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no repositório. 