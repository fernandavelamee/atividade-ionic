
(function () {
  'use strict';

  angular.module('ucsalApp').factory('ClipboardService', ClipboardService);

  ClipboardService.$inject = ['$q', '$window', '$document'];

  function ClipboardService($q, $window, $document) {
    return {
      copiar: copiar
    };

    function copiar(texto) {
      var clipboard = $window.navigator && $window.navigator.clipboard;

      if (clipboard && $window.isSecureContext) {
        return $q.when(clipboard.writeText(texto)).catch(function () {
          return copiarComTextarea(texto);
        });
      }
      return copiarComTextarea(texto);
    }

    function copiarComTextarea(texto) {
      return $q(function (resolve, reject) {
        var documento = $document[0];
        var campo = documento.createElement('textarea');

        campo.value = texto;
        campo.setAttribute('readonly', '');
        campo.style.position = 'fixed';
        campo.style.top = '-1000px';
        campo.style.opacity = '0';
        documento.body.appendChild(campo);
        campo.select();
        campo.setSelectionRange(0, texto.length); // necessário no iOS

        var copiou = false;
        try {
          copiou = documento.execCommand('copy');
        } catch (erro) {
          copiou = false;
        }
        documento.body.removeChild(campo);

        if (copiou) {
          resolve();
        } else {
          reject(new Error('Cópia não suportada neste navegador.'));
        }
      });
    }
  }
})();
