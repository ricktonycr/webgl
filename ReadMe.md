# Sala Virtual
El desarrollo presenta una sala virtual donde se pueden arrastrar determinados onjetos para ser representados en la escena. Es posible mover cada uno de los objetos, ser intercambiados por algunas opciones ya preestablecidas, mostrar información adicional de cada objeto al hacer click, acercar o alejar la escena para una mejor visualización, cambiar de color los fondos independientes y descargar una captura de la escena realizada hasta el momento.

![Captura](images/captura.png)

## Modo de Uso
### Estructura básica del HTML
Cada uno de los objetos que se requiere sean arrastrados deben cumplir con la siguiente estructura.

```html
<img src="images/arc1.png" class="ItemImage" draggable="true"
  id="109" 
  data-size="4.0" 
  data-url1="images/arc1.png"
  data-url2="images/arc2.png"
  data-url3="images/arc3.png"
  data-url4="images/arc4.png"
  data-url5="images/arc5.png"
  data-name="alfombra"
  data-price="1890,00"
  data-mesures="80cm x 74cm x 70cm "
  data-y="20"
  data-z="30"
  ondragstart="drag(event)">