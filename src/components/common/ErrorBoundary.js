import React from 'react';
import { ErrorMessage } from './ErrorMessage';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4">
                    <ErrorMessage
                        message={this.state.error?.message || 'Something went wrong'}
                        retry={() => {
                            this.setState({ hasError: false });
                            this.props.onRetry?.();
                        }}
                    />
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

