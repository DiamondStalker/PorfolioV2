import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook personalizado para manejo robusto de errores de APIs
 * Incluye reintentos automáticos, timeout y manejo de estados de carga
 */
export const useApiCall = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const timeoutRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Configuración por defecto
    const defaultConfig = {
        maxRetries: 3,
        retryDelay: 2000,
        timeout: 10000,
        exponentialBackoff: true
    };

    // Cleanup de timeouts y requests al desmontar
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    /**
     * Ejecuta una llamada a API con manejo robusto de errores
     */
    const executeCall = useCallback(async (apiCall, config = {}) => {
        const finalConfig = { ...defaultConfig, ...config };
        let currentRetry = 0;

        const attemptCall = async () => {
            try {
                setLoading(true);
                setError(null);

                abortControllerRef.current = new AbortController();

                timeoutRef.current = setTimeout(() => {
                    abortControllerRef.current?.abort();
                }, finalConfig.timeout);

                if (currentRetry > 0) {
                    const delay = finalConfig.exponentialBackoff 
                        ? finalConfig.retryDelay * Math.pow(2, currentRetry - 1)
                        : finalConfig.retryDelay * currentRetry;
                    
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                const result = await apiCall(abortControllerRef.current.signal);

                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                setRetryCount(0);
                return result;

            } catch (err) {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                let errorMessage = 'Error desconocido';
                let shouldRetry = true;

                if (err.name === 'AbortError') {
                    errorMessage = 'Tiempo de espera agotado';
                    shouldRetry = false;
                } else if (err.name === 'TypeError') {
                    errorMessage = 'Error de conexión de red';
                } else if (err.response) {
                    const status = err.response.status;
                    
                    if (status >= 400 && status < 500) {
                        errorMessage = `Error del cliente (${status}): ${err.response.statusText}`;
                        shouldRetry = false;
                    } else if (status >= 500) {
                        errorMessage = `Error del servidor (${status}): ${err.response.statusText}`;
                    }
                } else if (err.message) {
                    errorMessage = err.message;
                }

                if (shouldRetry && currentRetry < finalConfig.maxRetries) {
                    currentRetry++;
                    setRetryCount(currentRetry);
                    return attemptCall();
                } else {
                    setError(errorMessage);
                    throw new Error(errorMessage);
                }
            } finally {
                setLoading(false);
            }
        };

        return attemptCall();
    }, []);

    /**
     * Reinicia el estado de errores y reintentos
     */
    const reset = useCallback(() => {
        setError(null);
        setRetryCount(0);
        setLoading(false);
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }, []);

    /**
     * Cancela la llamada actual
     */
    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setLoading(false);
    }, []);

    return {
        loading,
        error,
        retryCount,
        executeCall,
        reset,
        cancel
    };
};

export default useApiCall;
