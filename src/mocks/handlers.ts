import { rest } from 'msw';
import { db } from './db';

export const handlers = [
  // ユーザー一覧取得
  rest.get('/api/users', (req, res, ctx) => {
    const users = db.user.getAll();
    return res(ctx.status(200), ctx.json(users));
  }),

  // 企業一覧取得
  rest.get('/api/companies', (req, res, ctx) => {
    const companies = db.company.getAll();
    return res(ctx.status(200), ctx.json(companies));
  }),

  // QA取得（企業ごと）
  rest.get('/api/companies/:companyId/qa', (req, res, ctx) => {
    const { companyId } = req.params;
    const qas = db.qa.findMany({ where: { companyId: { equals: companyId } } });
    return res(ctx.status(200), ctx.json(qas));
  }),

  // チャット送信
  rest.post('/api/chats/:sessionId/messages', async (req, res, ctx) => {
    const { sessionId } = req.params;
    const { content, sender } = await req.json();

    const newMessage = db.chatMessage.create({
      sessionId,
      sender,
      content,
      createdAt: new Date().toISOString(),
    });

    return res(ctx.status(201), ctx.json(newMessage));
  }),
];
