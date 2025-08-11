/// ################################ Implementation ################################

/**
 * -----------------------------------------------------------------
 *    @file services/log.service.ts
 *    @since 15.03.2021
 *    @summary Logging service for console output.
 *    @description Logging service that provides formatted log messages
 *    on different levels tagged with a timestamp.
 *    @author Sebastian Riga
 *    <p>
 *        @see console
 *    </p>
 *
 *    <p>
 *        Revision History:
 *        Name:           Date:        Description:
 *    </p>
 * -----------------------------------------------------------------
 */
class Log {
    /**
     * Relatively detailed tracing used by application developers.
     * @param msg The message for the log entry.
     * @param params Optional varargs to append to the log message e.g. objects, errors, etc.
     */
    public readonly debug = (msg: string, ...params: any[]) => {
        // this will help to print log only in dev build, logs will not be printed in relese
        if (__DEV__) {
            console.log(`💬  ${this.timestamp} - ${msg}`, params);
        }
    };

    /**
     * Informational messages that might make sense to end users and system administrators, and highlight the progress of the application.
     * @param msg The message for the log entry.
     * @param params Optional varargs to append to the log message e.g. objects, errors, etc.
     */
    public readonly info = (msg: string, ...params: any[]) => {
        if (__DEV__) {
            console.info(`ℹ️  ${this.timestamp} - ${msg}`, params);
        }
    };

    /**
     * Potentially harmful situations of interest to end users or system managers that indicate potential problems.
     * @param msg The message for the log entry.
     * @param params Optional varargs to append to the log message e.g. objects, errors, etc.
     */
    public readonly warn = (msg: string, ...params: any[]) => {
        if (__DEV__) {
            console.warn(`⚠️  ${this.timestamp} - ${msg}`, params);
        }
    };

    /**
     * Error events of considerable importance that will prevent normal program execution, but might still allow the application to continue running.
     * @param msg The message for the log entry.
     * @param params Optional varargs to append to the log message e.g. objects, errors, etc.
     */
    public readonly error = (msg: string, ...params: any[]) => {
        if (__DEV__) {
            console.error(`‼️  ${this.timestamp} - ${msg}`, params);
        }
    };

    /**
     * Returns the current timestamp formatted with the devices locale.
     */
    private get timestamp(): string {
        return new Date().toLocaleString();
    }
}

/// ################################ Export ################################

/**
 * Logging service that provides formatted log messages
 * on different levels tagged with a timestamp.
 * @see Log
 */
const LogManager = new Log();

export default LogManager;

/// ################################ EOF ################################
