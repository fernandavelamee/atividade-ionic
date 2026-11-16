/**
 * PerfilCtrl — atualização cadastral do aluno (RF03).
 *
 * Nome, matrícula, curso e campus são exibidos bloqueados (ng-disabled).
 * E-mail, telefone e endereço são editados numa CÓPIA dos dados; só ao clicar
 * em "Salvar Alterações" o AlunoService atualiza o mock (e o localStorage).
 */
(function () {
  'use strict';

  angular.module('ucsalApp').controller('PerfilCtrl', PerfilCtrl);

  PerfilCtrl.$inject = ['$ionicPopup', 'AuthService', 'AlunoService'];

  function PerfilCtrl($ionicPopup, AuthService, AlunoService) {
    var vm = this;

    vm.aluno = null;          // dados como estão salvos no service
    vm.formulario = null;     // cópia editável ligada aos campos via ng-model
    vm.regras = AlunoService.regrasValidacao;
    vm.camposInstitucionaisBloqueados = true;
    vm.carregando = true;
    vm.salvando = false;
    vm.tentouSalvar = false;
    vm.erro = null;

    vm.salvar = salvar;
    vm.desfazer = desfazer;
    vm.mostrarErro = mostrarErro;

    carregar();

    function carregar() {
      var alunoLogado = AuthService.getAlunoLogado();
      if (!alunoLogado) {
        return;
      }

      AlunoService.carregarPerfil(alunoLogado.matricula)
        .then(aplicarDados)
        .catch(function (erro) {
          vm.erro = (erro && erro.mensagem) || 'Não foi possível carregar seus dados.';
        })
        .finally(function () {
          vm.carregando = false;
        });
    }

    function salvar(formulario) {
      vm.tentouSalvar = true;
      vm.erro = null;

      if (formulario.$invalid) {
        vm.erro = 'Revise os campos destacados antes de salvar.';
        return;
      }

      vm.salvando = true;

      var dadosContato = {
        email: vm.formulario.email,
        telefone: vm.formulario.telefone,
        endereco: angular.copy(vm.formulario.endereco)
      };

      AlunoService.atualizarContato(vm.aluno.matricula, dadosContato)
        .then(function (alunoAtualizado) {
          aplicarDados(alunoAtualizado);
          AuthService.atualizarAlunoLogado(alunoAtualizado);
          formulario.$setPristine();
          formulario.$setUntouched();
          vm.tentouSalvar = false;
          vm.salvando = false;

          $ionicPopup.alert({
            title: 'Cadastro atualizado!',
            template: 'Seus dados de contato foram salvos com sucesso.',
            okText: 'OK',
            okType: 'button-positive'
          });
        })
        .catch(function (erro) {
          vm.erro = (erro && erro.mensagem) || 'Não foi possível salvar as alterações.';
        })
        .finally(function () {
          vm.salvando = false;
        });
    }

    /** Descarta o que foi digitado e volta aos dados salvos. */
    function desfazer(formulario) {
      vm.formulario = angular.copy(vm.aluno);
      vm.erro = null;
      vm.tentouSalvar = false;
      formulario.$setPristine();
      formulario.$setUntouched();
    }

    /** Exibe a mensagem de erro do campo depois que o usuário interagiu com ele. */
    function mostrarErro(campo) {
      return !!campo && campo.$invalid && (campo.$touched || vm.tentouSalvar);
    }

    function aplicarDados(aluno) {
      vm.aluno = aluno;
      vm.formulario = angular.copy(aluno);
    }
  }
})();
