import { z } from "zod";

// --- 問卷資料結構定義 ---

// 定義問卷資料結構
export const questionnaireSchema = z.object({
  // 共同步驟：身份確認
  identity: z.enum(["potential", "existing"]).describe("受訪者身份：potential (尚未合作) 或 existing (已合作)"),

  // 分支 A：尚未合作商家問卷 (潛在合作夥伴)
  // 問題 A1: 您是否有意願與本公司合作？
  cooperationIntention: z.enum(["yes", "no"]).optional().describe("合作意願：yes (是) 或 no (否)"),
  // 問題 A2: 請填寫您的公司名稱。
  companyName: z.string().optional().describe("公司名稱"),
  // 問題 A3: 請填寫您的姓名。
  contactName: z.string().optional().describe("聯絡人姓名"),
  // 問題 A4: 請選擇您的職稱。
  title: z.enum(["商家老闆", "行銷主管", "門市主管", "其他"]).optional().describe("職稱"),
  // 問題 A5: 請提供您的聯絡方式（電話或 Email）。
  contactInfo: z.string().optional().describe("聯絡方式（電話或 Email）"),
  // 問題 A6: （針對無合作意願者）請問您目前沒有合作意願的主要原因是什麼？
  notInterestedReasons: z.array(z.string()).optional().describe("無合作意願原因"),
  notInterestedReasonOther: z.string().optional().describe("無合作意願原因-其他"),

  // 分支 B：已合作商家問卷 (現有合作夥伴)
  // 問題 B1: 您與本公司的合作時間有多久了？
  cooperationDuration: z.enum(["<3m", "3-6m", "6-12m", "1y+"]).optional().describe("合作時間"),
  // 問題 B2: 帶來的新用戶數量
  newCustomerCount: z.number().int().min(0).optional().describe("帶來的新用戶數量"),
  // 問題 B3: 整體成效評分（1–5分）
  overallEffectiveness: z.number().int().min(1).max(5).optional().describe("整體成效評分"),
  // 問題 B4: 提升客戶滿意度方面的效果（1–5分）
  customerSatisfactionEffect: z.number().int().min(1).max(5).optional().describe("提升客戶滿意度方面的效果"),
  // 問題 B5: 帶動訂單增長方面的效果（1–5分）
  orderGrowthEffect: z.number().int().min(1).max(5).optional().describe("帶動訂單增長方面的效果"),
  // 問題 B6: 品質維持方面的表現（1–5分）
  qualityMaintenancePerformance: z.number().int().min(1).max(5).optional().describe("品質維持方面的表現"),
});

// 插入問卷回應的結構 (用於 API 請求)
export const insertResponseSchema = questionnaireSchema;

// 儲存在後端的完整回應結構
export const responseSchema = questionnaireSchema.extend({
  id: z.string().describe("回應 ID"),
  submittedAt: z.string().describe("提交時間"),
});

// 類型導出
export type QuestionnaireData = z.infer<typeof questionnaireSchema>;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = z.infer<typeof responseSchema>;

