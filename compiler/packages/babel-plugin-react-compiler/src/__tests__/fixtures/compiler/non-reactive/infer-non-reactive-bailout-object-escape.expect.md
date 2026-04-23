
## Input

```javascript
// @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// Storing the handler in an object passed to a child lets the handler escape
// to arbitrary reads; bail out of the inference.
function Component({value}: {value: string}) {
  const onClick = () => console.log(value);
  const config = {handlers: {onClick}};
  return <Child config={config} />;
}

function Child({
  config,
}: {
  config: {handlers: {onClick: () => void}};
}) {
  return <button onClick={config.handlers.onClick}>go</button>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 'hello'}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// Storing the handler in an object passed to a child lets the handler escape
// to arbitrary reads; bail out of the inference.
function Component(t0) {
  const $ = _c(2);
  const { value } = t0;
  let t1;
  if ($[0] !== value) {
    const onClick = () => console.log(value);
    const config = { handlers: { onClick } };
    t1 = <Child config={config} />;
    $[0] = value;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

function Child(t0) {
  const $ = _c(2);
  const { config } = t0;
  let t1;
  if ($[0] !== config.handlers.onClick) {
    t1 = <button onClick={config.handlers.onClick}>go</button>;
    $[0] = config.handlers.onClick;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: "hello" }],
};

```
      
### Eval output
(kind: ok) <button>go</button>