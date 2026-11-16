/**
 * MenuCtrl — menu lateral (ion-side-menus) presente em todas as telas privadas.
 * Exibe os dados do aluno logado, destaca a seção atual e realiza o logout.
 */
(function () {
  'use strict';

  angular.module('ucsalApp').controller('MenuCtrl', MenuCtrl);

  MenuCtrl.$inject = ['$rootScope', '$state', '$ionicHistory', '$ionicPopup', 'AuthService'];

  function MenuCtrl($rootScope, $state, $ionicHistory, $ionicPopup, AuthService) {
    var menu = this;

    menu.secaoAtiva = secaoAtiva;
    menu.iniciais = iniciais;
    menu.sair = sair;

    /** true se o estado atual pertence à seção informada (definida em data.secaoMenu). */
    function secaoAtiva(secao) {
      var dados = $state.current && $state.current.data;
      return !!dados && dados.secaoMenu === secao;
    }

    /** "Ana Beatriz Souza Lima" → "AL" (avatar do menu). */
    function iniciais() {
      var aluno = $rootScope.alunoLogado;
      if (!aluno || !aluno.nome) {
        return '';
      }
      var partes = aluno.nome.trim().split(/\s+/);
      var primeira = partes[0].charAt(0);
      var ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : '';
      return (primeira + ultima).toUpperCase();
    }

    function sair() {
      $ionicPopup.confirm({
        title: 'Sair do Portal',
        template: 'Deseja realmente encerrar sua sessão?',
        cancelText: 'Cancelar',
        okText: 'Sair',
        okType: 'button-positive'
      }).then(function (confirmou) {
        if (!confirmou) {
          return;
        }
        AuthService.logout();
        // descarta as telas em cache para que outro aluno não veja dados antigos
        $ionicHistory.clearCache().then(function () {
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
          $state.go('login');
        });
      });
    }
  }
})();
