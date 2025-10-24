import { google } from 'googleapis';
import type { Response } from '@shared/schema';

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

const SPREADSHEET_TITLE = '商家合作問卷 - 問卷回應';
const SHEET_NAME_POTENTIAL = '潛在合作商家';
const SHEET_NAME_EXISTING = '已合作商家';

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

  // Create new spreadsheet with two sheets
  const createResponse = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: SPREADSHEET_TITLE
      },
      sheets: [
        {
          properties: {
            title: SHEET_NAME_POTENTIAL
          }
        },
        {
          properties: {
            title: SHEET_NAME_EXISTING
          }
        }
      ]
    }
  });

  const spreadsheetId = createResponse.data.spreadsheetId!;
  
  // Get sheet details to retrieve sheetIds
  const getResponse = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId
  });
  
  const sheetsProp = getResponse.data.sheets || [];
  const potentialSheetId = sheetsProp.find(s => s.properties?.title === SHEET_NAME_POTENTIAL)?.properties?.sheetId;
  const existingSheetId = sheetsProp.find(s => s.properties?.title === SHEET_NAME_EXISTING)?.properties?.sheetId;
  
  if (potentialSheetId === undefined || existingSheetId === undefined) {
    throw new Error('Failed to get sheetIds from spreadsheet');
  }

  // Set up headers for potential partners sheet
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME_POTENTIAL}!A1:H1`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        '提交時間',
        '公司名稱',
        '聯絡人姓名',
        '職稱',
        '聯絡方式',
        '合作意願',
        '無意願原因',
        '其他原因'
      ]]
    }
  });

  // Set up headers for existing partners sheet
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME_EXISTING}!A1:H1`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        '提交時間',
        '合作時間',
        '新用戶數量',
        '整體成效評分',
        '客戶滿意度評分',
        '訂單增長評分',
        '品質維持評分',
        'ID'
      ]]
    }
  });

  // Format headers for both sheets
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: potentialSheetId,
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
              sheetId: potentialSheetId,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: 8
            }
          }
        },
        {
          repeatCell: {
            range: {
              sheetId: existingSheetId,
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
              sheetId: existingSheetId,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: 8
            }
          }
        }
      ]
    }
  });

  return spreadsheetId;
}

export async function appendResponseToSheet(response: Response) {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = await findOrCreateSpreadsheet();

    const submittedAt = response.submittedAt ? new Date(response.submittedAt) : new Date();
    const formattedDate = submittedAt.toLocaleString('zh-TW', { 
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // 根據身份分別處理
    if (response.identity === 'potential') {
      // 潛在合作商家
      const notInterestedReasonsText = Array.isArray(response.notInterestedReasons)
        ? response.notInterestedReasons.join(', ')
        : '';

      const rowData = [
        formattedDate,
        response.companyName || '',
        response.contactName || '',
        response.title || '',
        response.contactInfo || '',
        response.cooperationIntention === 'yes' ? '有意願' : '無意願',
        notInterestedReasonsText,
        response.notInterestedReasonOther || ''
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${SHEET_NAME_POTENTIAL}!A:H`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [rowData]
        }
      });
    } else if (response.identity === 'existing') {
      // 已合作商家
      const durationMap: { [key: string]: string } = {
        '<3m': '不到3個月',
        '3-6m': '3–6個月',
        '6-12m': '6–12個月',
        '1y+': '1年以上'
      };

      const rowData = [
        formattedDate,
        durationMap[response.cooperationDuration || ''] || response.cooperationDuration || '',
        response.newCustomerCount || 0,
        response.overallEffectiveness || '',
        response.customerSatisfactionEffect || '',
        response.orderGrowthEffect || '',
        response.qualityMaintenancePerformance || '',
        response.id || ''
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${SHEET_NAME_EXISTING}!A:H`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [rowData]
        }
      });
    }

    console.log('Successfully appended response to Google Sheets');
    return { success: true, spreadsheetId };
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    throw error;
  }
}

