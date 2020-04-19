import { useState } from "react"

export const useError = () => {
    const [error, setError] = useState(null);

    const handleError = (e) => {
        const {statusCode} = JSON.parse(e.request.response);
        let message;
        switch (statusCode) {
            case 404:
                message = 'Not Found';
                break;
            case 401: case 403:
                message = 'Please Login'
                break;
            default:
                message = 'Something went wrong. try again later'
                break;
        }
        setError({message, code: statusCode});
    };

    const clearError = () => {
        setError(null);
    };

    return {
        error,
        handleError,
        clearError,
        setError
    }
}