var orientado = false,
  valorado = false,
  listaAresta = [],
  listaVertices = [],
  listaAdjacencia = [],
  matrizAdjacencia = [],
  matrizIncidencia = [];

function gerarListaAresta() {
  let rawStringList = document.getElementById('inputDados').value,
    listaItens = rawStringList.split('/'),
    splitedData;

  listaAresta = [];
  listaItens.forEach(el => {
    splitedData = el.split(',');
    listaAresta.push(new listaArestaItem(
      parseInt(splitedData[0]),
      parseInt(splitedData[1]),
      parseInt(splitedData[2]),
      parseInt(splitedData[3]) || 0
    ));
  });
}

function gerarListaVertices() {
  listaVertices = [];

  listaAresta.forEach(el => {
    if (listaVertices.indexOf(el.getV1()) < 0) listaVertices.push(el.getV1());
    if (listaVertices.indexOf(el.getV2()) < 0) listaVertices.push(el.getV2());
  });

  listaVertices.sort();
}

function gerarMatrizIncidencia() {
  matrizIncidencia = [];

  listaAresta.forEach((el, i) => {
    listaVertices.forEach(vertice => {
      if (typeof matrizIncidencia[vertice] === 'undefined')
        matrizIncidencia[vertice] = [];

      matrizIncidencia[vertice][i] = 0;

      if (orientado) {
        if (el.getV1() == vertice) {
          matrizIncidencia[vertice][i] = (!(el.getOrientado() == 1) && orientado) ? 1 : ((valorado) ? el.getValor() : 1);
        } else if (el.getV2() == vertice) {
          matrizIncidencia[vertice][i] = (!(el.getOrientado() == 1) && orientado) ? 1 : ((valorado) ? el.getValor() : 1) * -1;
        }
      } else if (el.getV1() == vertice || el.getV2() == vertice)
        matrizIncidencia[vertice][i] = ((valorado) ? el.getValor() : 1);
    });
  });
}

function gerarMatrizAdjacencia() {
  matrizAdjacencia = [];

  listaVertices.forEach(v1 => {
    listaVertices.forEach(v2 => {
      listaAresta.forEach(item => {
        let val = (item.getV1() == v1 && item.getV2() == v2) ? 1 : 0;

        insereMatriz(matrizAdjacencia, (orientado && item.getOrientado() == 1) ? val : ((valorado) ? item.getValor() : val), v1, v2);

        if (item.getOrientado() != 1 && v1 != v2)
          insereMatriz(matrizAdjacencia, (valorado) ? item.getValor() : val, v2, v1);
      });
    });
  });
}

function gerarListaAdjacencia() {
  listaAdjacencia = [];

  listaVertices.forEach(val => {
    let listaItemAdjacencia;

    listaAdjacencia[val] = [];
    listaItemAdjacencia = listaAdjacencia[val];

    listaAresta.forEach(item => {
      if (item.getV1() == val)
        if (orientado || !(item.getV2() in listaItemAdjacencia))
          listaItemAdjacencia.push(item.getV2());

      if (item.getOrientado() == 0 && item.getV2() == val)
        if (orientado || !(item.getV1() in listaItemAdjacencia))
          listaItemAdjacencia.push(item.getV1());
    });
  });
}

function insereMatriz(matriz, val, pos1, pos2) {
  if (pos1 in matriz)
    if (pos2 in matriz[pos1])
      matriz[pos1][pos2] += val;
    else
      matriz[pos1][pos2] = val;
  else {
    matriz[pos1] = [];
    matriz[pos1][pos2] = val;
  }
}

function listaArestaItem(ver1, ver2, valor, orientado) {
  var v1 = ver1,
    v2 = ver2,
    val = valor,
    ori = orientado;

  this.getV1 = function () { return v1 };
  this.setV1 = function (valor) { v1 = valor };

  this.getV2 = function () { return v2 };
  this.setV2 = function (valor) { v2 = valor };


  this.getValor = function () { return val };
  this.setValor = function (valor) { val = valor };

  this.getOrientado = function () { return ori };
  this.getOrientadoString = function () { return (ori == 1) ? 'Sim' : 'Não' };
  this.setOrientado = function (valor) { ori = valor };
}

function limpaDiv(div) {
  while (div.firstChild)
    div.removeChild(div.firstChild);
}

function dijkstra(inicio) {
  var vertices = [],
    distancia = [],
    caminho = [],
    adjacentes,
    vertice,
    arestas,
    index, indexAtual, arestaMenor;

  for (let i = 0; i < listaVertices.length; i++) {
    vertices.push([listaVertices[i], true]);
    distancia.push((inicio != listaVertices[i]) ? Infinity : 0);
    caminho.push(null);
  }

  while (faltaVerificar(vertices)) {
    vertice = verticeMenorDistancia(distancia, vertices);
    indexAtual = listaVertices.indexOf(vertice);
    vertices[indexAtual][1] = false;
    adjacentes = listaAdjacencia[vertice];

    adjacentes.forEach(adjacente => {
      index = listaVertices.indexOf(adjacente);
      arestas = listaAresta.filter(la => la.getV1() == adjacente || (la.getV2() == adjacente && (!orientado || (orientado && la.getOrientado() != 1))));
      arestaMenor = arestaMenorValor(arestas);

      let dist = ((valorado) ? arestaMenor.getValor() : 1) + distancia[indexAtual];

      if (distancia[index] > dist) {
        distancia[index] = dist;
        caminho[index] = adjacente;
      }
    });
  }

  dijkstraList = [];

  vertices.forEach((vertice, i) => {
    dijkstraList.push([vertice[0], distancia[i], caminho[i]]);
  });
}

/* function dijkstra(inicio) {
  var vertices = [],
    distancia = [],
    caminho = [],
    adjacentes,
    vertice,
    arestas,
    index, indexAtual, arestaMenor;

  for (let i = 0; i < listaVertices.length; i++) {
    vertices.push([listaVertices[i], true]);
    distancia.push((inicio != listaVertices[i]) ? Infinity : 0);
    caminho.push(null);
  }

  while (faltaVerificar(vertices)) {
    vertice = verticeMenorDistancia(distancia, vertices);
    indexAtual = listaVertices.indexOf(vertice);
    vertices[indexAtual][1] = false;
    adjacentes = listaAdjacencia[vertice];

    adjacentes.forEach(adjacente => {
      index = listaVertices.indexOf(adjacente);
      arestas = listaAresta.filter(la => la.getV1() == adjacente || (la.getV2() == adjacente && (!orientado || (orientado && la.getOrientado() != 1))));
      arestaMenor = arestaMenorValor(arestas);

      let dist = ((valorado) ? arestaMenor.getValor() : 1) + distancia[indexAtual];

      if (distancia[index] > dist) {
        distancia[index] = dist;
        caminho = vertice;
      }
    });
  }
} */

function verticeMenorDistancia(distancia, vertices) {
  var valMenor = Infinity,
    menor;

  for (let i = 0; i < distancia.length; i++) {
    if (distancia[i] <= valMenor && vertices[i][1]) {
      valMenor = distancia[i];
      menor = listaVertices[i];
    }
  }

  return menor;
}

function arestaMenorValor(arestas) {
  menor = Infinity;
  arestaMenor = null;

  arestas.forEach(aresta => {
    let val = (valorado) ? aresta.getValor() : 1;
    
    if (menor > val) {
      menor = val;
      arestaMenor = aresta;
    }
  });

  return arestaMenor;
}

function faltaVerificar(vertices) {
  var achou = false;

  for (let i = 0; i < vertices.length; i++)
    if (vertices[i][1])
      return true;

  return achou;
}

window.onload = function () {
  document.getElementById('btnEnviar').addEventListener('click', function () {
    orientado = document.getElementById('checkOrientado').checked;
    valorado = document.getElementById('checkValorado').checked;
    listaAresta = [];
    listaVertices = [];
    listaAdjacencia = [];
    matrizAdjacencia = [];
    matrizIncidencia = [];
    dijkstraList = [];

    gerarListaAresta();
    gerarListaVertices();
    gerarListaAdjacencia();
    gerarMatrizAdjacencia();
    gerarMatrizIncidencia();

    gerarHtmlListaAresta();
    gerarHtmlMatrizAdjacencia();
    gerarHtmlListaAdjacencia();
    gerarHtmlMatrizIncidencia();

    document.getElementById("dijkstraTab").classList.remove("disabled");
  });
}