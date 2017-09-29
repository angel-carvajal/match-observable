# match-observer

## Installation

Simply install it from npm using the name `match-observer`.

## Usage

Import  the module using typescript or require it using plain javascript.

This module exporta only a function to implement a comparison between an observable and an array of values, producing a promise that resolves if there is a match or rejects if not. It has the following signature:
```
function matchObservable<T>(
    obs$: Observable<T>,
    values: Array<T>,
    expectComplete: boolean = true,
    expectError: boolean = false,
    matcher: (actual: T, expected: T) => boolean = (a, b) => a === b,
): Promise<void>
```
It compares the values the observer produces with the provided array of values. It also checks for the observable completion or error if required.

I will illustrate the usage by an example of a Jasmine test for a timer generator service. The service generates an observable that makes a countdown then completes:
```
let duration = 5; // in seconds
return Observable
  .interval(1000)
  .map(i => duration - i - 1)
  .take(duration)
  .startWith(duration);
```
The test code is simple, it tries to match the generated sequence to an array of values using `matchObservable()`.

```
it('should generate a timer', fakeAsync(() =>
{
    const expectedValues = [5, 4, 3, 2, 1, 0];
    const timer$ = service.getTimer(5);
    let matchResult: string;
    matchObservable(timer$, expectedValues, true)
        .then(() => matchResult = null, (result) => matchResult = result);

    tick(10000);
    expect(matchResult).toBeNull();
}));
```
Note the `tick(10000)`. It is necessary to make the time pass for the observer timely behavior to happen (as in `interval(1000)`). Also, the resolving or rejection of the promise affects the local variable `matchResult` which is used to assert the match. This makes the asynchronous code to run sequentially and the test flow becomes "flat" making compositing different assertion steps straightforward.

If the observer to test does not use any specific timing, instead of `tick()`, use `flush()` or `flushMicrotasks()` to advance the asynchronous pending tasks.

## Contributing

Contributions and issues are welcome.

Testing and linting scripts are provided:

`npm run test`

`npm run lint`
