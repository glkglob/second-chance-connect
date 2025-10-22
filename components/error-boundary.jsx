'use client'

import React from 'react'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import { logComponentError } from '@/lib/logger'

/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    logComponentError(error, errorInfo, errorInfo.componentStack)

    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          showDetails={this.props.showDetails}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Error Fallback UI Component
 */
function ErrorFallback({ error, errorInfo, onReset, showDetails = false }) {
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-lg text-muted-foreground">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>
        </div>

        {/* Error Details (Development only or if showDetails is true) */}
        {(!isProduction || showDetails) && error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-left">
            <h3 className="mb-2 font-semibold text-destructive">Error Details:</h3>
            <pre className="overflow-auto text-sm text-muted-foreground">
              {error.toString()}
            </pre>
            {errorInfo?.componentStack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium">
                  Component Stack
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-muted-foreground">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="h-4 w-4" />
            Go Home
          </a>
        </div>

        {/* Support Info */}
        <div className="text-sm text-muted-foreground">
          <p>
            If this problem persists, please{' '}
            <a
              href="mailto:support@secondchanceconnect.org"
              className="text-primary hover:underline"
            >
              contact support
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Simplified Error Boundary for smaller sections
 */
export function SectionErrorBoundary({ children, fallback }) {
  return (
    <ErrorBoundary showDetails={false}>
      {children}
    </ErrorBoundary>
  )
}

/**
 * Hook to manually reset error boundary
 */
export function useErrorHandler() {
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return setError
}

export default ErrorBoundary
