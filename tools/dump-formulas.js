// Imprime en JSON el nombre, grupo y TeX de cada fórmula del panel (js/formulas/*.js).
// Lo usa tools/build_formulario.py para generar el PDF del formulario.
globalThis.window = globalThis;
const path = require('path');
const root = path.join(__dirname, '..');
['f1-corriente', 'f2-fuentes-kirchhoff', 'f3-metodos-transitorios', 'f4-campos-materiales']
  .forEach(f => require(path.join(root, 'js/formulas', f + '.js')));
console.log(JSON.stringify(globalThis.Formulas.map(({ id, g, t, f }) => ({ id, g, t, f }))));
