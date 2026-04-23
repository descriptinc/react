// @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
function Component({value}: {value: string}) {
  const onClick = () => console.log(value);
  return <button onClick={onClick}>{value}</button>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 'hello'}],
};
