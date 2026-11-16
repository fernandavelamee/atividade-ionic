# Roteiro do vídeo explicativo (6 a 8 minutos)

Sugestão de sequência para o vídeo: primeiro o app funcionando, depois o código.
Antes de gravar, limpe o `localStorage` (DevTools → Application → Local Storage) para começar com
os dados originais. Deixe o DevTools no modo dispositivo móvel (ícone de celular, ex.: iPhone 12).

---

## 1. Abertura (≈ 30 s)

**Tela:** app aberto na tela de login.

- Apresente-se e diga o objetivo: MVP front-end do Portal do Aluno UCSal.
- Stack: Ionic 1 para os componentes mobile e AngularJS como "cérebro" da aplicação.
- Escopo: sem banco de dados nem back-end; os dados são mockados nos Services do AngularJS.

## 2. Demonstração do app (≈ 3 min)

### RF01 — Login
1. Clique em **Entrar** com os campos vazios → mensagem de erro e campos destacados em vermelho.
2. Digite `20261001` e uma senha errada → "Matrícula ou senha inválidas".
3. (Opcional) `20241003` / `123456` → matrícula trancada.
4. Clique em **Preencher** e depois em **Entrar** → spinner "Autenticando..." e redirecionamento.

### RF02 — Mural
1. Mostre a saudação com o nome do aluno e os cards (imagem, categoria, data, título).
2. Clique nos filtros **Notícias** / **Eventos** e digite algo na busca (ex.: "Semoc").
3. Clique em **Ler mais** → tela de detalhe com data por extenso, local e texto completo → **Voltar**.

### RF03 — Meu Cadastro
1. Abra o menu lateral → **Meu Cadastro**. Mostre Nome, Matrícula e Curso bloqueados.
2. Apague o e-mail e clique fora do campo → mensagem de erro sob o campo; clique em
   **Salvar Alterações** → aviso para revisar os campos. Clique em **Desfazer alterações**.
3. Altere o telefone para `71988887777` e clique em **Salvar Alterações** → popup de confirmação;
   o telefone volta formatado: `(71) 98888-7777`.
4. Recarregue a página (F5) → o login continua e o telefone alterado também (localStorage).

### RF04 — Financeiro
1. Abra **Financeiro**: semestre 2026.2 selecionado, resumo pago × a pagar.
2. Mostre os badges **Paga** (verde) e **A Pagar** (laranja) e o aviso de parcela vencida.
3. Clique em **Copiar Código de Barras** → confirmação "Código de barras copiado!" e o botão fica
   verde. Cole num bloco de notas para provar a cópia.
4. Troque para **2025.2** (tudo pago) e **2026.1** (uma parcela em aberto).

### Sair
Menu → **Sair** → confirmação → volta para o login.

## 3. Explicação do código (≈ 3 min)

### `www/js/app.js` — módulo e rotas
- `angular.module('ucsalApp', ['ionic'])`.
- `configurarRotas`: estado `login`, estado abstrato `app` (menu lateral) e as telas filhas
  `app.noticias`, `app.noticia`, `app.perfil` e `app.financeiro`, cada uma ligando
  `templateUrl` ao `controller`.
- `$urlRouterProvider.otherwise('/login')` e a guarda de rotas em `$stateChangeStart`.
- (Rápido) o decorator do `$locale`, que faz o `currency` mostrar "R$ 1.219,90".

### `www/js/services/` — dados mockados
- Abra o `FinanceiroService.js`: objeto organizado por **aluno → semestre → parcelas**.
- Mostre que os services retornam Promises por meio do `MockApi` (simulando uma API) e devolvem
  cópias dos dados.
- No `AlunoService.js`, mostre `atualizarContato`: só e-mail, telefone e endereço são alterados.
  Mesmo que alguém habilite o campo na view, matrícula e curso não mudam.
- Destaque o requisito não funcional: **nenhum array de dados fixo no HTML ou nos controllers**.

### `www/js/controllers/` — ligação com a view
- `LoginCtrl.js`: `vm.credenciais` (ng-model), `vm.entrar()` (ng-click), `vm.erro` (ng-if).
- `FinanceiroCtrl.js`: carrega semestres e mensalidades, `aoTrocarSemestre()` no `ng-change` e
  `$filter('filter')` para o resumo.

### `www/templates/` — diretivas e filtros
- `financeiro.html`: `ng-options`, `ng-repeat` com `filter:{ semestre: ... }:true`,
  `ng-class` do badge, `ng-if` do botão de boleto e `currency`.
- `perfil.html`: `ng-disabled` em Nome/Matrícula/Curso e `ng-pattern` com as regras do service.
- `noticias.html`: `ng-repeat` dos cards com `filter` por categoria e `orderBy:'-data'`.

### `www/css/style.css` — identidade visual
- Variáveis `--ucsal-azul-marinho`, `--ucsal-azul-claro` e `--ucsal-branco` sobrescrevendo
  `bar-positive` e `button-positive` do Ionic.

## 4. Qualidade e versionamento (≈ 45 s)

- Rode `npm test` no terminal → 16 testes passando.
- Rode `git log --oneline` → commits semânticos e progressivos (`chore`, `style`, `feat`, `fix`,
  `refactor`, `test`, `docs`).

## 5. Encerramento (≈ 15 s)

- Resuma: os 4 requisitos funcionais atendidos, mocks isolados nos services e rotas com ui-router.
- Próximo passo natural: trocar o `MockApi` por chamadas `$http` a uma API real.

---

### Checklist antes de enviar
- [ ] Vídeo mostra os 4 módulos funcionando (login, mural, cadastro, financeiro)
- [ ] Mostra pelo menos um trecho de: rotas, um service, um controller e um template
- [ ] Mostra as diretivas pedidas: ng-model, ng-repeat, ng-click, ng-if/ng-show/ng-class, ng-disabled
- [ ] Mostra os filtros currency e filter
- [ ] Link do repositório no GitHub enviado junto com o vídeo
