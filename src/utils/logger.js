/**
 * Sistema de logging seguro para reemplazar console.log
 * Incluye sanitización de datos sensibles y niveles de log
 */

// Niveles de logging
const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

// Configuración del logger
const config = {
    level: LOG_LEVELS[import.meta.env.VITE_LOG_LEVEL?.toUpperCase()] || LOG_LEVELS.INFO,
    enabled: import.meta.env.VITE_APP_ENVIRONMENT !== 'production',
    maxStringLength: 1000,
    sensitiveKeys: [
        'password', 'token', 'key', 'secret', 'auth', 'authorization',
        'jwt', 'api_key', 'access_token', 'refresh_token', 'session',
        'credential', 'private', 'confidential'
    ]
};

/**
 * Sanitiza datos sensibles antes del logging
 */
const sanitizeData = (data) => {
    if (data === null || data === undefined) {
        return data;
    }

    if (typeof data === 'string') {
        if (data.length > config.maxStringLength) {
            return data.substring(0, config.maxStringLength) + '... [TRUNCATED]';
        }
        
        if (/^[A-Za-z0-9_-]{20,}$/.test(data) && data.length > 32) {
            return '[SENSITIVE_STRING_REDACTED]';
        }
        
        return data;
    }

    if (typeof data === 'number' || typeof data === 'boolean') {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(item => sanitizeData(item));
    }

    if (typeof data === 'object') {
        const sanitized = {};
        
        for (const [key, value] of Object.entries(data)) {
            const lowerKey = key.toLowerCase();
            
            const isSensitive = config.sensitiveKeys.some(sensitiveKey => 
                lowerKey.includes(sensitiveKey)
            );
            
            if (isSensitive) {
                sanitized[key] = '[REDACTED]';
            } else {
                sanitized[key] = sanitizeData(value);
            }
        }
        
        return sanitized;
    }

    if (typeof data === 'function') {
        return '[FUNCTION]';
    }

    return data;
};

/**
 * Función base de logging
 */
const logBase = (level, message, ...args) => {
    if (!config.enabled || LOG_LEVELS[level] > config.level) {
        return;
    }

    const timestamp = new Date().toISOString();
    const sanitizedArgs = args.map(arg => sanitizeData(arg));
    
    const logMethod = level === 'ERROR' ? console.error :
                     level === 'WARN' ? console.warn :
                     console.log;

    if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
        logMethod(
            `[${timestamp}] ${level}: ${message}`,
            ...sanitizedArgs
        );
    } else {
        logMethod(message, ...sanitizedArgs);
    }
};

/**
 * Logger principal con diferentes niveles
 */
const logger = {
    error: (message, ...args) => {
        logBase('ERROR', message, ...args);
    },

    warn: (message, ...args) => {
        logBase('WARN', message, ...args);
    },

    info: (message, ...args) => {
        logBase('INFO', message, ...args);
    },

    debug: (message, ...args) => {
        logBase('DEBUG', message, ...args);
    },

    configure: (newConfig) => {
        Object.assign(config, newConfig);
    },

    getConfig: () => ({ ...config })
};

// Funciones de conveniencia que reemplazan console.log
export const log = logger.info;
export const logError = logger.error;
export const logWarn = logger.warn;
export const logDebug = logger.debug;

export default logger;
