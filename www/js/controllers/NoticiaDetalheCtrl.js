/**
 * NoticiaDetalheCtrl — visualização completa de uma publicação ("Ler mais").
 * O id chega pela URL (#/app/noticias/:id) via $stateParams.
 */
(function () {
  'use strict';

  angular.module('ucsalApp').controller('NoticiaDetalheCtrl', NoticiaDetalheCtrl);

  NoticiaDetalheCtrl.$inject = ['$state', '$stateParams', '$ionicHistory', 'NoticiasService'];

  function NoticiaDetalheCtrl($state, $stateParams, $ionicHistory, NoticiasService) {
    var vm = this;

    vm.publicacao = null;
    vm.carregando = true;
    vm.voltar = voltar;

    NoticiasService.buscarPorId($stateParams.id)
      .then(function (publicacao) {
        vm.publicacao = publicacao;
      })
      .catch(function () {
        vm.publicacao = null;
      })
      .finally(function () {
        vm.carregando = false;
      });

    /** Volta pelo histórico; se a página foi aberta direto pela URL, vai para o mural. */
    function voltar() {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        $state.go('app.noticias');
      }
    }
  }
})();
