/**
 * Portal do Aluno UCSal — módulo principal da aplicação (AngularJS + Ionic 1).
 *
 * Responsabilidades deste arquivo:
 *  - criar o módulo `ucsalApp`, que depende do Ionic;
 *  - registrar as constantes de configuração do app;
 *  - configurar a localização pt-BR (moeda e datas) e o comportamento do Ionic;
 *  - configurar a navegação SPA com $stateProvider / $urlRouterProvider (ui-router).
 */
(function () {
  'use strict';

  angular
    .module('ucsalApp', ['ionic'])
    .constant('APP_CONFIG', {
      nome: 'Portal do Aluno UCSal',
      versao: '1.0.0',
      latenciaSimuladaMs: 400,        // atraso artificial das "requisições" aos mocks
      prefixoStorage: 'ucsal.portal.' // prefixo das chaves gravadas no localStorage
    })
    .config(configurarLocalizacao)
    .config(configurarIonic)
    .config(configurarRotas)
    .run(inicializarAplicacao);

  /* ---------------------------------------------------------------------------
   * Localização pt-BR: o filtro nativo `currency` passa a exibir "R$ 1.219,90"
   * e o filtro `date` passa a usar nomes de meses e dias em português.
   * ------------------------------------------------------------------------- */
  configurarLocalizacao.$inject = ['$provide'];

  function configurarLocalizacao($provide) {
    $provide.decorator('$locale', ['$delegate', function ($delegate) {
      var numeros = $delegate.NUMBER_FORMATS;
      numeros.DECIMAL_SEP = ',';
      numeros.GROUP_SEP = '.';
      numeros.CURRENCY_SYM = 'R$';
      numeros.PATTERNS[1].posPre = '¤ ';   // "¤ " → "R$ "
      numeros.PATTERNS[1].negPre = '-¤ ';

      var datas = $delegate.DATETIME_FORMATS;
      datas.MONTH = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
        'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      datas.SHORTMONTH = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      datas.DAY = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
      datas.SHORTDAY = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

      $delegate.id = 'pt-br';
      return $delegate;
    }]);
  }

  /* ---------------------------------------------------------------------------
   * Ajustes visuais e de comportamento do Ionic.
   * ------------------------------------------------------------------------- */
  configurarIonic.$inject = ['$ionicConfigProvider'];

  function configurarIonic($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('Voltar');
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.scrolling.jsScrolling(false); // rolagem nativa (melhor no navegador)
  }

  /* ---------------------------------------------------------------------------
   * Rotas da SPA (ui-router). Cada estado liga um template HTML ao seu controller.
   * ------------------------------------------------------------------------- */
  configurarRotas.$inject = ['$stateProvider', '$urlRouterProvider'];

  function configurarRotas($stateProvider, $urlRouterProvider) {
    $stateProvider
      // Tela pública de autenticação (RF01)
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm',
        data: { publica: true }
      })

      // Estado abstrato com o menu lateral; as telas privadas são filhas dele.
      // cache: false → ao sair, o menu e as telas filhas são destruídos, e o próximo
      // aluno a entrar nunca vê dados da sessão anterior.
      .state('app', {
        url: '/app',
        abstract: true,
        cache: false,
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl',
        controllerAs: 'menu'
      })

      // Mural de notícias e atividades — tela inicial (RF02)
      .state('app.noticias', {
        url: '/noticias',
        data: { secaoMenu: 'mural' },
        views: {
          menuContent: {
            templateUrl: 'templates/noticias.html',
            controller: 'NoticiasCtrl',
            controllerAs: 'vm'
          }
        }
      })

      // Visualização completa de uma publicação ("Ler mais")
      .state('app.noticia', {
        url: '/noticias/:id',
        data: { secaoMenu: 'mural' },
        views: {
          menuContent: {
            templateUrl: 'templates/noticia-detalhe.html',
            controller: 'NoticiaDetalheCtrl',
            controllerAs: 'vm'
          }
        }
      })

      // Atualização cadastral (RF03)
      .state('app.perfil', {
        url: '/perfil',
        data: { secaoMenu: 'perfil' },
        views: {
          menuContent: {
            templateUrl: 'templates/perfil.html',
            controller: 'PerfilCtrl',
            controllerAs: 'vm'
          }
        }
      })

      // Consulta financeira — mensalidades por semestre (RF04)
      .state('app.financeiro', {
        url: '/financeiro',
        data: { secaoMenu: 'financeiro' },
        views: {
          menuContent: {
            templateUrl: 'templates/financeiro.html',
            controller: 'FinanceiroCtrl',
            controllerAs: 'vm'
          }
        }
      });

    $urlRouterProvider.otherwise('/login');
  }

  /* ---------------------------------------------------------------------------
   * Inicialização: restaura a sessão, protege as rotas privadas e prepara
   * os plugins nativos (quando o app roda via Cordova).
   * ------------------------------------------------------------------------- */
  inicializarAplicacao.$inject = ['$rootScope', '$state', '$ionicPlatform', '$window', 'AuthService'];

  function inicializarAplicacao($rootScope, $state, $ionicPlatform, $window, AuthService) {
    AuthService.restaurarSessao();

    // Guarda de rotas: estados sem `data.publica` exigem aluno autenticado
    $rootScope.$on('$stateChangeStart', function (evento, destino) {
      var rotaPublica = !!(destino.data && destino.data.publica);

      if (!rotaPublica && !AuthService.estaAutenticado()) {
        evento.preventDefault();
        $state.go('login');
      } else if (destino.name === 'login' && AuthService.estaAutenticado()) {
        evento.preventDefault();
        $state.go('app.noticias');
      }
    });

    $ionicPlatform.ready(function () {
      var plugins = $window.cordova && $window.cordova.plugins;
      if (plugins && plugins.Keyboard) {
        plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if ($window.StatusBar) {
        $window.StatusBar.styleLightContent();
      }
    });
  }
})();
