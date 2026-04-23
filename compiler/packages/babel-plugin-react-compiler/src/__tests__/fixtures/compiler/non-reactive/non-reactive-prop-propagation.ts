// @enableNonReactiveAnnotation @enableUseTypeAnnotations @enableInferNonReactiveHandlers
// Even without any annotation on Child's onClick prop, Parent's onClick is
// used only as a JSX attribute, so the caller-side inference stabilizes it.
function Child({onClick}: {onClick: () => void}) {
  return <div onClick={onClick}>foo</div>;
}

function Parent({value}: {value: string}) {
  const onClick = () => console.log(value);
  return <Child onClick={onClick} />;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Parent,
  params: [{value: 'hello'}],
};
