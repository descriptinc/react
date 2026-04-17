// @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// Inline arrow used directly in a JSX attribute (no intermediate `const`
// assignment). The inference still marks the FunctionExpression as
// non-reactive so it gets the two-slot stable-identity codegen.
function Component({value}: {value: string}) {
  return <button onClick={() => console.log(value)}>{value}</button>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 'hello'}],
};
