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
    $urlRouterProvider.otherwise('/login');
  }

  /* ---------------------------------------------------------------------------
   * Inicialização: plugins nativos (quando rodando via Cordova).
   * ------------------------------------------------------------------------- */
  inicializarAplicacao.$inject = ['$ionicPlatform', '$window'];

  function inicializarAplicacao($ionicPlatform, $window) {
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
