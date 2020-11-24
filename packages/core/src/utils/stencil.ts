export type StencilHook = 'connectedCallback'
| 'disconnectedCallback'
| 'componentWillRender'
| 'componentDidRender'
| 'componentWillLoad'
| 'componentDidLoad'
| 'componentShouldUpdate'
| 'componentWillUpdate'
| 'componentDidUpdate';

export function wrapStencilHook(component: any, lifecycle: StencilHook, hook: Function) {
  const prevHook = component[lifecycle];
  // eslint-disable-next-line func-names
  component[lifecycle] = function () {
    hook();
    return prevHook ? prevHook.call(component) : undefined;
  };
}

export function createStencilHook(
  component: any,
  onConnect: () => void,
  onDisconnect: () => void,
) {
  let hasLoaded = false;

  wrapStencilHook(component, 'componentWillLoad', () => {
    onConnect();
    hasLoaded = true;
  });

  wrapStencilHook(component, 'connectedCallback', () => {
    if (hasLoaded) onConnect();
  });

  wrapStencilHook(component, 'disconnectedCallback', () => {
    onDisconnect();
  });
}
