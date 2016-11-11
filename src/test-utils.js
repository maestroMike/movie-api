/* @flow */

import R from 'ramda';

const childTypesForArray = R.memoize(R.pipe(R.map(R.type), R.uniq));
const modelFromObject = (obj: ?Object) => R.map(
  R.cond([
    [
      R.allPass([
        R.pipe(R.type, R.equals('Array')),
        R.pipe(childTypesForArray, R.length, R.equals(1)),
      ]),
      (val: Array<any>) => `Array<${R.pipe(childTypesForArray, R.head)(val)}>`,
    ],
    [R.pipe(R.type, R.contains(R.__, ['Object', 'Array'])), modelFromObject],
    [R.T, R.type],
  ]),
  obj,
);

export { modelFromObject }; // eslint-disable-line import/prefer-default-export