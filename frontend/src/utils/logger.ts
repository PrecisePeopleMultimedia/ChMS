/**
 * Comprehensive logging utility for debugging authentication and app flow
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  category: string
  message: string
  data?: any
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private sessionId: string
  private isEnabled = true

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeErrorHandlers()
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private initializeErrorHandlers() {
    try {
      // Capture unhandled errors
      window.addEventListener('error', (event) => {
        try {
          this.error('Unhandled Error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error?.stack,
          })
        } catch (e) {
          // Fallback to console if logger fails
          console.error('Unhandled Error:', event)
        }
      })

      // Capture unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        try {
          this.error('Unhandled Promise Rejection', {
            reason: event.reason,
            stack: event.reason?.stack,
          })
        } catch (e) {
          // Fallback to console if logger fails
          console.error('Unhandled Promise Rejection:', event.reason)
        }
      })

      // Capture Vue errors if available
      if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
        try {
          window.__VUE_DEVTOOLS_GLOBAL_HOOK__.on('component:error', (err: any) => {
            try {
              this.error('Vue Component Error', {
                componentName: err.componentName,
                message: err.message,
                stack: err.stack,
              })
            } catch (e) {
              console.error('Vue Component Error:', err)
            }
          })
        } catch (e) {
          // Vue devtools hook might not be available
        }
      }
    } catch (error) {
      // If error handler initialization fails, just log to console
      console.warn('Logger error handlers could not be initialized:', error)
    }
  }

  private createLogEntry(level: LogLevel, category: string, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
    }
  }

  private addLog(entry: LogEntry) {
    if (!this.isEnabled) return

    this.logs.push(entry)

    // Keep only the latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      const levelName = LogLevel[entry.level]
      const prefix = `[${entry.timestamp}] [${levelName}] [${entry.category}]`

      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(prefix, entry.message, entry.data)
          break
        case LogLevel.INFO:
          console.info(prefix, entry.message, entry.data)
          break
        case LogLevel.WARN:
          console.warn(prefix, entry.message, entry.data)
          break
        case LogLevel.ERROR:
          console.error(prefix, entry.message, entry.data)
          break
      }
    }
  }

  debug(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.DEBUG, 'DEBUG', message, data)
    this.addLog(entry)
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.INFO, 'INFO', message, data)
    this.addLog(entry)
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.WARN, 'WARN', message, data)
    this.addLog(entry)
  }

  error(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.ERROR, 'ERROR', message, data)
    this.addLog(entry)
  }

  // Category-specific methods
  auth(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.INFO, 'AUTH', message, data)
    this.addLog(entry)
  }

  authError(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.ERROR, 'AUTH_ERROR', message, data)
    this.addLog(entry)
  }

  api(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.INFO, 'API', message, data)
    this.addLog(entry)
  }

  apiError(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.ERROR, 'API_ERROR', message, data)
    this.addLog(entry)
  }

  navigation(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.INFO, 'NAVIGATION', message, data)
    this.addLog(entry)
  }

  vue(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.DEBUG, 'VUE', message, data)
    this.addLog(entry)
  }

  vueError(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.ERROR, 'VUE_ERROR', message, data)
    this.addLog(entry)
  }

  // Methods for accessing logs
  getLogs(level?: LogLevel, category?: string): LogEntry[] {
    return this.logs.filter(log => {
      if (level !== undefined && log.level !== level) return false
      if (category && !log.category.includes(category.toUpperCase())) return false
      return true
    })
  }

  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count)
  }

  getErrorLogs(): LogEntry[] {
    return this.logs.filter(log => log.level >= LogLevel.WARN)
  }

  getAuthLogs(): LogEntry[] {
    return this.logs.filter(log => log.category.includes('AUTH'))
  }

  // Export logs for debugging
  exportLogs(): string {
    const exportData = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      totalLogs: this.logs.length,
      logs: this.logs,
    }

    return JSON.stringify(exportData, null, 2)
  }

  // Download logs as file
  downloadLogs(filename?: string) {
    const logsData = this.exportLogs()
    const blob = new Blob([logsData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename || `chms-logs-${this.sessionId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Clear logs
  clearLogs() {
    this.logs = []
  }

  // Enable/disable logging
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }

  // Get session info
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      totalLogs: this.logs.length,
      errorCount: this.getErrorLogs().length,
      authLogCount: this.getAuthLogs().length,
    }
  }
}

// Create singleton instance with safe initialization
let loggerInstance: Logger

// Initialize logger instance safely - never fail, always provide a working logger
try {
  loggerInstance = new Logger()
} catch (error) {
  console.error('Failed to create logger instance, using fallback:', error)
  // Create a minimal fallback logger that matches the Logger interface
  class FallbackLogger {
    private logs: LogEntry[] = []
    
    debug() {}
    info() {}
    warn() {}
    error() {}
    auth() {}
    authError() {}
    api() {}
    apiError() {}
    navigation() {}
    vue() {}
    vueError() {}
    getLogs() { return [] }
    getRecentLogs() { return [] }
    getErrorLogs() { return [] }
    getAuthLogs() { return [] }
    exportLogs() { return '{}' }
    downloadLogs() {}
    clearLogs() {}
    setEnabled() {}
    getSessionInfo() {
      return { sessionId: 'fallback', totalLogs: 0, errorCount: 0, authLogCount: 0 }
    }
  }
  loggerInstance = new FallbackLogger() as any
}

// Make logger available globally for debugging
if (typeof window !== 'undefined' && loggerInstance) {
  try {
    // Use Object.defineProperty to avoid any assignment issues
    Object.defineProperty(window, 'logger', {
      value: loggerInstance,
      writable: false,
      configurable: true,
    })

    // Add global debugging methods
    Object.defineProperty(window, 'debugInfo', {
      value: () => {
        if (!loggerInstance) return
        console.log('=== CHMS Debug Info ===')
        console.log('Session Info:', loggerInstance.getSessionInfo())
        console.log('Recent Logs:', loggerInstance.getRecentLogs(50))
        console.log('Error Logs:', loggerInstance.getErrorLogs())
        console.log('Auth Logs:', loggerInstance.getAuthLogs())
      },
      writable: false,
      configurable: true,
    })

    Object.defineProperty(window, 'downloadLogs', {
      value: () => {
        if (loggerInstance) loggerInstance.downloadLogs()
      },
      writable: false,
      configurable: true,
    })

    Object.defineProperty(window, 'clearLogs', {
      value: () => {
        if (loggerInstance) {
          loggerInstance.clearLogs()
          console.log('Logs cleared')
        }
      },
      writable: false,
      configurable: true,
    })
  } catch (error) {
    console.error('Failed to initialize global logger:', error)
  }
}

// Export the logger instance (ensure it's never null)
export const logger = loggerInstance!

// Extend Window interface for type safety
declare global {
  interface Window {
    logger: typeof logger
    debugInfo: () => void
    downloadLogs: () => void
    clearLogs: () => void
    __VUE_DEVTOOLS_GLOBAL_HOOK__?: any
  }
}

export default logger