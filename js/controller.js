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
          matrizIncidencia[vertice][i] = ((valorado) ? el.getValor() : 1);
        } else if (el.getV2() == vertice) {
          matrizIncidencia[vertice][i] = ((valorado) ? el.getValor() : 1) * -1;
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

        if (valorado)
          val = (val == 1) ? item.getValor() : 0;

        insereMatriz(matrizAdjacencia, val, v1, v2);

        if (v1 != v2)
          insereMatriz(matrizAdjacencia, val, v2, v1);
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

      if (!orientado && item.getV2() == val)
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

function listaArestaItem(ver1, ver2, valor) {
  var v1 = ver1,
    v2 = ver2,
    val = valor;

  this.getV1 = function () { return v1 };
  this.setV1 = function (valor) { v1 = valor };

  this.getV2 = function () { return v2 };
  this.setV2 = function (valor) { v2 = valor };


  this.getValor = function () { return val };
  this.setValor = function (valor) { val = valor };
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
      arestas = listaAresta.filter(la => la.getV1() == adjacente || (la.getV2() == adjacente && !orientado));
      arestaMenor = arestaMenorValor(arestas);

      let dist = ((valorado) ? arestaMenor.getValor() : 1) + distancia[indexAtual];
      
      if (distancia[index] > dist) {
        distancia[index] = dist;
        caminho[index] = (arestaMenor.getV1() == adjacente) ? arestaMenor.getV2() : arestaMenor.getV1();
      }
    });
  }

  dijkstraList = [];

  vertices.forEach((vertice, i) => {
    dijkstraList.push([vertice[0], distancia[i], caminho[i]]);
  });
}

function kruskal() {
  var verticesResultado = [],
    verticesExistentes = [];

  listaAresta.sort((a, b) => a.getValor() - b.getValor());

  listaAresta.forEach(v => {
    let v1 = verticesExistentes.indexOf(v.getV1()), v2 = verticesExistentes.indexOf(v.getV2());

    if (v1 < 0 || v2 < 0) {
      verticesResultado.push(v);

      if (v1 < 0) verticesExistentes.push(v.getV1());
      if (v2 < 0) verticesExistentes.push(v.getV2());
    }
  });

  kruskalList = verticesResultado;
}

function prim() {
  var vertices = [],
    listaFinal = [],
    vertice, verticeAtual,
    arestas,
    index, indexAtual;

  for (let i = 0; i < listaVertices.length; i++) {
    vertices.push([listaVertices[i], true, (i != 0) ? Infinity : 0]);
    listaFinal.push(null);
  }

  while (faltaVerificar(vertices)) {
    verticeAtual = menorVertice(vertices);
    indexAtual = listaVertices.indexOf(verticeAtual);
    vertices[indexAtual][1] = false;
    arestas = listarArestasPorVertice(vertices[indexAtual][0]);

    arestas.forEach(aresta => {
      if (aresta.getV1() != aresta.getV2()) {
        vertice = (aresta.getV1() != verticeAtual) ? aresta.getV1() : aresta.getV2();
        index = encontraIndex(vertice, vertices);   

        if (vertices[index][1] && vertices[index][2] > aresta.getValor()) {
          vertices[index][2] = aresta.getValor();
          listaFinal[index] = aresta;  
        }
      }
    });
  }

  primList = listaFinal;
}

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

function listarArestasPorVertice(vertice) {
  return listaAresta.filter(a => a.getV1() == vertice || a.getV2() == vertice);
}

function faltaVerificar(vertices) {
  var achou = false;

  for (let i = 0; i < vertices.length; i++)
    if (vertices[i][1])
      return true;

  return achou;
}

function encontraIndex(vertice, lista) {
  for (let i = 0; i < lista.length; i++) 
    if (lista[i][0] == vertice) 
      return i;
}

function menorVertice(lista){
  let menor = Infinity,
    vertice = lista[0][0];

  for (let i = 0; i < lista.length; i++)
    if (lista[i][1] && lista[i][2] < menor) {
      menor = lista[i][2];
      vertice = lista[i][0];
    }
  
    return vertice;
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
    kruskalList = [];
    primList = [];

    gerarListaAresta();
    gerarListaVertices();
    gerarListaAdjacencia();
    gerarMatrizAdjacencia();
    gerarMatrizIncidencia();

    kruskal();
    prim();

    gerarHtmlListaAresta();
    gerarHtmlMatrizAdjacencia();
    gerarHtmlListaAdjacencia();
    gerarHtmlMatrizIncidencia();
    gerarHtmlKruskal();
    gerarHtmlPrim();

    document.getElementById("dijkstraTab").classList.remove("disabled");
  });

  document.getElementById('btnDijkstra').addEventListener('click', function () {
    let val = document.getElementById('inputDijkstra').value,
       n = Math.floor(Number(val));

    if(n !== Infinity && String(n) === val && n >= 0) {
      dijkstra(n);
      gerarHtmlDijkstra();
    } else {
      alert('Insira um valor válido');
    }
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
 */