/**
 * NoticiasService — mural de notícias e atividades da UCSal (RF02).
 *
 * Simula os endpoints:
 *  - listar()          → GET /publicacoes
 *  - buscarPorId(id)   → GET /publicacoes/:id
 *
 * Todo o conteúdo abaixo é fictício e serve apenas para o protótipo.
 */
(function () {
  'use strict';

  angular.module('ucsalApp').factory('NoticiasService', NoticiasService);

  NoticiasService.$inject = ['MockApi'];

  function NoticiasService(MockApi) {

    /* Categorias usadas nos filtros do mural. */
    var categorias = [
      { valor: 'Notícia', rotulo: 'Notícias', icone: 'ion-ios-paper-outline' },
      { valor: 'Evento', rotulo: 'Eventos', icone: 'ion-ios-calendar-outline' }
    ];

    /* ------------------------------------------------------------------------
     * MOCK — publicações do mural (notícias institucionais e eventos/atividades).
     * ---------------------------------------------------------------------- */
    var publicacoes = [
      {
        id: 1,
        categoria: 'Notícia',
        titulo: 'Rematrícula 2027.1: confira prazos e orientações',
        resumo: 'A rematrícula on-line do semestre 2027.1 acontece de 1º a 18 de dezembro, pelo Portal do Aluno. Veja o passo a passo.',
        conteudo: [
          'A Secretaria Acadêmica informa que a rematrícula para o semestre letivo 2027.1 será realizada exclusivamente on-line, de 1º a 18 de dezembro de 2026.',
          'Para concluir o processo, o estudante deve estar com a situação financeira regularizada, revisar as disciplinas sugeridas pela matriz curricular e aceitar o contrato de prestação de serviços educacionais.',
          'Quem perder o prazo regular poderá solicitar a rematrícula extemporânea entre 4 e 8 de janeiro de 2027, sujeita à disponibilidade de vagas nas turmas.',
          'Dúvidas podem ser encaminhadas à Central de Atendimento dos campi Pituaçu e Federação.'
        ],
        data: '2026-11-12',
        local: 'Portal do Aluno (on-line)',
        fonte: 'Secretaria Acadêmica',
        imagem: 'img/noticias/rematricula.svg',
        destaque: true
      },
      {
        id: 2,
        categoria: 'Notícia',
        titulo: 'Abertas as inscrições para a Iniciação Científica 2027',
        resumo: 'Edital seleciona estudantes de graduação para projetos de pesquisa, com bolsa ou como voluntários. Inscrições até 5 de dezembro.',
        conteudo: [
          'A Pró-Reitoria de Pesquisa publicou o edital do Programa de Iniciação Científica para o ciclo 2027–2028.',
          'Podem participar estudantes regularmente matriculados a partir do 2º semestre, com coeficiente de rendimento igual ou superior a 7,0. As vagas contemplam bolsas e participação voluntária.',
          'A inscrição é feita em conjunto com o professor orientador, que deve submeter o plano de trabalho do estudante até 5 de dezembro de 2026.',
          'O resultado preliminar será divulgado em fevereiro de 2027, no site institucional e neste mural.'
        ],
        data: '2026-11-05',
        local: 'Inscrições on-line',
        fonte: 'Pró-Reitoria de Pesquisa',
        imagem: 'img/noticias/iniciacao-cientifica.svg',
        destaque: false
      },
      {
        id: 3,
        categoria: 'Evento',
        titulo: 'Semoc 2026 — Semana de Mobilização Científica',
        resumo: 'Palestras, mostras de pesquisa, minicursos e apresentações culturais movimentam os campi Pituaçu e Federação de 23 a 27 de novembro.',
        conteudo: [
          'A Semana de Mobilização Científica (Semoc) é o principal evento acadêmico da UCSal e reúne estudantes, professores e convidados em torno da pesquisa, da extensão e da cultura.',
          'A programação inclui conferências, mesas-redondas, apresentações de trabalhos de iniciação científica, oficinas e minicursos com certificado.',
          'Os estudantes de Engenharia de Software terão uma trilha dedicada a Inteligência Artificial, Desenvolvimento Mobile e Qualidade de Software no Campus Pituaçu.',
          'A participação conta como horas de atividades complementares. Faça sua inscrição nas atividades pelo site do evento.'
        ],
        data: '2026-11-23',
        horario: '8h às 21h',
        local: 'Campi Pituaçu e Federação',
        fonte: 'Comissão Organizadora da Semoc',
        imagem: 'img/noticias/semoc.svg',
        destaque: true
      },
      {
        id: 4,
        categoria: 'Evento',
        titulo: 'Maratona de Programação UCSal 2026',
        resumo: 'Equipes de até três estudantes enfrentam desafios de algoritmos durante cinco horas. Inscrições abertas até 25 de novembro.',
        conteudo: [
          'O curso de Engenharia de Software promove a Maratona de Programação UCSal, competição no formato das maratonas universitárias, com problemas de lógica, estruturas de dados e algoritmos.',
          'As equipes podem ter até três integrantes e utilizam um computador por time. São aceitas as linguagens C, C++, Java e Python.',
          'As três primeiras equipes recebem certificado de premiação e serão convidadas a representar a universidade em competições regionais.',
          'Inscrições pela coordenação do curso até 25 de novembro de 2026.'
        ],
        data: '2026-11-28',
        horario: '13h às 18h',
        local: 'Laboratórios de Informática – Campus Pituaçu',
        fonte: 'Coordenação de Engenharia de Software',
        imagem: 'img/noticias/maratona.svg',
        destaque: false
      },
      {
        id: 5,
        categoria: 'Evento',
        titulo: 'Projeto de extensão "Código na Comunidade" abre vagas',
        resumo: 'Estudantes de tecnologia ensinam lógica de programação a jovens de escolas públicas de Salvador. A atividade gera horas de extensão.',
        conteudo: [
          'O projeto de extensão "Código na Comunidade" leva oficinas de lógica de programação e criação de jogos para estudantes do ensino médio da rede pública.',
          'Os voluntários atuam em duplas, aos sábados pela manhã, com acompanhamento de professores do curso de Engenharia de Software.',
          'São 20 vagas para estudantes a partir do 3º semestre. A participação é registrada como carga horária de extensão curricular.',
          'Interessados devem preencher o formulário disponível na coordenação até 30 de novembro.'
        ],
        data: '2026-11-10',
        horario: 'Sábados, 8h às 12h',
        local: 'Escolas públicas parceiras – Salvador',
        fonte: 'Pró-Reitoria de Extensão',
        imagem: 'img/noticias/extensao.svg',
        destaque: false
      },
      {
        id: 6,
        categoria: 'Notícia',
        titulo: 'Bibliotecas ampliam horário no período de avaliações',
        resumo: 'De 23 de novembro a 12 de dezembro, as bibliotecas dos campi Pituaçu e Federação funcionam até as 22h.',
        conteudo: [
          'Para apoiar os estudos no fim do semestre, o Sistema de Bibliotecas amplia o horário de funcionamento das unidades dos dois campi.',
          'De 23 de novembro a 12 de dezembro, o atendimento acontece de segunda a sexta, das 7h às 22h, e aos sábados, das 8h às 14h.',
          'As salas de estudo em grupo podem ser reservadas com até 48 horas de antecedência no balcão de atendimento.'
        ],
        data: '2026-11-14',
        local: 'Campi Pituaçu e Federação',
        fonte: 'Sistema de Bibliotecas',
        imagem: 'img/noticias/biblioteca.svg',
        destaque: false
      },
      {
        id: 7,
        categoria: 'Evento',
        titulo: 'Feira de Estágios e Carreiras em Tecnologia',
        resumo: 'Empresas de tecnologia apresentam vagas de estágio e trainee, com mentorias de currículo e de perfil profissional.',
        conteudo: [
          'O Núcleo de Carreiras realiza a Feira de Estágios e Carreiras em Tecnologia, com estandes de empresas, palestras rápidas e entrevistas no local.',
          'Haverá mentorias gratuitas de currículo e de perfil profissional nas redes, conduzidas por egressos da universidade.',
          'Leve seu currículo atualizado. A entrada é gratuita para estudantes e egressos.'
        ],
        data: '2026-12-03',
        horario: '14h às 20h',
        local: 'Campus Federação',
        fonte: 'Núcleo de Carreiras',
        imagem: 'img/noticias/estagio.svg',
        destaque: false
      }
    ];

    return {
      listar: listar,
      buscarPorId: buscarPorId,
      listarCategorias: listarCategorias
    };

    /** Lista todas as publicações do mural. */
    function listar() {
      return MockApi.responder(publicacoes);
    }

    /** Busca uma publicação pelo id (o id da URL chega como texto). */
    function buscarPorId(id) {
      var publicacao = publicacoes.filter(function (item) {
        return String(item.id) === String(id);
      })[0];
      return publicacao ? MockApi.responder(publicacao) : MockApi.falhar('Publicação não encontrada.');
    }

    /** Categorias disponíveis para o filtro (Notícia / Evento). */
    function listarCategorias() {
      return angular.copy(categorias);
    }
  }
})();
