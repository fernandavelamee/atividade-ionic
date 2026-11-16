# Portal do Aluno UCSal — MVP Front-end

Protótipo funcional de um aplicativo multiplataforma de autoatendimento para estudantes da
Universidade Católica do Salvador (campi Pituaçu e Federação), desenvolvido com **Ionic 1** e
**AngularJS**.

> Escopo: apenas front-end. Não há banco de dados, API externa nem back-end — todos os dados
> (alunos, notícias, eventos e mensalidades) são **mockados** em arrays/objetos JavaScript dentro
> dos Services do AngularJS, com persistência opcional no `localStorage`. Todo o conteúdo é fictício.

| Item | Tecnologia |
|------|------------|
| Interface mobile | Ionic Framework 1.3 (cards, menu lateral, listas, popups, spinners) |
| Lógica da aplicação | AngularJS 1.5 (módulos, services, controllers, diretivas e filtros) |
| Navegação SPA | angular-ui-router (`$stateProvider` / `$urlRouterProvider`) |
| Testes | `node:test` (test runner nativo do Node.js) |

---

## Como executar

O Ionic 1 (que já inclui o AngularJS e o ui-router) é carregado via CDN, então é preciso estar
conectado à internet.

### Opção 1 — GitHub Codespaces (recomendado)

1. Abra o repositório no GitHub → **Code** → **Codespaces** → **Create codespace on main**.
2. O ambiente (`.devcontainer`) instala as dependências automaticamente.
3. No terminal, rode:
   ```bash
   npm start
   ```
4. Abra a porta **8100** na aba **Portas** (o Codespaces costuma abrir sozinho).

### Opção 2 — Ambiente local (Node.js 18+)

```bash
npm install
npm start
```

Acesse **http://localhost:8100**.

### Opção 3 — Ionic CLI (opcional)

O Ionic CLI 7 não suporta mais projetos Ionic 1. Para usar o `ionic serve`, instale o CLI 6:

```bash
npm install -g @ionic/cli@6.17.1
npm install --save-dev @ionic/v1-toolkit
ionic serve
```

---

## Contas de demonstração

| Matrícula | Senha | Situação | O que demonstrar |
|-----------|-------|----------|------------------|
| `20261001` | `123456` | Ativa | Ana Beatriz — 3 semestres (2025.2, 2026.1, 2026.2), parcelas pagas, vencidas e a vencer |
| `20261002` | `ucsal2026` | Ativa | Carlos Eduardo — 2 semestres, outro campus e outros valores |
| `20241003` | `123456` | Trancada | Login bloqueado com mensagem de matrícula trancada |

A tela de login tem um atalho **"Preencher"** com a primeira conta.

---

## Funcionalidades (backlog do produto)

**RF01 — Autenticação (login mockado)**
Matrícula e senha validadas contra a lista de credenciais do `AuthService`; campos vazios,
matrícula fora do formato (8 dígitos), senha errada e matrícula trancada geram mensagens de erro.
O aluno autenticado fica em memória (`AuthService` + `$rootScope.alunoLogado`) e a sessão é
restaurada ao recarregar a página (apenas a matrícula vai para o `localStorage`, nunca a senha).
Rotas privadas são protegidas por uma guarda em `$stateChangeStart`.

**RF02 — Mural de notícias e atividades (tela inicial)**
Cards (`.card`) com imagem ilustrativa, título, data, categoria (Notícia / Evento), local e botão
**"Ler mais"**, que abre a publicação completa. Inclui filtro por categoria, busca por texto,
ordenação por data e "puxe para atualizar" (`ion-refresher`).

**RF03 — Atualização cadastral**
Nome, matrícula, curso e campus aparecem bloqueados (`ng-disabled`). E-mail, telefone/WhatsApp e
endereço (CEP, rua, número, complemento, bairro, cidade e UF) são editados numa cópia dos dados,
validados e salvos no `AlunoService` (e no `localStorage`) ao clicar em **"Salvar Alterações"**,
com confirmação via `$ionicPopup`. O service normaliza os dados (ex.: `71987654321` →
`(71) 98765-4321`) e **ignora qualquer tentativa de alterar campos institucionais**.

**RF04 — Consulta financeira**
Seletor do semestre letivo (2025.2, 2026.1, 2026.2), resumo do semestre (total pago e a pagar),
lista de mensalidades com mês de referência, vencimento, valor em R$ e badge de status
(**Paga** em verde, **A Pagar** em laranja). Parcelas vencidas recebem um aviso. Parcelas A Pagar
mostram a linha digitável (fictícia) e o botão **"Copiar Código de Barras"**, com confirmação
visual da cópia.

Extras: menu lateral (`ion-side-menus`, fixo em telas grandes), logout com confirmação,
localização pt-BR para moeda e datas e layout responsivo.

---

## Onde o AngularJS é utilizado

| Recurso | Onde está |
|---------|-----------|
| Módulo principal `angular.module('ucsalApp', ['ionic'])` | `www/js/app.js` |
| Rotas com `$stateProvider` / `$urlRouterProvider` | `www/js/app.js` → `configurarRotas` |
| Services / factories com os mocks | `www/js/services/` (`AuthService`, `NoticiasService`, `AlunoService`, `FinanceiroService`) |
| Controllers (`controller as vm` + `$scope` para eventos) | `www/js/controllers/` |
| `ng-model` | login (matrícula/senha), cadastro (contato/endereço), financeiro (semestre) |
| `ng-repeat` | cards do mural, chips de categoria, parágrafos da notícia, mensalidades |
| `ng-click` | Entrar, filtros, Ler mais, Salvar Alterações, Desfazer, Copiar Código de Barras, Sair |
| `ng-if` / `ng-show` | mensagens de erro/sucesso, carregamento, lista vazia, botão de boleto só para A Pagar |
| `ng-class` | badge Paga × A Pagar, etiqueta Notícia × Evento, chip ativo, campo inválido, botão "copiado" |
| `ng-disabled` | Nome, **Matrícula** e **Curso** na tela de cadastro; botões durante o carregamento |
| `ng-options` / `ng-change` | seletor de semestre letivo |
| `ng-pattern` | validação de e-mail, telefone, CEP e UF (regras vindas do `AlunoService`) |
| Filtro `currency` | valores em R$ (financeiro) |
| Filtro `filter` | notícias por categoria e texto; mensalidades por semestre (view e `$filter` no controller) |
| Filtros `date` e `orderBy` | datas em pt-BR; mural por data e parcelas por número |

---

## Arquitetura

```
 View (templates/*.html)        Ionic: cards, listas, menu, popups
        │  data binding (ng-model, ng-repeat, ng-click...)
        ▼
 Controller (controllers/*.js)  estado da tela (vm), sem dados fixos
        │  chama métodos que retornam Promises
        ▼
 Service (services/*.js)        mocks + regras de negócio
        │
        ├── MockApi             simula a API: $q + $timeout, devolve CÓPIAS dos dados
        └── StorageService      persistência opcional no localStorage
```

Decisões principais:

- **Isolamento dos mocks:** nenhum array de dados fica no HTML ou nos controllers. Até as
  categorias do filtro, a conta de demonstração e as regras de validação vêm dos services.
- **API simulada:** os services respondem com Promises e uma pequena latência
  (`APP_CONFIG.latenciaSimuladaMs`), como faria o `$http`. Trocar o mock por uma API real exige
  mudar apenas os services.
- **Cópias defensivas:** o `MockApi` devolve `angular.copy` dos dados, então a tela edita uma cópia
  e só o service altera o "banco" em memória.
- **Regras no service, não só na view:** o bloqueio dos campos institucionais, a validação e a
  formatação dos contatos e o cálculo de parcelas vencidas ficam nos services.
- **Sessão segura entre usuários:** ao sair, o histórico e o cache de telas do Ionic são limpos e o
  estado `app` usa `cache: false`.

---

## Estrutura de diretórios

```
ucsal-app/
├── .devcontainer/devcontainer.json   # ambiente do GitHub Codespaces
├── ionic.config.json                 # tipo de projeto: ionic1
├── package.json                      # npm start / npm test
├── tests/
│   ├── apoio/angular-falso.js        # AngularJS simulado para testar os services no Node
│   └── services.test.js              # testes das regras de negócio
├── docs/ROTEIRO_VIDEO.md             # roteiro para o vídeo explicativo
└── www/
    ├── index.html
    ├── css/style.css                 # tema UCSal (variáveis CSS)
    ├── img/                          # logo e ilustrações dos cards (SVG)
    ├── js/
    │   ├── app.js                    # módulo, localização, configuração e rotas
    │   ├── controllers/
    │   │   ├── LoginCtrl.js
    │   │   ├── MenuCtrl.js
    │   │   ├── NoticiasCtrl.js
    │   │   ├── NoticiaDetalheCtrl.js
    │   │   ├── PerfilCtrl.js
    │   │   └── FinanceiroCtrl.js
    │   └── services/
    │       ├── AuthService.js        # credenciais mockadas e sessão do aluno
    │       ├── NoticiasService.js    # notícias e eventos mockados
    │       ├── AlunoService.js       # cadastro mockado e edição de contato
    │       ├── FinanceiroService.js  # mensalidades agrupadas por semestre
    │       ├── MockApi.js            # simulação de API assíncrona
    │       ├── StorageService.js     # acesso ao localStorage
    │       └── ClipboardService.js   # cópia da linha digitável
    └── templates/
        ├── login.html
        ├── menu.html
        ├── noticias.html
        ├── noticia-detalhe.html
        ├── perfil.html
        └── financeiro.html
```

---

## Identidade visual

As cores institucionais ficam em variáveis CSS em `www/css/style.css` e sobrescrevem as classes de
cor do Ionic (`bar-positive`, `button-positive`, `button-calm`, `spinner-positive`):

| Variável | Cor | Uso |
|----------|-----|-----|
| `--ucsal-azul-marinho` | `#0a2a5e` | barras, botões, títulos |
| `--ucsal-azul-claro` | `#2fa4e7` | destaques, avatar, etiqueta de evento |
| `--ucsal-branco` | `#ffffff` | fundos e textos sobre o azul |
| `--status-paga` | `#1e8e4e` | badge **Paga** |
| `--status-a-pagar` | `#f5a524` | badge **A Pagar** |

---

## Testes

```bash
npm test
```

São 16 testes das regras de negócio (login e sessão, mural, atualização cadastral com
persistência e resumo financeiro por semestre). Eles rodam no Node.js, sem navegador, usando uma
versão simplificada do AngularJS em `tests/apoio/angular-falso.js`.

---

## Versionamento

O histórico segue o padrão de **commits semânticos** (Conventional Commits): `feat`, `fix`,
`refactor`, `style`, `test`, `docs` e `chore`. Para ver a evolução do projeto:

```bash
git log --oneline
```

Para publicar no GitHub (crie antes um repositório vazio):

```bash
git remote add origin https://github.com/SEU-USUARIO/ucsal-portal-aluno.git
git push -u origin main
```

---

## Observações

- Os dados são fictícios, inclusive as linhas digitáveis, que não são boletos válidos.
- Para voltar aos dados originais do mock, apague as chaves `ucsal.portal.*` do `localStorage`
  (DevTools → Application → Local Storage) ou rode `localStorage.clear()` no console.
- A cópia do código de barras usa a Clipboard API em HTTPS/localhost. Se o navegador não permitir,
  o app mostra a linha digitável num popup para cópia manual.
