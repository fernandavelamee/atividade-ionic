/**
 * StorageService — encapsula o acesso ao localStorage do navegador.
 *
 * Usado para manter a sessão e as alterações cadastrais ao recarregar a página
 * (persistência opcional prevista no escopo do MVP). Todas as chaves recebem um
 * prefixo para não colidir com outros apps servidos no mesmo domínio.
 */
(function () {
  'use strict';

  angular.module('ucsalApp').factory('StorageService', StorageService);

  StorageService.$inject = ['$window', 'APP_CONFIG'];

  function StorageService($window, APP_CONFIG) {
    var prefixo = APP_CONFIG.prefixoStorage;

    return {
      ler: ler,
      salvar: salvar,
      remover: remover
    };

    /** Lê e desserializa um valor; devolve `valorPadrao` se não existir ou falhar. */
    function ler(chave, valorPadrao) {
      try {
        var bruto = $window.localStorage.getItem(prefixo + chave);
        return bruto === null ? valorPadrao : JSON.parse(bruto);
      } catch (erro) {
        // localStorage indisponível (ex.: modo privado) ou conteúdo corrompido
        return valorPadrao;
      }
    }

    /** Serializa e grava um valor. Retorna `true` em caso de sucesso. */
    function salvar(chave, valor) {
      try {
        $window.localStorage.setItem(prefixo + chave, JSON.stringify(valor));
        return true;
      } catch (erro) {
        return false;
      }
    }

    function remover(chave) {
      try {
        $window.localStorage.removeItem(prefixo + chave);
      } catch (erro) {
        // nada a fazer: armazenamento indisponível
      }
    }
  }
})();
