import { ToolRequest } from '../types';

const STORAGE_KEY_WEBHOOK_URL = 'community_tools_sheets_webhook';
const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwIBA8aRbpKuhIaZCcGsKM7rYC5UHu_LTTEa8A9yI4LjMJ-k4RupDiDRnxqLOQigeBl/exec';

export function getSavedSheetsWebhookUrl(): string {
  const saved = localStorage.getItem(STORAGE_KEY_WEBHOOK_URL);
  if (saved !== null) return saved;
  // Default to user provided webhook url
  localStorage.setItem(STORAGE_KEY_WEBHOOK_URL, DEFAULT_WEBHOOK_URL);
  return DEFAULT_WEBHOOK_URL;
}

export function saveSheetsWebhookUrl(url: string) {
  localStorage.setItem(STORAGE_KEY_WEBHOOK_URL, url.trim());
}

/**
 * Syncs a new or updated tool request to Google Sheets via Webhook (Google Apps Script Web App)
 */
export async function syncPromptToGoogleSheet(
  request: ToolRequest,
  action: 'create' | 'update' = 'create'
): Promise<{ success: boolean; message: string }> {
  const webhookUrl = getSavedSheetsWebhookUrl();
  if (!webhookUrl) {
    return {
      success: false,
      message: 'No Google Sheets webhook configured.',
    };
  }

  try {
    const payload = {
      action,
      id: request.id,
      timestamp: request.createdAt,
      lastUpdated: request.updatedAt,
      authorName: request.authorName,
      authorId: request.authorId,
      isGuest: request.isGuest ? 'Yes' : 'No',
      title: request.title,
      promptDescription: request.description,
      category: request.category,
      status: request.status,
      completedVersion: request.completedVersion || 'N/A',
      pointsAwarded: request.pointsAwarded,
      rejectionReason: request.rejectionReason || 'None',
      votes: request.votes,
    };

    // Google Apps Script requires mode: 'no-cors' or handled response
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });

    return {
      success: true,
      message: `Prompt "${request.title}" synced to Google Sheets!`,
    };
  } catch (err) {
    return {
      success: false,
      message: `Google Sheets sync failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export function formatRequestsForSheetsClipboard(requests: ToolRequest[]): string {
  const header = ['Request ID', 'Timestamp', 'Author Name', 'Author ID', 'Is Guest', 'Title', 'Prompt Description', 'Category', 'Status', 'Shipped Version', 'Points Awarded', 'Rejection Reason', 'Votes'].join('\t');
  const rows = requests.map((r) => [
    r.id,
    r.createdAt,
    r.authorName,
    r.authorId,
    r.isGuest ? 'Yes' : 'No',
    `"${r.title.replace(/"/g, '""')}"`,
    `"${r.description.replace(/"/g, '""')}"`,
    r.category,
    r.status,
    r.completedVersion || '',
    r.pointsAwarded,
    `"${(r.rejectionReason || '').replace(/"/g, '""')}"`,
    r.votes,
  ].join('\t'));

  return [header, ...rows].join('\n');
}

export function downloadRequestsCSV(requests: ToolRequest[]) {
  const tsv = formatRequestsForSheetsClipboard(requests);
  const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `omnitools-requests-${new Date().toISOString().split('T')[0]}.tsv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `// Google Apps Script Web App for OmniTools Request Sync
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  if (data.action === 'create') {
    sheet.appendRow([
      data.id,
      data.timestamp,
      data.authorName,
      data.authorId,
      data.isGuest,
      data.title,
      data.promptDescription,
      data.category,
      data.status,
      data.completedVersion,
      data.pointsAwarded,
      data.rejectionReason,
      data.votes
    ]);
  } else if (data.action === 'update') {
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.id) {
        sheet.getRange(i + 1, 9).setValue(data.status); // Status
        sheet.getRange(i + 1, 10).setValue(data.completedVersion); // Shipped Version
        sheet.getRange(i + 1, 11).setValue(data.pointsAwarded); // Points
        sheet.getRange(i + 1, 12).setValue(data.rejectionReason); // Rejection
        sheet.getRange(i + 1, 13).setValue(data.votes); // Votes
        break;
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
}
`;
