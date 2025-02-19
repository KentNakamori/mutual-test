import { setupWorker } from 'msw';
import { handlers } from './handlers';

// ブラウザ側でMSWをセットアップ
export const worker = setupWorker(...handlers);
