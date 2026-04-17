
## Input

```javascript
// @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// The handler is assigned to a second local before being passed as a JSX
// attribute. Both aliases should be treated as non-reactive.
function Component({value}: {value: string}) {
  const handler = () => console.log(value);
  const aliased = handler;
  return <button onClick={aliased}>{value}</button>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 'hello'}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// The handler is assigned to a second local before being passed as a JSX
// attribute. Both aliases should be treated as non-reactive.
function Component(t0) {
  const $ = _c(5);
  const { value } = t0;
  let t1;
  t1 = () => console.log(value);
  $[0] = t1;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = (...args) => $[0](...args);
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const handler = t1;
  const aliased = handler;
  let t2;
  if ($[2] !== aliased || $[3] !== value) {
    t2 = <button onClick={aliased}>{value}</button>;
    $[2] = aliased;
    $[3] = value;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  return t2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: "hello" }],
};

```
      
### Eval output
(kind: ok) <button>hello</button>