/**
 * FinanceiroService — mensalidades do aluno agrupadas por semestre letivo (RF04).
 *
 * Simula os endpoints:
 *  - listarSemestres(matricula)    → GET /alunos/:matricula/semestres
 *  - listarMensalidades(matricula) → GET /alunos/:matricula/mensalidades
 *
 * Valores e linhas digitáveis são FICTÍCIOS (não correspondem a boletos reais).
 */
(function () {
  'use strict';

  angular.module('ucsalApp').factory('FinanceiroService', FinanceiroService);

  FinanceiroService.$inject = ['MockApi'];

  function FinanceiroService(MockApi) {
    var STATUS = { PAGA: 'PAGA', A_PAGAR: 'A_PAGAR' };
    var ROTULOS_STATUS = { PAGA: 'Paga', A_PAGAR: 'A Pagar' };

    /* ------------------------------------------------------------------------
     * MOCK — mensalidades por aluno → semestre letivo → parcelas.
     * ---------------------------------------------------------------------- */
    var mensalidadesPorAluno = {
      '20261001': {
        '2025.2': [
          { parcela: 1, referencia: 'Julho/2025', vencimento: '2025-07-10', valor: 1149.90, status: 'PAGA', pagoEm: '2025-07-08', linhaDigitavel: null },
          { parcela: 2, referencia: 'Agosto/2025', vencimento: '2025-08-10', valor: 1149.90, status: 'PAGA', pagoEm: '2025-08-09', linhaDigitavel: null },
          { parcela: 3, referencia: 'Setembro/2025', vencimento: '2025-09-10', valor: 1149.90, status: 'PAGA', pagoEm: '2025-09-10', linhaDigitavel: null },
          { parcela: 4, referencia: 'Outubro/2025', vencimento: '2025-10-10', valor: 1149.90, status: 'PAGA', pagoEm: '2025-10-07', linhaDigitavel: null },
          { parcela: 5, referencia: 'Novembro/2025', vencimento: '2025-11-10', valor: 1149.90, status: 'PAGA', pagoEm: '2025-11-10', linhaDigitavel: null },
          { parcela: 6, referencia: 'Dezembro/2025', vencimento: '2025-12-10', valor: 1149.90, status: 'PAGA', pagoEm: '2025-12-05', linhaDigitavel: null }
        ],
        '2026.1': [
          { parcela: 1, referencia: 'Janeiro/2026', vencimento: '2026-01-10', valor: 1219.90, status: 'PAGA', pagoEm: '2026-01-09', linhaDigitavel: null },
          { parcela: 2, referencia: 'Fevereiro/2026', vencimento: '2026-02-10', valor: 1219.90, status: 'PAGA', pagoEm: '2026-02-10', linhaDigitavel: null },
          { parcela: 3, referencia: 'Março/2026', vencimento: '2026-03-10', valor: 1219.90, status: 'PAGA', pagoEm: '2026-03-06', linhaDigitavel: null },
          { parcela: 4, referencia: 'Abril/2026', vencimento: '2026-04-10', valor: 1219.90, status: 'PAGA', pagoEm: '2026-04-10', linhaDigitavel: null },
          { parcela: 5, referencia: 'Maio/2026', vencimento: '2026-05-10', valor: 1219.90, status: 'PAGA', pagoEm: '2026-05-08', linhaDigitavel: null },
          { parcela: 6, referencia: 'Junho/2026', vencimento: '2026-06-10', valor: 1219.90, status: 'A_PAGAR', pagoEm: null, linhaDigitavel: '00190.00009 02026.100106 00000.123456 1 14560000121990' }
        ],
        '2026.2': [
          { parcela: 1, referencia: 'Julho/2026', vencimento: '2026-07-10', valor: 1219.90, status: 'PAGA', pagoEm: '2026-07-10', linhaDigitavel: null },
          { parcela: 2, referencia: 'Agosto/2026', vencimento: '2026-08-10', valor: 1219.90, status: 'PAGA', pagoEm: '2026-08-07', linhaDigitavel: null },
          { parcela: 3, referencia: 'Setembro/2026', vencimento: '2026-09-10', valor: 1219.90, status: 'PAGA', pagoEm: '2026-09-10', linhaDigitavel: null },
          { parcela: 4, referencia: 'Outubro/2026', vencimento: '2026-10-10', valor: 1219.90, status: 'PAGA', pagoEm: '2026-10-09', linhaDigitavel: null },
          { parcela: 5, referencia: 'Novembro/2026', vencimento: '2026-11-10', valor: 1219.90, status: 'A_PAGAR', pagoEm: null, linhaDigitavel: '00190.00009 02026.100114 00000.123456 7 16080000121990' },
          { parcela: 6, referencia: 'Dezembro/2026', vencimento: '2026-12-10', valor: 1219.90, status: 'A_PAGAR', pagoEm: null, linhaDigitavel: '00190.00009 02026.100122 00000.123456 3 16380000121990' }
        ]
      },
      '20261002': {
        '2026.1': [
          { parcela: 1, referencia: 'Janeiro/2026', vencimento: '2026-01-10', valor: 1089.90, status: 'PAGA', pagoEm: '2026-01-05', linhaDigitavel: null },
          { parcela: 2, referencia: 'Fevereiro/2026', vencimento: '2026-02-10', valor: 1089.90, status: 'PAGA', pagoEm: '2026-02-09', linhaDigitavel: null },
          { parcela: 3, referencia: 'Março/2026', vencimento: '2026-03-10', valor: 1089.90, status: 'PAGA', pagoEm: '2026-03-10', linhaDigitavel: null },
          { parcela: 4, referencia: 'Abril/2026', vencimento: '2026-04-10', valor: 1089.90, status: 'PAGA', pagoEm: '2026-04-08', linhaDigitavel: null },
          { parcela: 5, referencia: 'Maio/2026', vencimento: '2026-05-10', valor: 1089.90, status: 'PAGA', pagoEm: '2026-05-10', linhaDigitavel: null },
          { parcela: 6, referencia: 'Junho/2026', vencimento: '2026-06-10', valor: 1089.90, status: 'PAGA', pagoEm: '2026-06-09', linhaDigitavel: null }
        ],
        '2026.2': [
          { parcela: 1, referencia: 'Julho/2026', vencimento: '2026-07-10', valor: 1089.90, status: 'PAGA', pagoEm: '2026-07-09', linhaDigitavel: null },
          { parcela: 2, referencia: 'Agosto/2026', vencimento: '2026-08-10', valor: 1089.90, status: 'PAGA', pagoEm: '2026-08-10', linhaDigitavel: null },
          { parcela: 3, referencia: 'Setembro/2026', vencimento: '2026-09-10', valor: 1089.90, status: 'PAGA', pagoEm: '2026-09-04', linhaDigitavel: null },
          { parcela: 4, referencia: 'Outubro/2026', vencimento: '2026-10-10', valor: 1089.90, status: 'A_PAGAR', pagoEm: null, linhaDigitavel: '00190.00009 02026.200105 00000.654321 9 15780000108990' },
          { parcela: 5, referencia: 'Novembro/2026', vencimento: '2026-11-10', valor: 1089.90, status: 'A_PAGAR', pagoEm: null, linhaDigitavel: '00190.00009 02026.200113 00000.654321 2 16080000108990' },
          { parcela: 6, referencia: 'Dezembro/2026', vencimento: '2026-12-10', valor: 1089.90, status: 'A_PAGAR', pagoEm: null, linhaDigitavel: '00190.00009 02026.200121 00000.654321 5 16380000108990' }
        ]
      }
    };

    return {
      STATUS: STATUS,
      listarSemestres: listarSemestres,
      listarMensalidades: listarMensalidades,
      calcularResumo: calcularResumo
    };

    /* ======================== API pública ======================== */

    /** Semestres com mensalidades para o aluno, do mais recente para o mais antigo. */
    function listarSemestres(matricula) {
      var semestres = Object.keys(mensalidadesPorAluno[matricula] || {}).sort().reverse();
      return MockApi.responder(semestres);
    }

    /**
     * Todas as mensalidades do aluno em uma lista única, cada parcela com o seu
     * `semestre` — a view filtra por semestre com o filtro nativo `filter`.
     * Também calcula campos derivados (rótulo do status e se está vencida).
     * @param {string} matricula
     * @param {Date|string} [dataReferencia] data usada para identificar atrasos (padrão: hoje)
     */
    function listarMensalidades(matricula, dataReferencia) {
      var porSemestre = mensalidadesPorAluno[matricula] || {};
      var hoje = paraDataIso(dataReferencia || new Date());
      var lista = [];

      Object.keys(porSemestre).forEach(function (semestre) {
        var parcelas = porSemestre[semestre];
        parcelas.forEach(function (parcela) {
          lista.push(angular.extend({}, parcela, {
            id: matricula + '-' + semestre + '-' + parcela.parcela,
            semestre: semestre,
            totalParcelas: parcelas.length,
            statusRotulo: ROTULOS_STATUS[parcela.status],
            emAtraso: parcela.status === STATUS.A_PAGAR && parcela.vencimento < hoje
          }));
        });
      });

      return MockApi.responder(lista);
    }

    /** Totais de um conjunto de parcelas (ex.: as do semestre selecionado). */
    function calcularResumo(parcelas) {
      var resumo = {
        totalPago: 0,
        totalAPagar: 0,
        totalEmAtraso: 0,
        quantidadePagas: 0,
        quantidadeAPagar: 0
      };

      (parcelas || []).forEach(function (parcela) {
        if (parcela.status === STATUS.PAGA) {
          resumo.totalPago += parcela.valor;
          resumo.quantidadePagas++;
        } else {
          resumo.totalAPagar += parcela.valor;
          resumo.quantidadeAPagar++;
          if (parcela.emAtraso) {
            resumo.totalEmAtraso += parcela.valor;
          }
        }
      });

      resumo.totalPago = arredondar(resumo.totalPago);
      resumo.totalAPagar = arredondar(resumo.totalAPagar);
      resumo.totalEmAtraso = arredondar(resumo.totalEmAtraso);
      return resumo;
    }

    /* ======================== Funções internas ======================== */

    /** Converte uma data para "aaaa-mm-dd" (horário local), formato usado nos mocks. */
    function paraDataIso(data) {
      if (typeof data === 'string') {
        return data.slice(0, 10);
      }
      var mes = String(data.getMonth() + 1);
      var dia = String(data.getDate());
      return data.getFullYear() + '-' + (mes.length < 2 ? '0' + mes : mes) + '-' + (dia.length < 2 ? '0' + dia : dia);
    }

    /** Evita resíduos de ponto flutuante em somas de dinheiro (ex.: 2439.7999999). */
    function arredondar(valor) {
      return Math.round(valor * 100) / 100;
    }
  }
})();
