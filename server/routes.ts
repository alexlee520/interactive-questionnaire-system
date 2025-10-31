import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResponseSchema } from "@shared/schema";
import { appendResponseToSheet } from "./googleSheets";
import passport from "passport";
import { requireAuth, requireRole, addUser, removeUser, updateUserRole, getAllUsers, getUserByUsername } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Public questionnaire submission endpoint
  app.post("/api/responses", async (req, res) => {
    try {
      const validatedData = insertResponseSchema.parse(req.body);
      const response = await storage.createResponse(validatedData);
      
      // Append to Google Sheets asynchronously (don't block response)
      // 這裡需要更新 appendResponseToSheet 的邏輯來處理新的資料結構
      // 目前先保留，但實際部署時需確保其能正確處理新的 Response 類型
      appendResponseToSheet(response).catch(error => {
        console.error('Failed to append to Google Sheets:', error);
      });
      
      res.json(response);
    } catch (error) {
      if (error instanceof Error) {
        // Zod 驗證錯誤會在這裡捕獲
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid request data" });
      }
    }
  });

  // Authentication endpoints
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ error: "登入過程發生錯誤" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "登入失敗" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "登入過程發生錯誤" });
        }
        // Don't send password
        const { password, ...userWithoutPassword } = user;
        return res.json({ user: userWithoutPassword });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "登出失敗" });
      }
      res.json({ message: "登出成功" });
    });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    const { password, ...userWithoutPassword } = req.user as any;
    res.json({ user: userWithoutPassword });
  });

  // Protected admin endpoints - require authentication
  app.get("/api/admin/responses", requireRole("viewer"), async (req, res) => {
    try {
      const responses = await storage.getAllResponses();
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch responses" });
    }
  });

  app.get("/api/admin/responses/:id", requireRole("viewer"), async (req, res) => {
    try {
      const response = await storage.getResponse(req.params.id);
      if (!response) {
        res.status(404).json({ error: "Response not found" });
        return;
      }
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch response" });
    }
  });

  // User management endpoints - require admin role
  app.get("/api/admin/users", requireRole("admin"), (req, res) => {
    try {
      const users = getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", requireRole("admin"), (req, res) => {
    try {
      const { username, password, email, role } = req.body;
      
      if (!username || !password || !email) {
        return res.status(400).json({ error: "使用者名稱、密碼和 Email 為必填" });
      }
      
      const user = addUser(username, password, email, role || "viewer");
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Failed to create user" });
      }
    }
  });

  app.delete("/api/admin/users/:username", requireRole("admin"), (req, res) => {
    try {
      const { username } = req.params;
      const success = removeUser(username);
      
      if (!success) {
        return res.status(404).json({ error: "使用者不存在" });
      }
      
      res.json({ message: "使用者已刪除" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  app.patch("/api/admin/users/:username/role", requireRole("admin"), (req, res) => {
    try {
      const { username } = req.params;
      const { role } = req.body;
      
      if (!role || !["viewer", "editor", "admin"].includes(role)) {
        return res.status(400).json({ error: "無效的角色" });
      }
      
      const user = updateUserRole(username, role);
      
      if (!user) {
        return res.status(404).json({ error: "使用者不存在" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

