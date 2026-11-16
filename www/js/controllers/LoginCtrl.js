/**
 * LoginCtrl — tela de autenticação (RF01).
 * Captura matrícula e senha (ng-model), impede envio de campos vazios e, após o
 * login, redireciona para o mural sem permitir "voltar" para o login.
 */
(function () {
  'use strict';

  angular.module('ucsalApp').controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope', '$state', '$ionicHistory', '$ionicLoading', 'AuthService'];

  function LoginCtrl($scope, $state, $ionicHistory, $ionicLoading, AuthService) {
    var vm = this;

    vm.credenciais = {};
    vm.erro = null;
    vm.carregando = false;
    vm.tentouEnviar = false;
    vm.contaDemo = AuthService.contaDemonstracao();

    vm.entrar = entrar;
    vm.campoVazio = campoVazio;
    vm.usarContaDemo = usarContaDemo;

    limparFormulario();

    // A view de login fica em cache: limpa o formulário sempre que ela reaparece (ex.: após sair)
    $scope.$on('$ionicView.beforeEnter', limparFormulario);

    function entrar() {
      vm.tentouEnviar = true;
      vm.erro = null;

      if (campoVazio('matricula') || campoVazio('senha')) {
        vm.erro = 'Preencha a matrícula e a senha para continuar.';
        return;
      }

      vm.carregando = true;
      $ionicLoading.show({ template: '<ion-spinner icon="crescent" class="spinner-light"></ion-spinner><p>Autenticando...</p>' });

      AuthService.login(vm.credenciais.matricula, vm.credenciais.senha)
        .then(function () {
          $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
          $state.go('app.noticias');
        })
        .catch(function (erro) {
          vm.erro = (erro && erro.mensagem) || 'Não foi possível entrar. Tente novamente.';
          vm.credenciais.senha = '';
        })
        .finally(function () {
          vm.carregando = false;
          $ionicLoading.hide();
        });
    }

    function campoVazio(campo) {
      return !String(vm.credenciais[campo] || '').trim();
    }

    function usarContaDemo() {
      vm.credenciais.matricula = vm.contaDemo.matricula;
      vm.credenciais.senha = vm.contaDemo.senha;
      vm.erro = null;
    }

    function limparFormulario() {
      vm.credenciais = { matricula: '', senha: '' };
      vm.erro = null;
      vm.tentouEnviar = false;
    }
  }
})();
