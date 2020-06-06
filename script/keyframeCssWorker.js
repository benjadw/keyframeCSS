
let stylesStr = '';

onmessage = function (oEvent) {
  data = JSON.parse(oEvent.data);
  callWorker(data.elementKeyframes,data.scroll);
};




function callWorker(elementKeyframes, scroll) {
  stylesStr = '';
  elementKeyframes.forEach(keyframe => setKeyframeStyles(keyframe, scroll));
  postMessage(stylesStr);
}
// Transforma el valor de cada color a base hexadecimal
componentToHex = function (c) {
  const a = Math.round(c);
  var hex = a.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}


// Devuelve el color completo en hexadecimal
rgbToHex = function (r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


// Este método es el que realiza el cambio de estilo para cada elemento en cada momento/scroll-position
setKeyframeStyles = function (keyframe, scroll) {
  const keyframeList = keyframe.keyframeList;

  let scrollTimeAnimation = null; // Posición del scroll relativa al intervalo de la animación
  let animationCurrentValue = null; // Valor actual del estilo en la animación

  // Se descarta que no haya más de un keyframe
  if (keyframeList?.length > 1) {
    stylesStr += '.' + keyframe.classList + '{';
    // Para cada propiedad existente en algún keyframe del elemento se realizan los cálculos de estilo
    keyframeList.forEach(keyframeItem => {
      if (keyframeItem.time <= scroll && keyframeItem.nextTime > scroll) {
        keyframeItem.preCalcs.forEach(preCalc => {
          // Se comprueba si esta propiedad de estilo en este momento del scroll tiene keyframes inicial y final
          if (preCalc.hasNextKeyframe && preCalc.startTime <= scroll && preCalc.nextTime > scroll) {
            // Se evitan cálculos innecesarios si el valor inicial y final de la animación son iguales
            if (preCalc.noChangeValue) {
              stylesStr += preCalc.propName + ':' + preCalc.initialValue + ' !important;';
            } else {
              // Se comprueba si hay más de un valor para la regla de estilo (por ejemplo, transform: rotate(90deb) scale(1.5))
              if (preCalc.multipleValue) {
                let finalValueMultiple = ''; // Se obtendrá la concatenación de los valores para regla de estilo

                // Se realizan los cálculos oportunos para cada valor de la regla de estilo !! importante que los valores estén en el mismo orden en los keyframes
                preCalc.values.forEach(valueObj => {
                  scrollTimeAnimation = scroll - preCalc.startTime; // Tiempo transcurrido desde el keyframe inicial (en este intervalo)
                  if (valueObj.isColor) {
                    // Se calcula el color en base a la posición del scroll respecto a los keyframes
                    const redAnimationCurrentValue = (valueObj.redValueIncrement / (preCalc.totalFramesAnimation / scrollTimeAnimation)) + valueObj.redStartValue;
                    const greenAnimationCurrentValue = (valueObj.greenValueIncrement / (preCalc.totalFramesAnimation / scrollTimeAnimation)) + valueObj.greenStartValue;
                    const blueAnimationCurrentValue = (valueObj.blueValueIncrement / (preCalc.totalFramesAnimation / scrollTimeAnimation)) + valueObj.blueStartValue;
                    const finalValueHex = rgbToHex(redAnimationCurrentValue, greenAnimationCurrentValue, blueAnimationCurrentValue);
                    finalValueMultiple += ' ' + finalValueHex;
                  } else {
                    if (valueObj.hasNumberValue) {

                      // Aquí se hace el cálculo del valor de la animación basado en la posición del scroll
                      animationCurrentValue = (valueObj.valueIncrement / (preCalc.totalFramesAnimation / scrollTimeAnimation)) + valueObj.startValue;

                      animationCurrentValue = valueObj.unitSelected.replace(/\d*\.?\d+/gi, animationCurrentValue); // Se obtiene la cadena a añadir en la regla de estilo
                    } else {
                      animationCurrentValue = valueObj.unitSelected;
                    }

                    finalValueMultiple += ' ' + animationCurrentValue;
                    // Se añade la regla de estilo pertinente
                  }
                });

                // Se añade la concatenación de valores a la regla de estilos
                stylesStr += preCalc.propName + ':' + finalValueMultiple + ' !important;';

              } else {
                let valueObj = preCalc.values[0];
                let finalValueMultiple = ''; // Se obtendrá la concatenación de los valores para regla de estilo
                scrollTimeAnimation = scroll - preCalc.startTime; // Tiempo transcurrido desde el keyframe inicial (en este intervalo)

                // Se diferencia el cálculo del estilo en la animación para cuando es un color
                if (valueObj.isColor) {
                  // Se calcula el color en base a la posición del scroll respecto a los keyframes
                  const redAnimationCurrentValue = (valueObj.redValueIncrement / (preCalc.totalFramesAnimation / scrollTimeAnimation)) + valueObj.redStartValue;
                  const greenAnimationCurrentValue = (valueObj.greenValueIncrement / (preCalc.totalFramesAnimation / scrollTimeAnimation)) + valueObj.greenStartValue;
                  const blueAnimationCurrentValue = (valueObj.blueValueIncrement / (preCalc.totalFramesAnimation / scrollTimeAnimation)) + valueObj.blueStartValue;
                  const finalValueHex = rgbToHex(redAnimationCurrentValue, greenAnimationCurrentValue, blueAnimationCurrentValue);
                  finalValueMultiple += ' ' + finalValueHex;
                } else {
                  if (valueObj.hasNumberValue) {
                    // Aquí se hace el cálculo del valor de la animación basado en la posición del scroll
                    animationCurrentValue = (valueObj.valueIncrement / (preCalc.totalFramesAnimation / scrollTimeAnimation)) + valueObj.startValue;
                    animationCurrentValue = valueObj.unitSelected.replace(/\-?\d*\.?\d+/gi, animationCurrentValue); // Se obtiene la cadena a añadir en la regla de estilo
                  } else {
                    animationCurrentValue = valueObj.unitSelected;
                  }
                  finalValueMultiple += ' ' + animationCurrentValue;
                }

                // Se añade la concatenación de valores a la regla de estilos
                stylesStr += preCalc.propName + ':' + finalValueMultiple + ' !important;';

              }

            }
          }
        });
      }
    });
  }
  stylesStr += '}';
}