import {TestScheduler} from 'rxjs/testing/TestScheduler';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/startWith';

import {matchObservable} from './match-obs';

describe('matchObservable()', () =>
{
    let ts: TestScheduler = null;

    beforeEach(() =>
    {
        ts = new TestScheduler((a, b) => a === b);
    });

    it('match values correctly', (done) =>
    {
        const cold = ts.createColdObservable('12345');
        const expectedValues = ['1', '2', '3', '4', '5'];

        matchObservable(cold, expectedValues, false, false)
            .catch(fail)
            .then(done);

        ts.flush();
    });

    it('unmatch correctly one of the values', (done) =>
    {
        const cold = ts.createColdObservable('12345');
        const expectedValues = ['1', '2', '6', '4', '5'];

        matchObservable(cold, expectedValues, false, false)
            .then(() => { fail('Did not detect unmatched values.'); done(); })
            .catch(done);

        ts.flush();
    });

    it('unmatch correctly more expected values', (done) =>
    {
        const cold = ts.createColdObservable('12345|');
        const expectedValues = ['1', '2', '3', '4', '5', '6'];

        matchObservable(cold, expectedValues, true, false)
            .then(() => { fail('Did not detect unmatched values.'); done(); })
            .catch(done);

        ts.flush();
    });

    it('match correctly some values and complete', (done) =>
    {
        const cold = ts.createColdObservable('12345|');
        const expectedValues = ['1', '2', '3', '4', '5'];

        matchObservable(cold, expectedValues, true, false)
            .catch(fail)
            .then(done);

        ts.flush();
    });

    it('match correctly some values and detect incomplete', (done) =>
    {
        const cold = ts.createColdObservable('123456');
        const expectedValues = ['1', '2', '3', '4', '5'];

        matchObservable(cold, expectedValues, true, false)
            .then(() => { fail('Failed detection.'); done(); })
            .catch(done);

        ts.flush();
    });

    it('match correctly some values and an error', (done) =>
    {
        const expectedValues = ['1', '2', '3', '4', '5'];
        const cold = ts.createHotObservable('01234#', expectedValues, new Error('Some Error!'));

        matchObservable(cold, expectedValues, false, true)
            .catch(fail)
            .then(done);

        ts.flush();
    });

    it('match correctly some values and detect no error', (done) =>
    {
        const cold = ts.createColdObservable('123456');
        const expectedValues = ['1', '2', '3', '4', '5'];

        matchObservable(cold, expectedValues, false, true)
            .then(() => { fail('Failed detection.'); done(); })
            .catch(done);

        ts.flush();
    });

    it('uses the provided valuePrint function', (done) =>
    {
        const cold = ts.createColdObservable('12345');
        const expectedValues = ['1', '2', '3', '4', '6'];

        matchObservable<string>(
            cold,
            expectedValues,
            false,
            false,
            (a, b) => a === b,
            v => (v + 'P').toString())
            .then(() => {
                fail('Did not detect unmatched values.');
                done();
            })
            .catch(message => {
                expect(message).toBe('Values at index 4 are expected to match. Received:\n' +
                    '5P\n' +
                    'Expected:\n' +
                    '6P');
                done();
            });

        ts.flush();
    });
});
