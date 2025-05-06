export const getApprovalRequestEmailTemplate = (title: string, approvalId: string) => {
  const approvalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/content/approvals/${approvalId}`;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Content Approval Request</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #1976d2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 0 0 5px 5px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #1976d2;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Content Approval Request</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>A new content item titled <strong>${title}</strong> requires your approval.</p>
          <p>Please review the content and take appropriate action.</p>
          <div style="text-align: center;">
            <a href="${approvalUrl}" class="button">Review Content</a>
          </div>
          <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
          <p>${approvalUrl}</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
    </html>
  `;
}; 