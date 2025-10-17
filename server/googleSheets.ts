import { google } from 'googleapis';
import type { InsertResponse } from '@shared/schema';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

const SPREADSHEET_TITLE = 'Uber 店家新用戶獎勵專案 - 問卷回應';
const SHEET_NAME = '回應資料';

async function findOrCreateSpreadsheet() {
  const sheets = await getUncachableGoogleSheetClient();
  const drive = google.drive({ version: 'v3', auth: sheets.context._options.auth as any });

  // Search for existing spreadsheet
  const response = await drive.files.list({
    q: `name='${SPREADSHEET_TITLE}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!;
  }

  // Create new spreadsheet
  const createResponse = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: SPREADSHEET_TITLE
      },
      sheets: [{
        properties: {
          title: SHEET_NAME
        }
      }]
    },
    includeSpreadsheetInResponse: true
  });

  const spreadsheetId = createResponse.data.spreadsheetId!;
  const sheetId = createResponse.data.sheets?.[0]?.properties?.sheetId;
  
  if (sheetId === undefined) {
    throw new Error('Failed to get sheetId from create response');
  }

  // Set up headers
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:J1`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        '提交時間',
        '電子郵件',
        '商家名稱',
        '個資同意',
        '合作意向',
        '聯絡人姓名',
        '聯絡電話',
        '資訊來源',
        '推薦意願',
        '不考慮原因'
      ]]
    }
  });

  // Format headers
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 1
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0, green: 0, blue: 0 },
                textFormat: {
                  foregroundColor: { red: 1, green: 1, blue: 1 },
                  fontSize: 11,
                  bold: true
                },
                horizontalAlignment: 'CENTER'
              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
          }
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: sheetId,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: 10
            }
          }
        }
      ]
    }
  });

  return spreadsheetId;
}

export async function appendResponseToSheet(response: InsertResponse & { submittedAt?: Date }) {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = await findOrCreateSpreadsheet();

    const submittedAt = response.submittedAt || new Date();
    const formattedDate = submittedAt.toLocaleString('zh-TW', { 
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const infoSourceText = Array.isArray(response.infoSource) 
      ? response.infoSource.join(', ') 
      : response.infoSource;

    const rowData = [
      formattedDate,
      response.email,
      response.businessName,
      response.privacyConsent === 'yes' ? '同意' : '不同意',
      response.intention === 'interested' ? '有興趣' : 
        response.intention === 'not_sure' ? '不確定' : '沒興趣',
      response.contactName || '',
      response.contactPhone || '',
      infoSourceText || '',
      response.referral === 'yes' ? '願意推薦' : 
        response.referral === 'no' ? '不願意推薦' : '',
      response.notInterestedReason || ''
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:J`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData]
      }
    });

    console.log('Successfully appended response to Google Sheets');
    return { success: true, spreadsheetId };
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    throw error;
  }
}
