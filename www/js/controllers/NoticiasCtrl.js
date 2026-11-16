/**
 * NoticiasCtrl — mural de notícias e atividades (RF02, tela inicial).
 * Busca as publicações no NoticiasService e controla os filtros da view
 * (categoria e texto), aplicados com o filtro nativo `filter` no ng-repeat.
 */
(function () {
  'use strict';

  angular.module('ucsalApp').controller('NoticiasCtrl', NoticiasCtrl);

  NoticiasCtrl.$inject = ['$scope', '$state', 'AuthService', 'NoticiasService'];

  function NoticiasCtrl($scope, $state, AuthService, NoticiasService) {
    var vm = this;
    var aluno = AuthService.getAlunoLogado();

    vm.primeiroNome = aluno ? aluno.nome.split(' ')[0] : '';
    vm.publicacoes = [];
    vm.categorias = NoticiasService.listarCategorias();
    vm.filtro = { categoria: '', texto: '' };   // '' = todas as categorias
    vm.carregando = true;
    vm.erro = null;

    vm.selecionarCategoria = selecionarCategoria;
    vm.limparFiltros = limparFiltros;
    vm.abrirDetalhe = abrirDetalhe;
    vm.atualizar = atualizar;

    carregar();

    function carregar() {
      vm.erro = null;
      return NoticiasService.listar()
        .then(function (publicacoes) {
          vm.publicacoes = publicacoes;
        })
        .catch(function (erro) {
          vm.erro = (erro && erro.mensagem) || 'Não foi possível carregar o mural.';
        })
        .finally(function () {
          vm.carregando = false;
        });
    }

    /** Pull-to-refresh (ion-refresher). */
    function atualizar() {
      carregar().finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    function selecionarCategoria(categoria) {
      vm.filtro.categoria = categoria;
    }

    function limparFiltros() {
      vm.filtro.categoria = '';
      vm.filtro.texto = '';
    }

    /** Botão "Ler mais": abre a visualização completa da publicação. */
    function abrirDetalhe(publicacao) {
      $state.go('app.noticia', { id: publicacao.id });
    }
  }
})();
