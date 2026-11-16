/**
 * AlunoService — dados cadastrais mockados dos alunos e métodos de edição.
 *
 * Simula a camada de acesso a dados do cadastro acadêmico:
 *  - carregarPerfil(matricula)            → GET   /alunos/:matricula
 *  - atualizarContato(matricula, dados)   → PATCH /alunos/:matricula/contato
 *
 * As alterações de contato ficam em memória e também no localStorage, para não
 * se perderem ao atualizar a página.
 */
(function () {
  'use strict';

  angular.module('ucsalApp').factory('AlunoService', AlunoService);

  AlunoService.$inject = ['MockApi', 'StorageService'];

  function AlunoService(MockApi, StorageService) {
    var CHAVE_ALTERACOES = 'alunos.contatos';

    /* ------------------------------------------------------------------------
     * MOCK — cadastro dos alunos (dados fictícios).
     * Nome, matrícula, curso, campus e turno são institucionais (somente leitura).
     * E-mail, telefone e endereço podem ser atualizados pelo próprio aluno.
     * ---------------------------------------------------------------------- */
    var alunos = [
      {
        matricula: '20261001',
        nome: 'Ana Beatriz Souza Lima',
        curso: 'Engenharia de Software',
        campus: 'Pituaçu',
        turno: 'Noturno',
        email: 'ana.lima@example.com',
        telefone: '(71) 98765-4321',
        endereco: {
          cep: '41720-000',
          rua: 'Rua das Gaivotas',
          numero: '215',
          complemento: 'Apto 302',
          bairro: 'Imbuí',
          cidade: 'Salvador',
          uf: 'BA'
        },
        atualizadoEm: null
      },
      {
        matricula: '20261002',
        nome: 'Carlos Eduardo Menezes',
        curso: 'Engenharia de Software',
        campus: 'Federação',
        turno: 'Matutino',
        email: 'carlos.menezes@example.com',
        telefone: '(71) 99123-4567',
        endereco: {
          cep: '40210-340',
          rua: 'Rua dos Coqueiros',
          numero: '48',
          complemento: '',
          bairro: 'Federação',
          cidade: 'Salvador',
          uf: 'BA'
        },
        atualizadoEm: null
      }
    ];

    /**
     * Regras de validação dos campos editáveis. São expostas para a view
     * (ng-pattern) e reutilizadas aqui no service: uma única fonte de verdade.
     */
    var regrasValidacao = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      telefone: /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/,
      cep: /^\d{5}-?\d{3}$/,
      uf: /^[A-Za-z]{2}$/
    };

    aplicarAlteracoesSalvas();

    return {
      regrasValidacao: regrasValidacao,
      obterPorMatricula: obterPorMatricula,
      carregarPerfil: carregarPerfil,
      atualizarContato: atualizarContato
    };

    /* ======================== API pública ======================== */

    /** Cópia síncrona do aluno (uso interno do AuthService). Retorna null se não existir. */
    function obterPorMatricula(matricula) {
      var aluno = encontrar(matricula);
      return aluno ? angular.copy(aluno) : null;
    }

    /** Carrega o perfil completo do aluno. */
    function carregarPerfil(matricula) {
      var aluno = encontrar(matricula);
      return aluno ? MockApi.responder(aluno) : MockApi.falhar('Aluno não encontrado.');
    }

    /**
     * Atualiza SOMENTE os dados de contato do aluno.
     * Regra de negócio: nome, matrícula, curso e campus são ignorados mesmo que
     * venham no objeto — o bloqueio não depende apenas do ng-disabled da view.
     */
    function atualizarContato(matricula, dados) {
      var aluno = encontrar(matricula);
      if (!aluno) {
        return MockApi.falhar('Aluno não encontrado.');
      }

      var validacao = validarContato(dados || {});
      if (validacao.erros.length) {
        return MockApi.falhar(validacao.erros[0], { erros: validacao.erros });
      }

      aluno.email = validacao.contato.email;
      aluno.telefone = validacao.contato.telefone;
      aluno.endereco = validacao.contato.endereco;
      aluno.atualizadoEm = new Date().toISOString();

      persistirAlteracoes(aluno);
      return MockApi.responder(aluno);
    }

    /* ======================== Funções internas ======================== */

    function encontrar(matricula) {
      return alunos.filter(function (aluno) {
        return aluno.matricula === String(matricula);
      })[0] || null;
    }

    /** Normaliza (formata) e valida os dados de contato recebidos da view. */
    function validarContato(dados) {
      var endereco = dados.endereco || {};
      var contato = {
        email: texto(dados.email).toLowerCase(),
        telefone: formatarTelefone(texto(dados.telefone)),
        endereco: {
          cep: formatarCep(texto(endereco.cep)),
          rua: texto(endereco.rua),
          numero: texto(endereco.numero),
          complemento: texto(endereco.complemento),
          bairro: texto(endereco.bairro),
          cidade: texto(endereco.cidade),
          uf: texto(endereco.uf).toUpperCase()
        }
      };

      var erros = [];
      if (!regrasValidacao.email.test(contato.email)) {
        erros.push('Informe um e-mail válido.');
      }
      if (!regrasValidacao.telefone.test(contato.telefone)) {
        erros.push('Informe um telefone com DDD, ex.: (71) 98765-4321.');
      }
      if (!regrasValidacao.cep.test(contato.endereco.cep)) {
        erros.push('Informe um CEP válido, ex.: 41720-000.');
      }
      if (!contato.endereco.rua) { erros.push('Informe a rua.'); }
      if (!contato.endereco.numero) { erros.push('Informe o número (ou "S/N").'); }
      if (!contato.endereco.bairro) { erros.push('Informe o bairro.'); }
      if (!contato.endereco.cidade) { erros.push('Informe a cidade.'); }
      if (!regrasValidacao.uf.test(contato.endereco.uf)) {
        erros.push('Informe a UF com 2 letras, ex.: BA.');
      }

      return { contato: contato, erros: erros };
    }

    function texto(valor) {
      return valor === undefined || valor === null ? '' : String(valor).trim();
    }

    /** "71987654321" → "(71) 98765-4321"; "7133334444" → "(71) 3333-4444". */
    function formatarTelefone(valor) {
      var digitos = valor.replace(/\D/g, '');
      if (digitos.length === 11) {
        return '(' + digitos.slice(0, 2) + ') ' + digitos.slice(2, 7) + '-' + digitos.slice(7);
      }
      if (digitos.length === 10) {
        return '(' + digitos.slice(0, 2) + ') ' + digitos.slice(2, 6) + '-' + digitos.slice(6);
      }
      return valor;
    }

    /** "41720000" → "41720-000". */
    function formatarCep(valor) {
      var digitos = valor.replace(/\D/g, '');
      return digitos.length === 8 ? digitos.slice(0, 5) + '-' + digitos.slice(5) : valor;
    }

    /** Grava no localStorage apenas os campos editáveis do aluno. */
    function persistirAlteracoes(aluno) {
      var alteracoes = StorageService.ler(CHAVE_ALTERACOES, {});
      alteracoes[aluno.matricula] = {
        email: aluno.email,
        telefone: aluno.telefone,
        endereco: aluno.endereco,
        atualizadoEm: aluno.atualizadoEm
      };
      StorageService.salvar(CHAVE_ALTERACOES, alteracoes);
    }

    /** Ao iniciar o app, reaplica sobre o mock as alterações salvas anteriormente. */
    function aplicarAlteracoesSalvas() {
      var alteracoes = StorageService.ler(CHAVE_ALTERACOES, {});
      alunos.forEach(function (aluno) {
        var salvo = alteracoes[aluno.matricula];
        if (!salvo) {
          return;
        }
        // somente campos editáveis são restaurados (dados institucionais nunca)
        aluno.email = salvo.email || aluno.email;
        aluno.telefone = salvo.telefone || aluno.telefone;
        aluno.endereco = angular.extend({}, aluno.endereco, salvo.endereco);
        aluno.atualizadoEm = salvo.atualizadoEm || null;
      });
    }
  }
})();
