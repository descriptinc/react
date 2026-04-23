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
