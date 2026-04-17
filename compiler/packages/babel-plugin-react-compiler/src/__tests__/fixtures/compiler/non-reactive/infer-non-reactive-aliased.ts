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
