import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center py-4 italic text-red-600">
                    ⚠️ Failed to render this section. Please check the data or reload.
                </div>
            );
        }

        return this.props.children;
    }
}
