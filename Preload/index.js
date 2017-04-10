/**
 * Script to inject into the PRELOADER. Modify as you see fit.
 */

// Intercepts the websocket before it is deleted.
require('./WebSocketInterceptor');
// Intercepts the localstorage before it is deleted.
require('./LocalStorageInterceptor');