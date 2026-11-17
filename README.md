# Portal do Aluno UCSal

Protótipo de aplicativo para alunos da UCSal, feito com **Ionic 1** e **AngularJS**.
Não usa banco de dados: todos os dados são fictícios e ficam nos Services do AngularJS.

## Como rodar

Precisa do [Node.js](https://nodejs.org) instalado e de internet.

```bash
npm install
npm start
```

Abra **http://localhost:8100** no navegador.

## Login de teste

- Matrícula: `20261001`
- Senha: `123456`

## Funcionalidades

- **Login:** valida matrícula e senha e bloqueia campos vazios.
- **Mural:** notícias e eventos em cards, com filtro e botão "Ler mais".
- **Meu Cadastro:** edita e-mail, telefone e endereço; matrícula e curso ficam bloqueados.
- **Financeiro:** mensalidades por semestre, com status Paga/A Pagar e cópia do código de barras.

## Estrutura

```
www/
├── index.html
├── css/style.css      # cores da UCSal
├── js/app.js          # módulo e rotas
├── js/controllers/    # lógica de cada tela
├── js/services/       # dados mockados
└── templates/         # telas em HTML
```

## Testes

```bash
npm test
```