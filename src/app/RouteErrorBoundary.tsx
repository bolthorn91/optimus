import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  resetKey: string;
}

interface State {
  failed: boolean;
}

export class RouteErrorBoundary extends Component<Props, State> {
  public override state: State = { failed: false };

  public static getDerivedStateFromError(): State {
    return { failed: true };
  }

  public override componentDidCatch(_error: Error, _info: ErrorInfo): void {
    return undefined;
  }

  public override componentDidUpdate(prevProps: Props): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false });
    }
  }

  public override render(): ReactNode {
    if (this.state.failed) {
      return (
        <section role="alert">
          <h1>No hemos podido mostrar esta sección</h1>
          <p>Puede continuar navegando por el resto de la página.</p>
          <button
            type="button"
            onClick={() => {
              this.setState({ failed: false });
            }}
          >
            Reintentar
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
