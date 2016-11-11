import * as assert from 'power-assert';
import add from './../../src/index';

describe('sample', function () {
    it('test', function () {
        assert(add(1, 1) === 2);
    });
});
