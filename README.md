# Tree Visualizer
Esta página fue desarrollada para aquellos interesados en visualizar de manera gráfica el funcionamiento de los métodos mas característicos de los árboles mas utilizados. 

Los árboles desarrollados son:
 
 * **Árboles**
	- BST (Binary Search Tree)
	- AVL Tree (Adelson-Velsky and Landis)
	- RBT (Red Black Tree)
	 - Max Heap
	 - Min Heap
	 - Treap
  
Para facilitar el aprendizaje, cada uno de los mismos cuenta con:

* **Explicación**
  - Introducción
  	- Estructura y reglas
  - Metodos
 	 - Add
 	 - Search
 	 - Find min
  	-  Find max
  	- Delete
  
* **Código**: El desarrollo fue realizado en Python. La visualización del mismo puede ser realizada a través de una theme "Dark" o "Light" según el usuario lo decida. Por otra parte, se permite la copia de la totalidad del código al presionar el boton asociado.

### Configuración
Para personalizar la experiencia a las preferencias de cada usuario, a través del apartado de configuración se permite:

* **Inicialización del arbol**: Se permite la generación de un árbol default que contendrá una altura igual a la indicada en el input. 
* **Establecer velocidad de ejecución**: Existen 5 velocidades posibles que determinan el delay que existe entre cada paso durante la ejecución automática, en donde a cuanto menor sea la velocidad mayor será el delay.
* **Elección del metodo a correr**: Los metodos disponibles son
	- Add
	- Search
	- Delete (Reemplazado por PopMin en la MinHeap y por PopMax en la MaxHeap)
	- Find Min
	- Find Max

### Restricciones
Las restricciones aplicadas son las siguientes:
- **Restricción de altura**: Teniendo en cuenta que la cantidad de nodos escala de manera exponencial con el incremento de la altura del árbol  y que el tamaño de la pantalla es limitado; en pos de mantener la estructura caracteristica del árbol y garantizar que el tamaño de los nodos sea el suficiente para asegurar una grata experencia se decidió colocar el limite en cuanto a la altura del árbol en la cuarta capa, permitiendo por ende un total de 31 nodos como valor máximo.
- **Restricción de valores**: Para evitar que el tamaño de los nodos crezca de manera innecesaria al tener que adaptarse a valores enteros desproporcionados, el rango de valores permitidos son todos aquellos enteros mayores a -99 y menores a 999.
