"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestScheduler_1 = require("rxjs/testing/TestScheduler");
require("rxjs/add/observable/of");
require("rxjs/add/observable/concat");
require("rxjs/add/observable/throw");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/startWith");
var match_obs_1 = require("./match-obs");
describe('matchObservable()', function () {
    var ts = null;
    beforeEach(function () {
        ts = new TestScheduler_1.TestScheduler(function (a, b) { return a === b; });
    });
    it('match values correctly', function (done) {
        var cold = ts.createColdObservable('12345');
        var expectedValues = ['1', '2', '3', '4', '5'];
        match_obs_1.matchObservable(cold, expectedValues, false, false)
            .catch(fail)
            .then(done);
        ts.flush();
    });
    it('unmatch correctly one of the values', function (done) {
        var cold = ts.createColdObservable('12345');
        var expectedValues = ['1', '2', '6', '4', '5'];
        match_obs_1.matchObservable(cold, expectedValues, false, false)
            .then(function () { fail('Did not detect unmatched values.'); done(); })
            .catch(done);
        ts.flush();
    });
    it('unmatch correctly more expected values', function (done) {
        var cold = ts.createColdObservable('12345|');
        var expectedValues = ['1', '2', '3', '4', '5', '6'];
        match_obs_1.matchObservable(cold, expectedValues, true, false)
            .then(function () { fail('Did not detect unmatched values.'); done(); })
            .catch(done);
        ts.flush();
    });
    it('match correctly some values and complete', function (done) {
        var cold = ts.createColdObservable('12345|');
        var expectedValues = ['1', '2', '3', '4', '5'];
        match_obs_1.matchObservable(cold, expectedValues, true, false)
            .catch(fail)
            .then(done);
        ts.flush();
    });
    it('match correctly some values and detect uncomplete', function (done) {
        var cold = ts.createColdObservable('123456');
        var expectedValues = ['1', '2', '3', '4', '5'];
        match_obs_1.matchObservable(cold, expectedValues, true, false)
            .then(function () { fail('Failed detection.'); done(); })
            .catch(done);
        ts.flush();
    });
    it('match correctly some values and an error', function (done) {
        var expectedValues = ['1', '2', '3', '4', '5'];
        var cold = ts.createHotObservable('01234#', expectedValues, new Error('Some Error!'));
        match_obs_1.matchObservable(cold, expectedValues, false, true)
            .catch(fail)
            .then(done);
        ts.flush();
    });
    it('match correctly some values and detect no error', function (done) {
        var cold = ts.createColdObservable('123456');
        var expectedValues = ['1', '2', '3', '4', '5'];
        match_obs_1.matchObservable(cold, expectedValues, false, true)
            .then(function () { fail('Failed detection.'); done(); })
            .catch(done);
        ts.flush();
    });
});
//# sourceMappingURL=match-obs.spec.js.map