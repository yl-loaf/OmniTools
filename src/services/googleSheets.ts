import { ToolRequest } from '../types';

const STORAGE_KEY_WEBHOOK_URL = 'community_tools_sheets_webhook';

export function getSavedSheetsWebhookUrl(): string {
  return localStorage.getItem(STORAGE_KEY_WEBHOOK_URL) || '';
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
      message: 'No Google Sheets webhook configured. You can configure one in the Sheets Sync panel or copy formatted rows.',
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
  } catch (err: any) {
    console.error('Failed to sync to Google Sheet webhook:', err);
    return {
      success: false,
      message: `Webhook sync failed: ${err?.message || 'Network error'}`,
    };
  }
}

/**
 * Generates TSV (Tab Separated Values) for direct clipboard paste into Google Sheets
 */
export function formatRequestsForSheetsClipboard(requests: ToolRequest[]): string {
  const headers = [
    'Request ID',
    'Timestamp',
    'Author Name',
    'Account Type',
    'Feature Title',
    'User Prompt / Requirements',
    'Category',
    'Status',
    'Shipped Website Version',
    'Points Awarded (CP)',
    'Rejection Reason',
    'Upvotes'
  ];

  const rows = requests.map(r => [
    r.id,
    new Date(r.createdAt).toLocaleString(),
    r.authorName,
    r.isGuest ? 'Guest' : 'Logged In',
    r.title.replace(/\t/g, ' '),
    r.description.replace(/[\t\n\r]/g, ' '),
    r.category,
    r.status.toUpperCase(),
    r.completedVersion || 'Pending',
    r.pointsAwarded,
    r.rejectionReason || 'None',
    r.votes
  ]);

  return [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n');
}

/**
 * Downloads a CSV file for manual Google Sheets import
 */
export function downloadRequestsCSV(requests: ToolRequest[]) {
  const headers = [
    'Request ID',
    'Timestamp',
    'Author Name',
    'Account Type',
    'Feature Title',
    'User Prompt',
    'Category',
    'Status',
    'Website Version',
    'Points Awarded',
    'Rejection Reason',
    'Votes'
  ];

  const escapeCSV = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const rows = requests.map(r => [
    escapeCSV(r.id),
    escapeCSV(r.createdAt),
    escapeCSV(r.authorName),
    escapeCSV(r.isGuest ? 'Guest' : 'Logged In'),
    escapeCSV(r.title),
    escapeCSV(r.description),
    escapeCSV(r.category),
    escapeCSV(r.status),
    escapeCSV(r.completedVersion || ''),
    escapeCSV(r.pointsAwarded),
    escapeCSV(r.rejectionReason || ''),
    escapeCSV(r.votes),
  ]);

  const csvContent = [headers.map(escapeCSV).join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `vex-community-prompts-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `// Paste this in Google Sheets > Extensions > Apps Script:
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Request ID", "Timestamp", "Author", "Type", "Title",
      "User Prompt", "Category", "Status", "Version", "CP", "Rejection Reason", "Votes"
    ]);
  }
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.id, data.timestamp, data.authorName, data.isGuest, data.title,
    data.promptDescription, data.category, data.status, data.completedVersion,
    data.pointsAwarded, data.rejectionReason, data.votes
  ]);
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
