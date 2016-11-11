## tsconfig.json

- 環境に合わせてinclude, excludeにpathを追加が必要

## build

- tsc
- webpack

webpackはts-loaderだけ用意していてHTMLやCSSについては別途設定が必要

## test環境

[power-assert-js/espower-typescript: power-assert instrumentor for TypeScript](https://github.com/power-assert-js/espower-typescript)

```
npm i -D mocha power-assert espower-assert @types/power-assert @types/mocha
```

tsconfig.json

```js
{
    "compilerOptions": {
        // https://github.com/power-assert-js/espower-typescript/issues/16
        // trueにするとespower-assertが動かない(?)
        // その他にもテストが外部からファイルをimportしてないとerrorになる(?)
        "noEmitOnError": false,
   		// mochaはglobalにあるので明示的に型定義を指定する
        "types": [
            "mocha"
        ]
    },
}
```

mocha.opts

```
--compilers ts:espower-typescript/guess test/**/*.test.ts
--growl
--reporter nyan
```

sample.test.js

```js
import * as assert from 'power-assert';
import add from './../../src/index';

describe('sample', function () {
    it('test', function () {
        assert(add(1, 1) === 2);
    });
});
```

### ハマりどころ

[[bug] error if test file import other typescript · Issue #16 · power-assert-js/espower-typescript](https://github.com/power-assert-js/espower-typescript/issues/16)

- tsconfig.jsonの`noEmitOnError`オプションをfalseにする
- テストファイルが外部からファイルをimportしてない場合にerrorになる


## React

```
npm i -S react react-dom @types/react @types/react-dom tslint-react
```

tsconfig.json

```
{
    "compilerOptions": {
        "jsx": "react"
    },
}
```

tslintのreact ruleは含んでいないので別途追加が必要
[palantir/tslint-react: Lint rules related to React & JSX for TSLint.](https://github.com/palantir/tslint-react)