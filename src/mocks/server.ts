import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Node.js環境でのMSWセットアップ（Jestなどのテスト用）
export const server = setupServer(...handlers);
