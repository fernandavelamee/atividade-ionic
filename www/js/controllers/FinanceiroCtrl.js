/**
 * FinanceiroCtrl — consulta de mensalidades por semestre letivo (RF04).
 *
 * O aluno escolhe o semestre num <select> (ng-model + ng-options); a lista é
 * filtrada na view com o filtro nativo `filter` e o resumo é recalculado aqui.
 * Parcelas "A Pagar" permitem copiar a linha digitável do boleto (fictício).
 */
(function () {
  'use strict';

  angular.module('ucsalApp').controller('FinanceiroCtrl', FinanceiroCtrl);

  FinanceiroCtrl.$inject = ['$q', '$filter', '$timeout', '$ionicLoading', '$ionicPopup',
    'AuthService', 'FinanceiroService', 'ClipboardService'];

  function FinanceiroCtrl($q, $filter, $timeout, $ionicLoading, $ionicPopup,
                          AuthService, FinanceiroService, ClipboardService) {
    var vm = this;
    var temporizadorCopia = null;

    vm.semestres = [];
    vm.semestreSelecionado = null;
    vm.mensalidades = [];
    vm.resumo = FinanceiroService.calcularResumo([]);
    vm.copiadoId = null;
    vm.carregando = true;
    vm.erro = null;

    vm.aoTrocarSemestre = atualizarResumo;
    vm.copiarCodigo = copiarCodigo;

    carregar();

    function carregar() {
      var aluno = AuthService.getAlunoLogado();
      if (!aluno) {
        return;
      }

      $q.all({
        semestres: FinanceiroService.listarSemestres(aluno.matricula),
        mensalidades: FinanceiroService.listarMensalidades(aluno.matricula)
      })
        .then(function (resposta) {
          vm.semestres = resposta.semestres;
          vm.mensalidades = resposta.mensalidades;
          vm.semestreSelecionado = vm.semestres[0] || null; // semestre mais recente
          atualizarResumo();
        })
        .catch(function (erro) {
          vm.erro = (erro && erro.mensagem) || 'Não foi possível carregar suas mensalidades.';
        })
        .finally(function () {
          vm.carregando = false;
        });
    }

    /** Recalcula os totais do semestre selecionado (chamado no ng-change do select). */
    function atualizarResumo() {
      var doSemestre = $filter('filter')(vm.mensalidades, { semestre: vm.semestreSelecionado }, true);
      vm.resumo = FinanceiroService.calcularResumo(doSemestre);
      vm.copiadoId = null;
    }

    /** Botão "Copiar Código de Barras" das parcelas A Pagar. */
    function copiarCodigo(parcela) {
      ClipboardService.copiar(parcela.linhaDigitavel)
        .then(function () {
          vm.copiadoId = parcela.id;
          $ionicLoading.show({
            template: '<i class="icon ion-checkmark-circled"></i> Código de barras copiado!',
            noBackdrop: true,
            duration: 1800
          });

          // o botão volta ao estado normal depois de alguns segundos
          $timeout.cancel(temporizadorCopia);
          temporizadorCopia = $timeout(function () {
            vm.copiadoId = null;
          }, 4000);
        })
        .catch(function () {
          // navegador sem permissão de cópia: mostra a linha para cópia manual
          $ionicPopup.alert({
            title: 'Copie a linha digitável',
            template: '<p class="linha-digitavel">' + parcela.linhaDigitavel + '</p>',
            okText: 'Fechar',
            okType: 'button-positive'
          });
        });
    }
  }
})();
