# PAC-MAN 3D

Uma versão do clásico jogo Pac-Man reimaginada num mundo 3D. Desenvolvido completamente com JavaScript e WebGL.

## 1- Gameplay
Descrição

## 2- Estrutura do Projeto
### 2.1- Scene

### 2.2- Entities

### 2.3- Objects

### 2.4- Tools
#### 2.4.1- M4.js
A classe responsável por lidar com as matrizes 4x4. Aplica transformações como translação, escala, rotação e multiplicação

#### 2.4.2- Pathfinder.js
Classe utilitária que gera caminhos entre dois pontos. É usada pelos inimigos para perseguir o jogador.

- **getClosestCell() -> Array[2]**: Transforma uma coordenada global (x, y, z) em coordenadas no plano XZ de valores inteiros.
- **findPathBFS(start, goal, navigationMap, simplify = true) -> Array[ ]**: Implementação do algoritmo de busca em largura.

#### 2.4.3- PixelInterpreter.js
Responsável por ler a imagem geradora do mapa e acessar o valor das cores de cada pixel.

- **loadMap(url) -> Array[ ][ ]**: Retorna uma matriz de pixels RGBA baseada na imagem passada.

### 2.5- React