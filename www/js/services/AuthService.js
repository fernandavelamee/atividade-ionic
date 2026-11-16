/**
 * AuthService — autenticação mockada e sessão do aluno (RF01).
 *
 * - Valida matrícula e senha contra a lista de credenciais mockadas abaixo;
 * - guarda o aluno logado em memória (no service e em $rootScope.alunoLogado);
 * - mantém apenas a matrícula no localStorage para restaurar a sessão ao
 *   recarregar a página (a senha nunca é gravada).
 */
(function () {
  'use strict';

  angular.module('ucsalApp').factory('AuthService', AuthService);

  AuthService.$inject = ['$rootScope', 'MockApi', 'StorageService', 'AlunoService'];

  function AuthService($rootScope, MockApi, StorageService, AlunoService) {
    var CHAVE_SESSAO = 'sessao';

    /* ------------------------------------------------------------------------
     * MOCK — credenciais de acesso dos alunos (dados fictícios).
     * ---------------------------------------------------------------------- */
    var credenciais = [
      { matricula: '20261001', senha: '123456', situacao: 'ATIVA' },
      { matricula: '20261002', senha: 'ucsal2026', situacao: 'ATIVA' },
      { matricula: '20241003', senha: '123456', situacao: 'TRANCADA' }
    ];

    var sessao = { aluno: null, iniciadaEm: null };

    return {
      login: login,
      logout: logout,
      restaurarSessao: restaurarSessao,
      estaAutenticado: estaAutenticado,
      getAlunoLogado: getAlunoLogado,
      atualizarAlunoLogado: atualizarAlunoLogado,
      contaDemonstracao: contaDemonstracao
    };

    /* ======================== API pública ======================== */

    /**
     * Autentica o aluno. Resolve com os dados do aluno ou rejeita com { mensagem }.
     */
    function login(matricula, senha) {
      var matriculaInformada = String(matricula || '').trim();
      var senhaInformada = String(senha || '');

      if (!matriculaInformada || !senhaInformada) {
        return MockApi.falhar('Preencha a matrícula e a senha para continuar.');
      }
      if (!/^\d{8}$/.test(matriculaInformada)) {
        return MockApi.falhar('A matrícula deve conter 8 dígitos numéricos.');
      }

      var registro = credenciais.filter(function (credencial) {
        return credencial.matricula === matriculaInformada && credencial.senha === senhaInformada;
      })[0];

      if (!registro) {
        return MockApi.falhar('Matrícula ou senha inválidas.');
      }
      if (registro.situacao !== 'ATIVA') {
        return MockApi.falhar('Sua matrícula está trancada. Procure a Secretaria Acadêmica.');
      }

      var aluno = AlunoService.obterPorMatricula(registro.matricula);
      if (!aluno) {
        return MockApi.falhar('Cadastro do aluno não encontrado.');
      }

      return MockApi.responder(aluno).then(function (alunoAutenticado) {
        iniciarSessao(alunoAutenticado);
        return alunoAutenticado;
      });
    }

    function logout() {
      sessao.aluno = null;
      sessao.iniciadaEm = null;
      delete $rootScope.alunoLogado;
      StorageService.remover(CHAVE_SESSAO);
    }

    /** Chamado na inicialização do app: recupera a sessão salva, se houver. */
    function restaurarSessao() {
      var salva = StorageService.ler(CHAVE_SESSAO, null);
      if (!salva || !salva.matricula) {
        return false;
      }
      var aluno = AlunoService.obterPorMatricula(salva.matricula);
      if (!aluno) {
        logout();
        return false;
      }
      definirAluno(aluno);
      sessao.iniciadaEm = salva.iniciadaEm || null;
      return true;
    }

    function estaAutenticado() {
      return !!sessao.aluno;
    }

    /** Devolve uma cópia do aluno logado (ou null). */
    function getAlunoLogado() {
      return sessao.aluno ? angular.copy(sessao.aluno) : null;
    }

    /** Sincroniza a sessão após uma atualização cadastral. */
    function atualizarAlunoLogado(aluno) {
      if (sessao.aluno && aluno && aluno.matricula === sessao.aluno.matricula) {
        definirAluno(angular.copy(aluno));
      }
    }

    /** Conta exibida na tela de login para facilitar a demonstração do MVP. */
    function contaDemonstracao() {
      var conta = credenciais.filter(function (credencial) {
        return credencial.situacao === 'ATIVA';
      })[0];
      return { matricula: conta.matricula, senha: conta.senha };
    }

    /* ======================== Funções internas ======================== */

    function iniciarSessao(aluno) {
      definirAluno(aluno);
      sessao.iniciadaEm = new Date().toISOString();
      StorageService.salvar(CHAVE_SESSAO, {
        matricula: aluno.matricula,
        iniciadaEm: sessao.iniciadaEm
      });
    }

    function definirAluno(aluno) {
      sessao.aluno = aluno;
      $rootScope.alunoLogado = aluno; // acessível nos templates como $root.alunoLogado
    }
  }
})();
