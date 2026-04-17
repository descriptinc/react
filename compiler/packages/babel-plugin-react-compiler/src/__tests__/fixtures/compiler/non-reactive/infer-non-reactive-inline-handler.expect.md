
## Input

```javascript
// @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
function Component({value}: {value: string}) {
  const onClick = () => console.log(value);
  return <button onClick={onClick}>{value}</button>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 'hello'}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
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
  const onClick = t1;
  let t2;
  if ($[2] !== onClick || $[3] !== value) {
    t2 = <button onClick={onClick}>{value}</button>;
    $[2] = onClick;
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