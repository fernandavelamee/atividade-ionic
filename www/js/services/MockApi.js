/**
 * MockApi — simula o comportamento assíncrono de uma API HTTP.
 *
 * Os services de dados (AuthService, NoticiasService, AlunoService e
 * FinanceiroService) não acessam servidor algum: os dados ficam em
 * arrays/objetos dentro deles. Para que os controllers sejam escritos como se
 * existisse um back-end real, toda resposta passa por aqui e é devolvida como
 * Promise ($q), com uma pequena latência artificial e sempre como CÓPIA
 * (angular.copy) — assim nenhuma view altera o mock por acidente.
 *
 * Quando houver uma API de verdade, basta trocar estas chamadas por $http.
 */
(function () {
  'use strict';

  angular.module('ucsalApp').factory('MockApi', MockApi);

  MockApi.$inject = ['$q', '$timeout', 'APP_CONFIG'];

  function MockApi($q, $timeout, APP_CONFIG) {
    var latencia = APP_CONFIG.latenciaSimuladaMs;

    return {
      responder: responder,
      falhar: falhar
    };

    /** Resolve a promise com uma cópia dos dados após a latência simulada. */
    function responder(dados) {
      return $timeout(function () {
        return angular.copy(dados);
      }, latencia);
    }

    /** Rejeita a promise com um erro padronizado: { mensagem, ...detalhes }. */
    function falhar(mensagem, detalhes) {
      return $timeout(angular.noop, latencia).then(function () {
        return $q.reject(angular.extend({ mensagem: mensagem }, detalhes));
      });
    }
  }
})();
