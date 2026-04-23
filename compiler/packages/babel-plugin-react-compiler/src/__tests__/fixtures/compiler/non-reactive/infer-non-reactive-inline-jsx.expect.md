
## Input

```javascript
// @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// Inline arrow used directly in a JSX attribute (no intermediate `const`
// assignment). The inference still marks the FunctionExpression as
// non-reactive so it gets the two-slot stable-identity codegen.
function Component({value}: {value: string}) {
  return <button onClick={() => console.log(value)}>{value}</button>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 'hello'}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// Inline arrow used directly in a JSX attribute (no intermediate `const`
// assignment). The inference still marks the FunctionExpression as
// non-reactive so it gets the two-slot stable-identity codegen.
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
  let t2;
  if ($[2] !== t1 || $[3] !== value) {
    t2 = <button onClick={t1}>{value}</button>;
    $[2] = t1;
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