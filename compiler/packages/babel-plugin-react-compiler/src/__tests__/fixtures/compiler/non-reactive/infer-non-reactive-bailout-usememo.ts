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
