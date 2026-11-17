/**
 * Testes automatizados das regras de negócio dos services (camada de dados mockada).
 * Execução: npm test   (usa o test runner nativo do Node.js, sem dependências)
 */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const apoio = require('./apoio/angular-falso');

apoio.carregarArquivos([
  'app.js',
  'services/StorageService.js',
  'services/MockApi.js',
  'services/AlunoService.js',
  'services/AuthService.js',
  'services/NoticiasService.js',
  'services/FinanceiroService.js'
]);

/* ============================== AuthService (RF01) ============================== */

test('AuthService: login válido guarda o aluno na sessão e no $rootScope', async () => {
  const injetor = apoio.criarInjetor();
  const auth = injetor.obter('AuthService');

  const aluno = await auth.login('20261001', '123456');

  assert.equal(aluno.nome, 'Fernanda Velame');
  assert.equal(auth.estaAutenticado(), true);
  assert.equal(auth.getAlunoLogado().matricula, '20261001');
  assert.equal(injetor.$rootScope.alunoLogado.matricula, '20261001');
});

test('AuthService: impede envio de campos vazios', async () => {
  const auth = apoio.criarInjetor().obter('AuthService');

  await assert.rejects(auth.login('', ''), { mensagem: 'Preencha a matrícula e a senha para continuar.' });
  await assert.rejects(auth.login('20261001', ''), /./);
  assert.equal(auth.estaAutenticado(), false);
});

test('AuthService: rejeita senha incorreta, matrícula inválida e matrícula trancada', async () => {
  const auth = apoio.criarInjetor().obter('AuthService');

  await assert.rejects(auth.login('20261001', 'errada'), { mensagem: 'Matrícula ou senha inválidas.' });
  await assert.rejects(auth.login('123', '123456'), { mensagem: 'A matrícula deve conter 8 dígitos numéricos.' });
  await assert.rejects(auth.login('20241003', '123456'), { mensagem: 'Sua matrícula está trancada. Procure a Secretaria Acadêmica.' });
  assert.equal(auth.estaAutenticado(), false);
});

test('AuthService: sessão é restaurada após recarregar a página e a senha não é gravada', async () => {
  const storage = apoio.criarLocalStorage();
  const primeiraCarga = apoio.criarInjetor({ localStorage: storage }).obter('AuthService');
  await primeiraCarga.login('20261002', 'ucsal2026');

  const gravado = storage.getItem('ucsal.portal.sessao');
  assert.ok(gravado.includes('20261002'));
  assert.ok(!gravado.includes('ucsal2026'), 'a senha não pode ir para o localStorage');

  const segundaCarga = apoio.criarInjetor({ localStorage: storage }).obter('AuthService');
  assert.equal(segundaCarga.restaurarSessao(), true);
  assert.equal(segundaCarga.getAlunoLogado().nome, 'Carlos Eduardo Menezes');

  segundaCarga.logout();
  assert.equal(segundaCarga.estaAutenticado(), false);
  assert.equal(storage.getItem('ucsal.portal.sessao'), null);
});

/* ============================== NoticiasService (RF02) ============================== */

test('NoticiasService: publicações têm os campos exigidos pelo card', async () => {
  const noticias = apoio.criarInjetor().obter('NoticiasService');
  const publicacoes = await noticias.listar();
  const categoriasValidas = noticias.listarCategorias().map((c) => c.valor);

  assert.ok(publicacoes.length >= 6);
  publicacoes.forEach((p) => {
    assert.ok(p.titulo && p.data && p.imagem && p.resumo, 'campos do card: ' + p.id);
    assert.ok(categoriasValidas.includes(p.categoria), 'categoria inválida: ' + p.categoria);
    assert.ok(Array.isArray(p.conteudo) && p.conteudo.length > 0, 'conteúdo completo: ' + p.id);
  });
  assert.ok(publicacoes.some((p) => p.categoria === 'Notícia'));
  assert.ok(publicacoes.some((p) => p.categoria === 'Evento'));
});

test('NoticiasService: busca por id (texto vindo da URL) e trata id inexistente', async () => {
  const noticias = apoio.criarInjetor().obter('NoticiasService');

  const semoc = await noticias.buscarPorId('3');
  assert.match(semoc.titulo, /Semoc/);
  await assert.rejects(noticias.buscarPorId('999'), { mensagem: 'Publicação não encontrada.' });
});

test('NoticiasService: devolve cópias, protegendo o mock contra alterações da view', async () => {
  const noticias = apoio.criarInjetor().obter('NoticiasService');

  const primeira = await noticias.listar();
  primeira[0].titulo = 'alterado pela view';
  const segunda = await noticias.listar();
  assert.notEqual(segunda[0].titulo, 'alterado pela view');
});

/* ============================== AlunoService (RF03) ============================== */

const contatoValido = {
  email: '  Nova.Ana@Example.com ',
  telefone: '71999998888',
  endereco: { cep: '40170110', rua: 'Av. Exemplo', numero: '100', complemento: '', bairro: 'Ondina', cidade: 'Salvador', uf: 'ba' }
};

test('AlunoService: atualiza e normaliza os dados de contato', async () => {
  const alunos = apoio.criarInjetor().obter('AlunoService');

  const atualizado = await alunos.atualizarContato('20261001', contatoValido);

  assert.equal(atualizado.email, 'nova.ana@example.com');
  assert.equal(atualizado.telefone, '(71) 99999-8888');
  assert.equal(atualizado.endereco.cep, '40170-110');
  assert.equal(atualizado.endereco.uf, 'BA');
  assert.ok(atualizado.atualizadoEm);
});

test('AlunoService: nunca altera campos institucionais (nome, matrícula, curso)', async () => {
  const alunos = apoio.criarInjetor().obter('AlunoService');
  const tentativa = Object.assign({}, contatoValido, {
    nome: 'Outro Nome', matricula: '99999999', curso: 'Medicina'
  });

  const atualizado = await alunos.atualizarContato('20261001', tentativa);

  assert.equal(atualizado.nome, 'Fernanda Velame');
  assert.equal(atualizado.matricula, '20261001');
  assert.equal(atualizado.curso, 'Engenharia de Software');
});

test('AlunoService: rejeita dados inválidos sem alterar o cadastro', async () => {
  const alunos = apoio.criarInjetor().obter('AlunoService');
  const invalido = Object.assign({}, contatoValido, { email: 'sem-arroba', telefone: '123' });

  await assert.rejects(alunos.atualizarContato('20261001', invalido), (erro) => {
    assert.equal(erro.mensagem, 'Informe um e-mail válido.');
    assert.equal(erro.erros.length, 2);
    return true;
  });
  const perfil = await alunos.carregarPerfil('20261001');
  assert.equal(perfil.email, 'ana.lima@example.com');
});

test('AlunoService: alterações sobrevivem ao recarregar a página (localStorage)', async () => {
  const storage = apoio.criarLocalStorage();
  await apoio.criarInjetor({ localStorage: storage }).obter('AlunoService')
    .atualizarContato('20261001', contatoValido);

  const recarregado = apoio.criarInjetor({ localStorage: storage }).obter('AlunoService');
  const perfil = await recarregado.carregarPerfil('20261001');
  assert.equal(perfil.telefone, '(71) 99999-8888');
  assert.equal(perfil.curso, 'Engenharia de Software');
});

test('AlunoService: regras de validação expostas para a view (ng-pattern)', () => {
  const regras = apoio.criarInjetor().obter('AlunoService').regrasValidacao;

  assert.ok(regras.telefone.test('(71) 98765-4321'));
  assert.ok(regras.telefone.test('7133334444'));
  assert.ok(!regras.telefone.test('98765-4321'));
  assert.ok(regras.cep.test('41720-000'));
  assert.ok(regras.cep.test('41720000'));
  assert.ok(!regras.cep.test('4172'));
});

/* ============================== FinanceiroService (RF04) ============================== */

test('FinanceiroService: semestres do mais recente para o mais antigo', async () => {
  const financeiro = apoio.criarInjetor().obter('FinanceiroService');

  assert.deepEqual(await financeiro.listarSemestres('20261001'), ['2026.2', '2026.1', '2025.2']);
  assert.deepEqual(await financeiro.listarSemestres('00000000'), []);
});

test('FinanceiroService: parcelas trazem semestre, rótulo do status e atraso', async () => {
  const financeiro = apoio.criarInjetor().obter('FinanceiroService');
  const parcelas = await financeiro.listarMensalidades('20261001', '2026-11-16');

  assert.equal(parcelas.length, 18);
  const novembro = parcelas.find((p) => p.semestre === '2026.2' && p.parcela === 5);
  const dezembro = parcelas.find((p) => p.semestre === '2026.2' && p.parcela === 6);

  assert.equal(novembro.statusRotulo, 'A Pagar');
  assert.equal(novembro.emAtraso, true);   // venceu em 10/11/2026
  assert.equal(dezembro.emAtraso, false);  // vence em 10/12/2026
  assert.equal(parcelas.find((p) => p.status === 'PAGA').statusRotulo, 'Paga');
});

test('FinanceiroService: toda parcela A Pagar tem linha digitável com 47 dígitos', async () => {
  const financeiro = apoio.criarInjetor().obter('FinanceiroService');
  const todas = (await financeiro.listarMensalidades('20261001'))
    .concat(await financeiro.listarMensalidades('20261002'));

  todas.filter((p) => p.status === 'A_PAGAR').forEach((p) => {
    assert.equal(p.linhaDigitavel.replace(/\D/g, '').length, 47, p.id);
  });
  todas.filter((p) => p.status === 'PAGA').forEach((p) => {
    assert.ok(p.pagoEm, 'parcela paga sem data de pagamento: ' + p.id);
  });
});

test('FinanceiroService: resumo do semestre soma valores sem erro de arredondamento', async () => {
  const financeiro = apoio.criarInjetor().obter('FinanceiroService');
  const parcelas = await financeiro.listarMensalidades('20261001', '2026-11-16');
  const semestre = parcelas.filter((p) => p.semestre === '2026.2');

  assert.deepEqual(financeiro.calcularResumo(semestre), {
    totalPago: 4879.6,
    totalAPagar: 2439.8,
    totalEmAtraso: 1219.9,
    quantidadePagas: 4,
    quantidadeAPagar: 2
  });
});
