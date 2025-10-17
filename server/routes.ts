import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResponseSchema } from "@shared/schema";
import { appendResponseToSheet } from "./googleSheets";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/responses", async (req, res) => {
    try {
      const validatedData = insertResponseSchema.parse(req.body);
      const response = await storage.createResponse(validatedData);
      
      // Append to Google Sheets asynchronously (don't block response)
      appendResponseToSheet(response).catch(error => {
        console.error('Failed to append to Google Sheets:', error);
      });
      
      res.json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid request data" });
      }
    }
  });

  app.get("/api/responses", async (req, res) => {
    try {
      const responses = await storage.getAllResponses();
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch responses" });
    }
  });

  app.get("/api/responses/:id", async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
