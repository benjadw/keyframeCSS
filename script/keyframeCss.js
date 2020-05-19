// KeyframeCss lib!!!

// Author: benjadw
// E-mail: benjadw@gmail.com

// En esta librería obtendremos animaciones para los elementos del dom, basadas en el scroll de la página haciendo uso de keyframes.
// Desde el punto de vista de los keyframes, el tiempo sería la posición en el scroll.


// Example use:

// // Add this code to another script

// exampleElement = document.querySelector('#exampleElement'); // Get the elements to add keyframes to
// exampleElement2 = document.querySelector('#exampleElement2');

// var keyframes = new Keyframes({
//   size: 8000, // Set de min-height to the body
//   timeType: 'pixels', // Set keyframes time unit ('pixels', 'percent')
//   elementKeyframes: [ // list of elements with keyframes
//       {
//           element: exampleElement, // Add an html element
//           keyframeList: [ // List of keyframes for this element
//               {
//                   time: 1000, // Time the keyframe is set
//                   top: '200px',// style rules like you use in javascript
//                   color: '#ffffff',
//                   left: '200px'

//               },
//               {
//                   time: 3000,
//                   top: '100px',
//                   left: '500px',
//                   background: '#771199'

//               },
//               {
//                   time: 1500,
//                   top: '300px',
//                   color: '#333333',
//                   background: '#000000'
//                   // left: 500

//               }
//           ]
//       },
//       {
//           element: exampleElement2,
//           keyframeList: [
//               {
//                   time: 0,
//                   top: '200px',
//                   color: '#4590ff',
//                   left: '0',
//                   transform: 'rotate(0)'

//               },
//               {
//                   time: 3000,
//                   top: '100px',
//                   left: '200px',
//                   background: '#ff0077',
//                   transform: 'rotate(300deg)'


//               },
//               {
//                   time: 1500,
//                   top: '800px',
//                   color: '#333333',
//                   background: '#000000'
//               }
//           ]
//       }
//   ]
// });

var Keyframes = function (options) {
  "use strict";

  this.timeType = 'pixels'; // Se establece si el tiempo de la animación se medirá en píxeles o en porcentaje
  this.size = 'auto'; // Se puede establecer el tamaño mínimo del body
  this.classCount = 0; // Contador para los identificadores de las clases que se van ha añadir
  this.elementKeyframes = null; // Variable con los elementos que tienen keyframes asignados
  this.elementKeyframesCopy = null; // Variable con los elementos que tienen keyframes asignados
  this.keyframeList;

  // Hace una copia de el objeto de los keyframes para no perder la información tras las conversiones de datos.
  this.copyElementKeyframe = function () {
    this.elementKeyframesCopy = [];

    this.elementKeyframes.forEach((keyframe, i) => {
      this.elementKeyframesCopy.push({ keyframeList: [] });
      keyframe.keyframeList.forEach((keyframeItem, j) => {
        this.elementKeyframesCopy[i].keyframeList.push(Object.assign({}, keyframeItem));
      });
    });
  }

  // Transforma las posiciones de los keyframes de porcentaje a píxeles
  this.parseTimeUnit = function () {
    let extraTimeBottomTimeLine = 0;
    let noPercent = 0;
    let noPixels = 0;
    let elementOffsetExtraTime = 0;
    if (options.timeLine && options.timeLine === 'bottom') {
      extraTimeBottomTimeLine = -window.innerHeight;
    }

    if (options.timeType && options.timeType !== 'percent') {
      noPercent = 0;
      noPixels = 1;
    } else {
      noPercent = 1;
      noPixels = 0;
    }

    this.elementKeyframes.forEach((keyframe, i) => {
      if (keyframe.elementOffset) {
        elementOffsetExtraTime = keyframe.elementOffset.offsetTop;
      } else {
        elementOffsetExtraTime = 0;
      }
      keyframe.keyframeList.forEach((keyframeItem, j) => {
        keyframeItem.time = (noPixels * (this.elementKeyframesCopy[i].keyframeList[j].time + extraTimeBottomTimeLine + elementOffsetExtraTime)) + (noPercent * (extraTimeBottomTimeLine + elementOffsetExtraTime + (document.body.scrollHeight * this.elementKeyframesCopy[i].keyframeList[j].time / 100)));
      });
    });
  }

  // Ordena los keyframes por el momento en el que se suceden
  this.sortKeyframes = function (a, b) {
    if (a.time > b.time) {
      return 1;
    }
    if (a.time < b.time) {
      return -1;
    }
    return 0;
  }


  // Metodo que se activa onScroll
  this.scrollAction = function () {
    // Se realizan las operaciones sobre el estilo para cada elemento 
    this.elementKeyframes.forEach(keyframe => this.setKeyframeStyles(keyframe, window.scrollY));
  }

  // Este método es el que realiza el cambio de estilo para cada elemento en cada momento/scroll-position
  this.setKeyframeStyles = function (keyframe, scroll) {
    const keyframeList = keyframe.keyframeList;

    let startPointIndex = null; // Punto de inicio de una animación
    let endPointIndex = null; // Punto final de una animación
    let totalFramesAnimation = null; // Número total de frames de la animación
    let scrollTimeAnimation = null; // Posición del scroll relativa al intervalo de la animación
    let animationCurrentValue = null; // Valor actual del estilo en la animación

    // Se descarta que no haya más de un keyframe
    if (keyframeList?.length > 1) {
      let propsArray = []; // Array que contendrá todas las propiedades de estilo que hay en todos los keyframes de este elemento
      keyframe.element.removeAttribute("style"); // Se eliminan las reglas de estilo anteriormente añadidas a este elemento

      // Se obtienen las todas las propiedades de todos los keyframes
      keyframeList.forEach(keyframe => { propsArray.push(...Object.keys(keyframe).filter(prop => !propsArray.includes(prop) && prop != 'time')) });

      // Para cada propiedad existente en algún keyframe del elemento se realizan los cálculos de estilo
      propsArray.forEach(k => {
        startPointIndex = this.getStartPointIndex(keyframeList, k, scroll); // Se obtienen el keyframe anterior al momento actual para esta propiedad de estilo
        endPointIndex = this.getEndPointIndex(keyframeList, k, scroll); // Se obtienen el keyframe posterior al momento actual para esta propiedad de estilo

        // Se comprueba si esta propiedad de estilo en este momento del scroll tiene keyframes inicial y final
        if (endPointIndex !== -1 && startPointIndex !== undefined && startPointIndex !== -1) {

          // Se obtiene el valor de la propiedad de los keyframes incial y final
          const startData = eval('keyframeList[startPointIndex].' + k);
          const endData = eval('keyframeList[endPointIndex].' + k);
          // Se obtiene la parte no númerica del valor de la propiedad de los keyframes incial y final
          const startUnit = startData.replace(/\d|\./gi, '');
          const endUnit = endData.replace(/\d|\./gi, '');
          // Se obtiene el valor numérico de la propiedad de los keyframes incial y final
          const startValueStr = startData.replace(/[a-zA-Z]|#|\(|\)/gi, '');
          const endValueStr = endData.replace(/[a-zA-Z]|#|\(|\)/gi, '');

          let startValue = +startValueStr;
          let endValue = +endValueStr;

          let unitSelected = ''; // Parte no númerica del valor de la propiedad del keyframe inicial y final con más caracteres (ya que esa es la medida que emplearemos al setear el estilo pues hay casos en los que no hace falta poner la unidad de medida como con el 0... esa parte no númerica no nos interesa)

          totalFramesAnimation = keyframeList[endPointIndex]?.time - keyframeList[startPointIndex]?.time; // Tiempo total del intervalo de animación
          scrollTimeAnimation = scroll - keyframeList[startPointIndex]?.time; // Tiempo transcurrido desde el keyframe inicial (en este intervalo)

          // Se obtiene la parte no númerica con más caracteres
          if (startUnit.length > endUnit.length) {
            unitSelected = startData;
          } else {
            unitSelected = endData;
          }
          // Se diferencia el cálculo del estilo en la animación para cuando es un color
          if (startUnit.includes('#')) {
            // Se obtienen los colores primarios por separado en base 10
            const rgbStartValues = this.hexToRgb(startData);
            const rgbEndValues = this.hexToRgb(endData);
            // Se calcula el color en base a la posición del scroll respecto a los keyframes
            const redAnimationCurrentValue = ((rgbEndValues.r - rgbStartValues.r) / (totalFramesAnimation / scrollTimeAnimation)) + rgbStartValues.r;
            const greenAnimationCurrentValue = ((rgbEndValues.g - rgbStartValues.g) / (totalFramesAnimation / scrollTimeAnimation)) + rgbStartValues.g;
            const blueAnimationCurrentValue = ((rgbEndValues.b - rgbStartValues.b) / (totalFramesAnimation / scrollTimeAnimation)) + rgbStartValues.b;
            const finalValueHex = this.rgbToHex(redAnimationCurrentValue, greenAnimationCurrentValue, blueAnimationCurrentValue);
            eval('keyframe.element.style.' + k + '= finalValueHex'); // Se añade el estilo calculado
          } else {
            if (endValueStr !== '' && startValueStr !== '') {

              // Aquí se hace el cálculo del valor de la animación basado en la posición del scroll
              animationCurrentValue = ((endValue - startValue) / (totalFramesAnimation / scrollTimeAnimation)) + startValue;

              animationCurrentValue = unitSelected.replace(/\d*\.?\d+/gi, animationCurrentValue); // Se obtiene la cadena a añadir en la regla de estilo
            } else {
              animationCurrentValue = startData;
            }
            // Se añade la regla de estilo pertinente
            eval('keyframe.element.style.' + k + '= animationCurrentValue');
          }
        }
      });
    }
  }

  // Obtiene por separado los colores en base 10 a partir de la cadena hexadecimal
  this.hexToRgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Transforma el valor de cada color a base hexadecimal
  this.componentToHex = function (c) {
    const a = Math.round(c);
    var hex = a.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  // Devuelve el color completo en hexadecimal
  this.rgbToHex = function (r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  // Obtiene el índice del keyframe inicial de esta animación, teniendo en cuenta el scroll actual y la propiedad a animar.
  this.getStartPointIndex = function (keyframeList, prop, currentScroll) {
    let startPointIndex;
    keyframeList.forEach((keyframe, i) => {
      if (keyframe.hasOwnProperty(prop) && keyframe.time <= currentScroll) {
        startPointIndex = i;
      }
    })

    return startPointIndex;
  }

  // Obtiene el índice del keyframe final de esta animación, teniendo en cuenta el scroll actual y la propiedad a animar.
  this.getEndPointIndex = function (keyframeList, prop, currentScroll) {
    const endPointIndex = keyframeList.findIndex(keyframe => keyframe.hasOwnProperty(prop) && keyframe.time > currentScroll);
    return endPointIndex;
  }

  // Se inicializa la aplicación
  this.init = function () {
    this.size = options?.size;
    if (this.size !== undefined) {
      document.body.style.minHeight = this.size + 'px';
    }
    this.timeType = options?.timeType ? options.timeType : 'pixels';
    this.elementKeyframes = options.elementKeyframes;

    this.elementKeyframes.forEach(keyframe => {
      keyframe.keyframeList = keyframe.keyframeList.sort(this.sortKeyframes); // Se ordenan los keyframes para facilitar la obtención de los intervalos de animación    });
    });
    this.copyElementKeyframe();
    this.parseTimeUnit();
    window.addEventListener('scroll', ev => this.scrollAction());
    window.addEventListener('resize', ev => this.parseTimeUnit());
    this.scrollAction();
  }

  this.init();

};

// Exporta la clase para usarlo como librería externa
if (typeof module !== "undefined" && module.exports) {
  module.exports = Keyframes;
}