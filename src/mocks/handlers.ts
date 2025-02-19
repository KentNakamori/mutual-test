// mocks/handlers.ts
import {
  rest,
  RestRequest,
  ResponseComposition,
  RestContext,
} from "msw";
import { db } from "./db";

/**
 * POST /auth/login 用のリクエストボディ
 */
interface AuthLoginRequest {
  email: string;
  password: string;
}

/**
 * POST /auth/guest 用のリクエストボディ
 */
interface AuthGuestRequest {
  agreeTerms: boolean;
}

/**
 * 簡易的にIDを生成するユーティリティ
 */
function generateId(prefix: string): string {
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${Date.now()}-${random}`;
}

export const handlers = [
  /**
   * 1) POST /auth/login
   * - Request Body: { email, password }
   */
  rest.post<AuthLoginRequest, {}>("/auth/login", ( 
    req: RestRequest<AuthLoginRequest>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    // リクエストボディを型付きで取得
    const { email, password } = req.body;

    // 簡易的にDB検索 (db.users)
    const user = db.users.find((u) => u.email === email);
    if (!user || user.password !== password) {
      return res(
        ctx.status(401),
        ctx.json({
          error: {
            code: "AUTH_FAILED",
            message: "Invalid email or password.",
          },
        })
      );
    }

    // 成功した場合のモックトークン
    const mockToken = `mocked-jwt-${user.id}`;
    return res(
      ctx.status(200),
      ctx.json({
        token: mockToken,
        userId: user.id,
        expiresIn: 3600,
      })
    );
  }),

  /**
   * 2) POST /auth/guest
   * - リクエストボディ: { agreeTerms: boolean }
   */
  rest.post<AuthGuestRequest, {}>("/auth/guest", (
    req: RestRequest<AuthGuestRequest>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    const { agreeTerms } = req.body;
    if (!agreeTerms) {
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            code: "BAD_REQUEST",
            message: "You must agree to the terms.",
          },
        })
      );
    }

    // ゲストユーザー登録
    const guestId = generateId("guest");
    db.users.push({
      id: guestId,
      role: "guest",
      email: "",
      password: "",
      displayName: "GuestUser",
      notificationSettings: { notifyOnNewQA: false },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return res(
      ctx.status(200),
      ctx.json({
        guestToken: `guest-token-${guestId}`,
        expiresIn: 1800,
      })
    );
  }),

  /**
   * 3) GET /users/me
   */
  rest.get<null, {}>("/users/me", (
    req: RestRequest,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return res(
        ctx.status(401),
        ctx.json({ error: { message: "No token provided" } })
      );
    }

    const token = authHeader.replace("Bearer ", "");
    // mockToken: "mocked-jwt-user-1" -> user-1だけ取り出す例
    const userId = token.split("-").pop(); 
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      return res(
        ctx.status(401),
        ctx.json({ error: { message: "Invalid token" } })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        id: user.id,
        role: user.role,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    );
  }),

  /**
   * 4) PATCH /users/me
   * - Body: { displayName?, notificationSettings? } (PartialでOK)
   */
  rest.patch<Partial<{ displayName: string; notificationSettings?: { notifyOnNewQA: boolean } }>, {}>(
    "/users/me",
    (
      req: RestRequest<Partial<{ displayName: string; notificationSettings?: { notifyOnNewQA: boolean } }>>,
      res: ResponseComposition,
      ctx: RestContext
    ) => {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return res(
          ctx.status(401),
          ctx.json({ error: { message: "No token provided" } })
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const userId = token.split("-").pop();
      const userIndex = db.users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return res(
          ctx.status(401),
          ctx.json({ error: { message: "Invalid token" } })
        );
      }

      // Bodyから更新
      const updateData = req.body;
      db.users[userIndex] = {
        ...db.users[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      return res(ctx.status(200), ctx.json(db.users[userIndex]));
    }
  ),

  /**
   * 5) GET /companies
   * - クエリ: search, industry など
   */
  rest.get<null, {}>("/companies", (
    req: RestRequest,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    const search = req.url.searchParams.get("search") || "";
    const industry = req.url.searchParams.get("industry") || "";

    let filtered = db.companies;
    if (search) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (industry) {
      filtered = filtered.filter((c) => c.industry === industry);
    }

    return res(
      ctx.status(200),
      ctx.json({
        data: filtered,
        totalCount: filtered.length,
      })
    );
  }),

  /**
   * 6) GET /companies/:companyId
   */
  rest.get<null, { companyId: string }>("/companies/:companyId", (
    req: RestRequest<null, { companyId: string }>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    const { companyId } = req.params;
    const company = db.companies.find((c) => c.id === companyId);
    if (!company) {
      return res(
        ctx.status(404),
        ctx.json({ error: { message: "Company not found" } })
      );
    }

    // isFollowingを適当にfalse固定で返す例
    const isFollowing = false;

    return res(
      ctx.status(200),
      ctx.json({
        ...company,
        isFollowing,
      })
    );
  }),

  /**
   * 7) POST /companies/:companyId/follow
   */
  rest.post<null, { companyId: string }>("/companies/:companyId/follow", (
    req: RestRequest<null, { companyId: string }>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    const { companyId } = req.params;
    const companyIndex = db.companies.findIndex((c) => c.id === companyId);
    if (companyIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ error: { message: "Company not found" } })
      );
    }
    db.companies[companyIndex].followerCount += 1;
    db.companies[companyIndex].updatedAt = new Date().toISOString();

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        isFollowing: true,
        followerCount: db.companies[companyIndex].followerCount,
      })
    );
  }),

  /**
   * 8) GET /qa
   * - クエリ: companyId, keyword
   */
  rest.get<null, {}>("/qa", (
    req: RestRequest,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    const companyId = req.url.searchParams.get("companyId");
    const keyword = req.url.searchParams.get("keyword") || "";

    let filtered = db.qas;
    if (companyId) {
      filtered = filtered.filter((qa) => qa.companyId === companyId);
    }
    if (keyword) {
      filtered = filtered.filter(
        (qa) => qa.question.includes(keyword) || qa.answer.includes(keyword)
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        data: filtered,
        totalCount: filtered.length,
      })
    );
  }),

  /**
   * 9) POST /qas/:qaId/like
   */
  rest.post<null, { qaId: string }>("/qas/:qaId/like", (
    req: RestRequest<null, { qaId: string }>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    const { qaId } = req.params;
    const qaIndex = db.qas.findIndex((qa) => qa.id === qaId);
    if (qaIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ error: { message: "QA not found" } })
      );
    }

    db.qas[qaIndex].likeCount++;
    db.qas[qaIndex].updatedAt = new Date().toISOString();
    return res(
      ctx.status(200),
      ctx.json({
        likeCount: db.qas[qaIndex].likeCount,
      })
    );
  }),

  /**
   * 10) POST /chat
   * - Body: { message, sessionId? }
   */
  rest.post<
    { message: string; sessionId?: string },
    {}
  >("/chat", (
    req: RestRequest<{ message: string; sessionId?: string }>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    const { message, sessionId } = req.body;
    let currentSessionId = sessionId;

    // 新規セッション作成(ここでは userId="user-1"固定例)
    if (!currentSessionId) {
      currentSessionId = generateId("chat-sess");
      db.chatSessions.push({
        id: currentSessionId,
        userId: "user-1",
        companyId: undefined,
        title: "",
        isArchived: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // ユーザーメッセージ
    const userMessageId = generateId("msg");
    db.chatMessages.push({
      id: userMessageId,
      sessionId: currentSessionId,
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // AIダミー返信
    const aiMessageId = generateId("msg");
    const aiReply = "This is a mock AI response.";
    db.chatMessages.push({
      id: aiMessageId,
      sessionId: currentSessionId,
      role: "ai",
      content: aiReply,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return res(
      ctx.status(200),
      ctx.json({
        sessionId: currentSessionId,
        answer: aiReply,
      })
    );
  }),
];
