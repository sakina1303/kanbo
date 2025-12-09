import React from "react";

type State = {
  hasError: boolean;
  error: Error | null;
  info: React.ErrorInfo | null;
};

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true } as State;
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for developer debugging
    // In production you might send this to an error tracking service
    // eslint-disable-next-line no-console
    console.error("Uncaught error:", error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg p-6 max-w-xl w-full">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              The application encountered an unexpected error. You can reload the page or check the
              console for details.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Reload
              </button>
              <button
                onClick={() => {
                  // Open console instructions
                  // eslint-disable-next-line no-alert
                  alert("Open the browser devtools console to see error details.");
                }}
                className="px-3 py-2 rounded border border-gray-200 dark:border-gray-700 text-sm"
              >
                Show Console Tip
              </button>
            </div>

            {this.state.error ? (
              <details className="mt-4 text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {this.state.error.toString()}
                {this.state.info?.componentStack ? `\n\n${this.state.info.componentStack}` : null}
              </details>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
