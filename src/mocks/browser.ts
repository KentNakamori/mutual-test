// mocks/browser.ts
import { setupWorker } from "msw";
import { handlers } from "./handlers";

/**
 * ブラウザ上でService WorkerとしてAPIをモックする
 */
export const worker = setupWorker(...handlers);
