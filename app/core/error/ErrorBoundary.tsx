import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // acá podrías mandar a Sentry, LogRocket, etc.
    console.error('[ErrorBoundary]', error, info)
  }

  reset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div>
          <h1>Algo salió mal</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={this.reset}>Reintentar</button>
        </div>
      )
    }

    return this.props.children
  }
}