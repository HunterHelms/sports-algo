import React from 'react';

export const ErrorMessage = ({ message, retry }) => (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error</p>
        <p className="text-sm mb-3">{message}</p>
        {retry && (
            <button
                onClick={retry}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md transition-colors"
            >
                Try Again
            </button>
        )}
    </div>
);

export default ErrorMessage;
