import * as util from "./util";

/**
 * This module keeps a global state and allows clients to wait for the
 * following events:
 *  - The extension has been fully activated.
 *  - The Prusti server is ready to process verification requests.
 */

let isExtensionActive = false;
let isPrustiServerReady = false;

export type Listener = () => void;

const waitingForExtensionActivation: Listener[] = [];
const waitingForPrustiServerReady: Listener[] = [];

export function waitExtensionActivation(): Promise<Listener> {
    return new Promise(resolve => {
        if (isExtensionActive) {
            // Resolve immediately
            resolve();
        } else {
            waitingForExtensionActivation.push(resolve);
        }
    });
}

export function waitPrustiServerReady(): Promise<Listener> {
    return new Promise(resolve => {
        if (isPrustiServerReady) {
            // Resolve immediately
            resolve();
        } else {
            waitingForPrustiServerReady.push(resolve);
        }
    });
}

export function notifyExtensionActivation(): void {
    util.log("The extension is now active.");
    isExtensionActive = true;
    waitingForExtensionActivation?.forEach(listener => listener());
}

export function notifyPrustiServerReady(): void {
    util.log("The Prusti server is now ready.");
    isPrustiServerReady = true;
    waitingForPrustiServerReady?.forEach(listener => listener());
}

export function notifyPrustiServerStop(): void {
    util.log("The Prusti server stopped.");
    isPrustiServerReady = false;
}
