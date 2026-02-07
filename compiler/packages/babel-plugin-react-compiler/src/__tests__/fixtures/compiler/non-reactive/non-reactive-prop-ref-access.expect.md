
## Input

```javascript
// @enableNonReactiveAnnotation @enableUseTypeAnnotations
import {useRef} from 'react';

type NonReactive<T> = T;

function Component({
  onSubmit,
}: {
  onSubmit: NonReactive<(data: string) => void>;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const handler = () => {
    onSubmit(ref.current!.value);
  };
  return (
    <>
      <input ref={ref} />
      <button onClick={handler}>Submit</button>
    </>
  );
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{onSubmit: (data: string) => console.log(data)}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableNonReactiveAnnotation @enableUseTypeAnnotations
import { useRef } from "react";

type NonReactive<T> = T;

function Component(t0) {
  const $ = _c(3);
  const { onSubmit } = t0;
  const ref = useRef(null);
  let t1;
  t1 = () => {
    onSubmit(ref.current.value);
  };
  $[0] = t1;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = (...args) => $[0](...args);
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const handler = t1;
  let t2;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = (
      <>
        <input ref={ref} />
        <button onClick={handler}>Submit</button>
      </>
    );
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  return t2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [
    {
      onSubmit: (data) => {
        return console.log(data);
      },
    },
  ],
};

```
      
### Eval output
(kind: ok) <input><button>Submit</button>