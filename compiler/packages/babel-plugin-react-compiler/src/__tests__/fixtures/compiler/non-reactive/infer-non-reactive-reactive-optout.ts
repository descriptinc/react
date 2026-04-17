// @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
type Reactive<T> = T;

// Even though onClick is only used as a JSX attribute, the explicit
// Reactive<T> annotation opts out of the inferred stable-identity behavior.
function Component({value}: {value: string}) {
  const onClick: Reactive<() => void> = () => console.log(value);
  return <button onClick={onClick}>{value}</button>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 'hello'}],
};
