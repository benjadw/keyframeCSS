// KeyframeCss lib!!!

// Author: benjadw
// E-mail: benjadw@gmail.com

// En esta librería obtendremos animaciones para los elementos del dom, basadas en el scroll de la página haciendo uso de keyframes.
// Desde el punto de vista de los keyframes, el tiempo sería la posición en el scroll.




// MODEL options: 
// {
//   size?: number; // Set de min-height to the body
//   timeType?: string; // Set keyframes time unit ('pixels', 'percent')
//   elementKeyframes: [ // list of elements with keyframes
//       {
//           element: HTMLElement; // Add an html element
//           elementOffset?: HTMLElement; // timeline from elementOffset position
//
//           keyframeList: [ // List of keyframes for this element
//               {
//                   time: number; // Time the keyframe is set
//                   [ruleStyleName]: string;// style rules like you use in css. Property as string if use "-".
//               }
//           ]
//       }
//   ]
// };
var lastScroll;
var Keyframes = function (options) {
  "use strict";

  this.myWorker;
  this.timeType = 'pixels'; // Se establece si el tiempo de la animación se medirá en píxeles o en porcentaje
  this.size = 'auto'; // Se puede establecer el tamaño mínimo del body
  this.elementKeyframes = null; // Variable con los elementos que tienen keyframes asignados
  this.elementKeyframesCopy = null; // Variable con los elementos que tienen keyframes asignados
  this.keyframeList;
  this.idCount = 0;
  this.styleElem;
  this.stylesStr = '';

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

  // Transforma las posiciones de los keyframes (time) de porcentaje a píxeles
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
        keyframeItem.time = (noPixels * (this.elementKeyframesCopy[i].keyframeList[j].time + extraTimeBottomTimeLine + elementOffsetExtraTime)) + (noPercent * (extraTimeBottomTimeLine + elementOffsetExtraTime + ((document.body.scrollHeight - window.innerHeight) * this.elementKeyframesCopy[i].keyframeList[j].time / 100)));
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



  // Obtiene toda la información posible que se pueda calcular y la añade en el objeto original. Así se reducen todas las operaciones posibles en el scroll

  //Modelo de keyframeItem (uno de los keyframes del elemento html):

  // {
  //   ...
  //   nextTime: number;
  //   preCalcs: [
  //     {
  //       hasNextKeyframe: boolean;
  //       noChangeValue: boolean;
  //       multipleValue: boolean;
  //       isColorValue: boolean;
  //       totalFramesAnimation: number;
  //       startTime: Number;
  //       nextTime: Number;
  //       propName: String;
  //       startTime: number;
  //       values: [
  //         {
  //           hasNumberValue: boolean;
  //           isColor: boolean;
  //           startValue: number;
  //           unitSelected: string;
  //           valueIncrement: number;
  //         }
  //       ]
  //     }
  //   ]
  // }
  this.addCalculateRating = function () {
    let propsArrayTemp = [];
    this.idCount = 0;
    this.elementKeyframes.forEach(keyframe => {
      keyframe.element.classList.add('keyframeCSSId' + this.idCount);
      keyframe.classList = 'keyframeCSSId' + this.idCount;
      this.idCount++;
      keyframe.keyframeList.forEach(keyframe => { propsArrayTemp.push(...Object.keys(keyframe).filter(prop => !propsArrayTemp.includes(prop) && prop != 'time' && prop != 'nextTime' && prop != 'preCalcs')) });
      keyframe.keyframeList.forEach((keyframeItem, i) => {
        let startPointIndex;
        let endPointIndex;
        if (keyframe.keyframeList.length > i + 1) {
          keyframeItem.nextTime = keyframe.keyframeList[i + 1].time;
        }

        keyframeItem.preCalcs = [];
        propsArrayTemp.forEach(k => {
          let totalFramesAnimation = null; // Número total de frames de la animación
          let precalcObj = { propName: k };
          startPointIndex = this.getStartPointIndex(keyframe.keyframeList, k, keyframeItem.time);
          endPointIndex = this.getEndPointIndex(keyframe.keyframeList, k, keyframeItem.time);


          // Se comprueba si esta propiedad de estilo en este momento del scroll tiene keyframes inicial y final
          if (endPointIndex !== -1 && startPointIndex !== undefined && startPointIndex !== -1) {
            precalcObj.hasNextKeyframe = true;
            precalcObj.startTime = keyframe.keyframeList[startPointIndex].time;
            precalcObj.nextTime = keyframe.keyframeList[endPointIndex].time;
            // Se obtiene el valor de la propiedad de los keyframes incial y final
            const startData2 = keyframe.keyframeList[startPointIndex][k];
            const endData = keyframe.keyframeList[endPointIndex][k];

            // Se evitan cálculos innecesarios si el valor inicial y final de la animación son iguales
            if (startData2 === endData) {
              precalcObj.noChangeValue = true;
              precalcObj.initialValue = startData2;

              // keyframe.element.style[k] = startData2; TODO: COMPROBAR SI HAY QUE QUITARLO
            } else {
              precalcObj.noChangeValue = false;
              const startData2Temp = startData2.replace(/(\s|,)/gi,'&$1');
              const endMultipleDataTemp = endData.replace(/(\s|,)/gi,'&$1');
              const startMultipleData = startData2Temp.split('&'); // Con esta constante se comprueba si hay más de un valor
              const endMultipleData = endMultipleDataTemp.split('&');

              totalFramesAnimation = keyframe.keyframeList[endPointIndex]?.time - keyframe.keyframeList[startPointIndex]?.time; // Tiempo total del intervalo de animación
              precalcObj.totalFramesAnimation = totalFramesAnimation;
              // Se comprueba si hay más de un valor para la regla de estilo (por ejemplo, transform: rotate(90deb) scale(1.5))
              if (startMultipleData.length > 1) {
                precalcObj.multipleValue = true;
              } else {
                precalcObj.multipleValue = false;
              }

              precalcObj.values = [];

              // Se realizan los cálculos oportunos para cada valor de la regla de estilo !! importante que los valores estén en el mismo orden en los keyframes
              startMultipleData.forEach((singleStartData, i) => {
                // Se obtiene la parte no númerica del valor de la propiedad de los keyframes incial y final
                const startUnit = singleStartData.replace(/\d(?!d)|\./gi, '');
                const endUnit = endMultipleData[i].replace(/\d(?!d)|\./gi, '');
                // Se obtiene el valor numérico de la propiedad de los keyframes incial y final
                const startValueStr = singleStartData.replace(/[a-zA-Z]|#|\(|\)|\%|\d(?=d\()|\s|,/gi, '');
                const endValueStr = endMultipleData[i].replace(/[a-zA-Z]|#|\(|\)|\%|\d(?=d\()|\s|,/gi, '');

                let startValue = +startValueStr;
                let endValue = +endValueStr;

                let unitSelected = ''; // Parte no númerica del valor de la propiedad del keyframe inicial y final con más caracteres (ya que esa es la medida que emplearemos al setear el estilo pues hay casos en los que no hace falta poner la unidad de medida como con el 0... esa parte no númerica no nos interesa)

                // Se obtiene la parte no númerica con más caracteres
                if (startUnit.length > endUnit.length) {
                  unitSelected = singleStartData;
                } else {
                  unitSelected = endMultipleData[i];
                }
                // Se diferencia el cálculo del estilo en la animación para cuando es un color
                if (startUnit.includes('#')) {
                  // Se obtienen los colores primarios por separado en base 10
                  const rgbStartValues = this.hexToRgb(singleStartData);
                  const rgbEndValues = this.hexToRgb(endMultipleData[i]);

                  precalcObj.values.push({
                    redStartValue: rgbStartValues.r,
                    redValueIncrement: rgbEndValues.r - rgbStartValues.r,
                    greenStartValue: rgbStartValues.g,
                    greenValueIncrement: rgbEndValues.g - rgbStartValues.g,
                    blueStartValue: rgbStartValues.b,
                    blueValueIncrement: rgbEndValues.b - rgbStartValues.b,
                    isColor: true,
                    unitSelected: unitSelected
                  });
                } else {
                  if (endValueStr !== '' && startValueStr !== '') {
                    precalcObj.values.push({
                      startValue: startValue,
                      valueIncrement: endValue - startValue,
                      isColor: false,
                      hasNumberValue: true,
                      unitSelected: unitSelected
                    });
                  } else {
                    precalcObj.values.push({
                      hasNumberValue: false,
                      unitSelected: unitSelected
                    });
                  }
                }
              });
            }
          } else {
            precalcObj.hasNextKeyframe = false;

          }
          keyframeItem.preCalcs.push(precalcObj);
        });
      })
    });

  }


  // Metodo que se activa onScroll
  this.scrollAction = function (obj) {

    if (lastScroll !== window.scrollY) {
      let workerData = { elementKeyframes: obj.elementKeyframes, scroll: window.scrollY };
      // Se realizan las operaciones sobre el estilo en el worker
      this.myWorker.postMessage(JSON.stringify(workerData));
      lastScroll = window.scrollY;
    }
    window.requestAnimationFrame(() => obj.scrollAction(obj));
  }

  // Obtiene por separado los colores en base 10 a partir de la cadena hexadecimal
  this.hexToRgb = function (hex) {
    hex = hex.replace(/(\s|,)/gi,'');
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
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
    this.styleElem = document.createElement('style');
    document.body.appendChild(this.styleElem);
    this.myWorker = new Worker("/keyframeCSS/keyframeCssWorker.js");
    this.myWorker.addEventListener("message", oEvent => {
      this.styleElem.innerHTML = oEvent.data;
    }, false);
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
    this.addCalculateRating();
    window.requestAnimationFrame(() => this.scrollAction(this));
    window.addEventListener('resize', ev => { this.parseTimeUnit(); this.addCalculateRating() });
  }

  this.init();



  (function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();


};

// Exporta la clase para usarlo como librería externa
if (typeof module !== "undefined" && module.exports) {
  module.exports = Keyframes;
}
