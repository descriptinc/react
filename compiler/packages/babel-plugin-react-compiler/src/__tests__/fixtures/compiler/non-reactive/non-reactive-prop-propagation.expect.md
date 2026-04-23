
## Input

```javascript
// @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// Even without any annotation on Child's onClick prop, Parent's onClick is
// used only as a JSX attribute, so the caller-side inference stabilizes it.
function Child({onClick}: {onClick: () => void}) {
  return <div onClick={onClick}>foo</div>;
}

function Parent({value}: {value: string}) {
  const onClick = () => console.log(value);
  return <Child onClick={onClick} />;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Parent,
  params: [{value: 'hello'}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// Even without any annotation on Child's onClick prop, Parent's onClick is
// used only as a JSX attribute, so the caller-side inference stabilizes it.
function Child(t0) {
  const $ = _c(2);
  const { onClick } = t0;
  let t1;
  if ($[0] !== onClick) {
    t1 = <div onClick={onClick}>foo</div>;
    $[0] = onClick;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

function Parent(t0) {
  const $ = _c(4);
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
  if ($[2] !== onClick) {
    t2 = <Child onClick={onClick} />;
    $[2] = onClick;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  return t2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Parent,
  params: [{ value: "hello" }],
};

```
      
### Eval output
(kind: ok) <div>foo</div>