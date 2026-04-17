
## Input

```javascript
// @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// Calling the handler locally (in render) should bail out of the inference —
// the handler must stay reactive so Parent re-renders see the latest value.
function Component({value}: {value: string}) {
  const compute = () => value * 2;
  const doubled = compute();
  return <Cell value={doubled} onRefresh={compute} />;
}

function Cell({value, onRefresh}: {value: number; onRefresh: () => number}) {
  return (
    <div>
      {value}
      <button onClick={() => onRefresh()}>refresh</button>
    </div>
  );
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 2}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// Calling the handler locally (in render) should bail out of the inference —
// the handler must stay reactive so Parent re-renders see the latest value.
function Component(t0) {
  const $ = _c(5);
  const { value } = t0;
  let t1;
  if ($[0] !== value) {
    t1 = () => value * 2;
    $[0] = value;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const compute = t1;
  const doubled = compute();
  let t2;
  if ($[2] !== compute || $[3] !== doubled) {
    t2 = <Cell value={doubled} onRefresh={compute} />;
    $[2] = compute;
    $[3] = doubled;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  return t2;
}

function Cell(t0) {
  const $ = _c(7);
  const { value, onRefresh } = t0;
  let t1;
  t1 = () => onRefresh();
  $[0] = t1;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = (...args) => $[0](...args);
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  let t2;
  if ($[2] !== t1) {
    t2 = <button onClick={t1}>refresh</button>;
    $[2] = t1;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  let t3;
  if ($[4] !== t2 || $[5] !== value) {
    t3 = (
      <div>
        {value}
        {t2}
      </div>
    );
    $[4] = t2;
    $[5] = value;
    $[6] = t3;
  } else {
    t3 = $[6];
  }
  return t3;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: 2 }],
};

```
      
### Eval output
(kind: ok) <div>4<button>refresh</button></div>