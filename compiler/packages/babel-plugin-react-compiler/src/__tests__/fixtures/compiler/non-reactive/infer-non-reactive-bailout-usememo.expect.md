
## Input

```javascript
// @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
import {useMemo} from 'react';

// Passing the handler to useMemo as a dep means its identity is observed by
// memoization code that isn't one of the whitelisted effect hooks. Bail out.
function Component({value}: {value: number}) {
  const fn = () => value + 1;
  const memo = useMemo(() => fn(), [fn]);
  return <Child memo={memo} onSubmit={fn} />;
}

function Child({memo, onSubmit}: {memo: number; onSubmit: () => number}) {
  return <button onClick={() => onSubmit()}>{memo}</button>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 5}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
import { useMemo } from "react";

// Passing the handler to useMemo as a dep means its identity is observed by
// memoization code that isn't one of the whitelisted effect hooks. Bail out.
function Component(t0) {
  const $ = _c(5);
  const { value } = t0;
  let t1;
  if ($[0] !== value) {
    t1 = () => value + 1;
    $[0] = value;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const fn = t1;
  const memo = fn();
  let t2;
  if ($[2] !== fn || $[3] !== memo) {
    t2 = <Child memo={memo} onSubmit={fn} />;
    $[2] = fn;
    $[3] = memo;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  return t2;
}

function Child(t0) {
  const $ = _c(5);
  const { memo, onSubmit } = t0;
  let t1;
  t1 = () => onSubmit();
  $[0] = t1;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = (...args) => $[0](...args);
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  let t2;
  if ($[2] !== memo || $[3] !== t1) {
    t2 = <button onClick={t1}>{memo}</button>;
    $[2] = memo;
    $[3] = t1;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  return t2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: 5 }],
};

```
      
### Eval output
(kind: ok) <button>6</button>