function gerarHtmlListaAresta() {
  let tabela = document.createElement('table'),
    listaArestaDiv = document.getElementById('listaAresta'),
    bodyTabela = document.createElement('tbody'),
    listaCabecalho = ['Aresta A', 'Aresta B'],
    cabecalho;

  if (valorado) listaCabecalho.push('Valor');
  if (orientado) listaCabecalho.push('Orientado');

  cabecalho = gerarCabecalho(listaCabecalho);

  limpaDiv(listaArestaDiv);

  listaAresta.forEach(item => {
    let tr = document.createElement('tr'),
      td = null;

    td = document.createElement('td');
    td.innerHTML = item.getV1();
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = item.getV2();
    tr.appendChild(td);

    if (valorado) {
      td = document.createElement('td');
      td.innerHTML = item.getValor();
      tr.appendChild(td);
    }

    if (orientado) {
      td = document.createElement('td');
      td.innerHTML = item.getOrientadoString();
      tr.appendChild(td);
    }

    bodyTabela.appendChild(tr);
  });

  tabela.id = 'tableListaAresta';
  tabela.classList = 'table table-striped';
  tabela.appendChild(cabecalho);
  tabela.appendChild(bodyTabela);
  listaArestaDiv.appendChild(tabela);
}

function gerarHtmlMatrizAdjacencia() {
  let tabela = document.createElement('table'),
    cabecalho = gerarCabecalho(listaVertices, true),
    listaMatrizAdjacencia = document.getElementById('listaMatrizAdjacencia'),
    bodyTabela = document.createElement('tbody');

  limpaDiv(listaMatrizAdjacencia);

  matrizAdjacencia.forEach((arrayAdjacencia, index) => {
    let tr = document.createElement('tr'),
      td = null;

    td = document.createElement('th');
    td.innerHTML = index;
    td.scope = 'row';
    tr.appendChild(td);

    arrayAdjacencia.forEach(el => {
      let td = null;

      td = document.createElement('td');
      td.innerHTML = el;
      tr.appendChild(td);
    });

    bodyTabela.appendChild(tr);
  });

  tabela.id = 'tableMatrizAdjacencia';
  tabela.classList = 'table table-striped';
  tabela.appendChild(cabecalho);
  tabela.appendChild(bodyTabela);
  listaMatrizAdjacencia.appendChild(tabela);
}

function gerarHtmlListaAdjacencia() {
  let tabela = document.createElement('table'),
    listaListaAdjacencia = document.getElementById('listaAdjacencia'),
    bodyTabela = document.createElement('tbody');

  limpaDiv(listaListaAdjacencia);

  listaAdjacencia.forEach((arrayAdjacencia, index) => {
    let tr = document.createElement('tr'),
      texto = '',
      td = null;

    td = document.createElement('th');
    td.innerHTML = index;
    td.scope = 'row';
    tr.appendChild(td);

    arrayAdjacencia.forEach(el => texto += (texto.length > 0 ? ', ' : '') + el);

    td = document.createElement('th');
    td.innerHTML = texto;
    tr.appendChild(td);

    bodyTabela.appendChild(tr);
  });

  tabela.id = 'tableListaAdjacencia';
  tabela.classList = 'table table-striped';
  tabela.appendChild(bodyTabela);
  listaListaAdjacencia.appendChild(tabela);
}

function gerarHtmlMatrizIncidencia() {
  let tabela = document.createElement('table'),
    cabecalho,
    listaCabecalho = [''],
    listaMatrizIncidencia = document.getElementById('listaMatrizIncidencia'),
    bodyTabela = document.createElement('tbody');

  limpaDiv(listaMatrizIncidencia);

  listaAresta.forEach((item, index) => {
    listaCabecalho.push('E' + (index + 1));
  });

  cabecalho = gerarCabecalho(listaCabecalho);

  matrizIncidencia.forEach((arrayIncidencia, index) => {
    let tr = document.createElement('tr'),
      td = null;

    td = document.createElement('th');
    td.innerHTML = index;
    td.scope = 'row';
    tr.appendChild(td);

    arrayIncidencia.forEach(el => {
      let td = null;

      td = document.createElement('td');
      td.innerHTML = el;
      tr.appendChild(td);
    });

    bodyTabela.appendChild(tr);
  });

  tabela.id = 'tableMatrizIncidencia';
  tabela.classList = 'table table-striped';
  tabela.appendChild(cabecalho);
  tabela.appendChild(bodyTabela);
  listaMatrizIncidencia.appendChild(tabela);
}

function gerarHtmlDijkstra() {
  let tabela = document.createElement('table'),
    cabecalho,
    listaCabecalho = ['Vertice', 'Distância', 'Caminho'],
    listaMatrizIncidencia = document.getElementById('listaDijkstra'),
    bodyTabela = document.createElement('tbody');

  limpaDiv(listaMatrizIncidencia);

  cabecalho = gerarCabecalho(listaCabecalho);

  dijkstraList.forEach((item) => {
    let tr = document.createElement('tr'),
      td = null;

    item.forEach(el => {
      let td = null;

      td = document.createElement('td');
      td.innerHTML = el;
      tr.appendChild(td);
    });

    bodyTabela.appendChild(tr);
  });

  tabela.id = 'tableDijkstra';
  tabela.classList = 'table table-striped';
  tabela.appendChild(cabecalho);
  tabela.appendChild(bodyTabela);
  listaMatrizIncidencia.appendChild(tabela);
}

function gerarHtmlKruskal() {
  let tabela = document.createElement('table'),
    cabecalho,
    listaCabecalho = ['Vertice 1', 'Vertice 2', 'Valor'],
    lista = document.getElementById('kruskal'),
    bodyTabela = document.createElement('tbody');

  limpaDiv(lista);

  cabecalho = gerarCabecalho(listaCabecalho);

  kruskalList.forEach(item => {
    let tr = document.createElement('tr'),
      td = null;

    td = document.createElement('td');
    td.innerHTML = item.getV1();
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = item.getV2();
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = item.getValor();
    tr.appendChild(td);

    bodyTabela.appendChild(tr);
  });

  tabela.id = 'tableKruskal';
  tabela.classList = 'table table-striped';
  tabela.appendChild(cabecalho);
  tabela.appendChild(bodyTabela);
  lista.appendChild(tabela);
}

function gerarCabecalho(vertices, primeiroVazio = false) {
  let cabecalho = document.createElement('thead'),
    tr = document.createElement('tr'),
    th;

  if (primeiroVazio) {
    th = document.createElement('th');
    th.scope = 'col';
    th.innerHTML = '#';
    tr.appendChild(th);
  }

  vertices.forEach(el => {
    th = document.createElement('th');
    th.scope = 'col';
    th.innerHTML = el;
    tr.appendChild(th);
  });

  cabecalho.className = 'thead-dark';
  cabecalho.appendChild(tr);

  return cabecalho;
}