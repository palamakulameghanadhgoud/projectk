"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary for visualization and algorithm UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-lg border border-red-800 bg-red-950/50 p-4 text-red-200">
            <p className="font-medium">Something went wrong</p>
            <p className="text-sm">Reload the page or try a different algorithm.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
