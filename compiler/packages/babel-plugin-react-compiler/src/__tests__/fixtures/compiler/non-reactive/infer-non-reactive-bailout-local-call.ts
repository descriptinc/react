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
