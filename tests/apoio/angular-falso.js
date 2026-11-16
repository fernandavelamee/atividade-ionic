/**
 * Ambiente mínimo para testar os services do AngularJS no Node.js, sem navegador.
 *
 * Substitui o objeto global `angular` por uma versão simplificada que apenas
 * REGISTRA o que cada arquivo declara (factory, controller, constant...) e
 * oferece um injetor que resolve as dependências pelo `$inject` de cada função.
 * Serviços do próprio Angular ($q, $timeout, $window...) são simulados aqui.
 */
'use strict';

const path = require('node:path');

const registros = {};

const modulo = {};
['factory', 'service', 'controller', 'filter', 'directive'].forEach(function (tipo) {
  modulo[tipo] = function (nome, definicao) {
    registros[nome] = { tipo: tipo, definicao: definicao };
    return modulo;
  };
});
modulo.constant = function (nome, valor) {
  registros[nome] = { tipo: 'constant', valor: valor };
  return modulo;
};
modulo.config = function () { return modulo; };
modulo.run = function () { return modulo; };

global.angular = {
  module: function () { return modulo; },
  copy: function (valor) { return valor === undefined ? valor : structuredClone(valor); },
  extend: function (destino) {
    return Object.assign.apply(Object, [destino].concat([].slice.call(arguments, 1)));
  },
  noop: function () {}
};

/** localStorage em memória. */
function criarLocalStorage() {
  const dados = new Map();
  return {
    getItem: (chave) => (dados.has(chave) ? dados.get(chave) : null),
    setItem: (chave, valor) => dados.set(chave, String(valor)),
    removeItem: (chave) => dados.delete(chave),
    clear: () => dados.clear()
  };
}

/** Simulações dos serviços nativos do AngularJS usados pelos services do app. */
function servicosNativos(localStorage) {
  const $q = function (executor) { return new Promise(executor); };
  $q.when = (valor) => Promise.resolve(valor);
  $q.reject = (motivo) => Promise.reject(motivo);
  // como no AngularJS, aceita um array OU um objeto de promises
  $q.all = function (promessas) {
    if (Array.isArray(promessas)) {
      return Promise.all(promessas);
    }
    const chaves = Object.keys(promessas);
    return Promise.all(chaves.map((chave) => promessas[chave])).then(function (valores) {
      const resultado = {};
      chaves.forEach((chave, i) => { resultado[chave] = valores[i]; });
      return resultado;
    });
  };

  const $timeout = function (fn) {
    return new Promise((resolve) => setImmediate(() => resolve(fn ? fn() : undefined)));
  };
  $timeout.cancel = function () { return false; };

  return {
    $q: $q,
    $timeout: $timeout,
    $rootScope: {},
    $window: { localStorage: localStorage, navigator: {} },
    $document: [{}]
  };
}

/** Carrega os arquivos JavaScript do app (relativos a www/js). */
function carregarArquivos(arquivos) {
  arquivos.forEach(function (arquivo) {
    const caminho = path.join(__dirname, '..', '..', 'www', 'js', arquivo);
    delete require.cache[require.resolve(caminho)];
    require(caminho);
  });
}

/**
 * Cria um injetor novo (instâncias novas de todos os services).
 * Use `opcoes.localStorage` para simular dados já gravados no navegador.
 */
function criarInjetor(opcoes) {
  const localStorage = (opcoes && opcoes.localStorage) || criarLocalStorage();
  const instancias = servicosNativos(localStorage);

  function obter(nome) {
    if (Object.prototype.hasOwnProperty.call(instancias, nome)) {
      return instancias[nome];
    }
    const registro = registros[nome];
    if (!registro) {
      throw new Error('Dependência não registrada: ' + nome);
    }
    if (registro.tipo === 'constant') {
      instancias[nome] = registro.valor;
    } else {
      const dependencias = (registro.definicao.$inject || []).map(obter);
      instancias[nome] = registro.definicao.apply(null, dependencias);
    }
    return instancias[nome];
  }

  return { obter: obter, localStorage: localStorage, $rootScope: instancias.$rootScope };
}

module.exports = {
  registros: registros,
  carregarArquivos: carregarArquivos,
  criarInjetor: criarInjetor,
  criarLocalStorage: criarLocalStorage
};
