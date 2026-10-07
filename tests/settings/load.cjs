const { readFileSync, existsSync } = require('node:fs');
const { resolve, dirname } = require('node:path');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');
const root = resolve(__dirname, '../../app');
function load(path, mocks = {}, globals = {}) {
  const filename = path.startsWith('/') ? path : resolve(root, path);
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const module = { exports: {} };
  runInNewContext(code, {
    module,
    exports: module.exports,
    console,
    File,
    Map,
    URL,
    ...globals,
    require(name) {
      if (name in mocks) return mocks[name];
      if (name.startsWith('.') || name.startsWith('@/')) {
        const base = name.startsWith('@/') ? resolve(root, name.slice(2)) : resolve(dirname(filename), name);
        const found = ['.ts', '.tsx', '/index.ts', '/index.tsx'].map((ext) => base + ext).find(existsSync);
        return load(found, mocks, globals);
      }
      return require(name);
    },
  });
  return module.exports;
}
module.exports = { load };
