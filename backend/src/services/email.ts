import nodemailer from 'nodemailer';

// Helper to strip quotes and trim
const cleanEnv = (val: string | undefined): string => {
    if (!val) return '';
    return val.trim().replace(/^["']|["']$/g, '');
};

// Transporter instance (will be initialized in initializeEmailService)
let transporter: any = null;

// Helper to initialize email service (logs config and validates)
export const initializeEmailService = async () => {
    console.log('--- Email Service Diagnostic ---');
    console.log('Current Working Directory:', process.cwd());

    // Validate all required SMTP environment variables
    const smtpHost = cleanEnv(process.env.SMTP_HOST);
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = cleanEnv(process.env.SMTP_USER);
    const smtpPass = cleanEnv(process.env.SMTP_PASS);
    const smtpFrom = cleanEnv(process.env.SMTP_FROM);

    console.log('SMTP_HOST:', `"${smtpHost}"`);
    console.log('SMTP_PORT:', `"${smtpPort}"`);
    console.log('SMTP_USER:', `"${smtpUser}"`);
    console.log('SMTP_FROM:', `"${smtpFrom}"`);
    console.log('SMTP_PASS length:', smtpPass.length);
    console.log('SMTP_PASS starts with:', smtpPass.substring(0, 10) + '...');
    console.log('SMTP_PASS ends with:', '...' + smtpPass.substring(smtpPass.length - 10));

    // Hard validation - throw error if any required value is missing
    if (!smtpHost || smtpHost.length === 0) {
        throw new Error('SMTP_HOST is required but not defined in environment variables');
    }
    if (!smtpPort || smtpPort.length === 0) {
        throw new Error('SMTP_PORT is required but not defined in environment variables');
    }
    if (!smtpUser || smtpUser.length === 0) {
        throw new Error('SMTP_USER is required but not defined in environment variables');
    }
    if (!smtpPass || smtpPass.length === 0) {
        throw new Error('SMTP_PASS is required but not defined in environment variables');
    }

    console.log('✅ All SMTP environment variables validated');

    // Create transporter with EXPLICIT values only - NO FALLBACKS
    const transportConfig = {
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: false, // Use STARTTLS
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        debug: true,
        logger: true,
    };

    console.log('Creating transporter with config:');
    console.log('  host:', transportConfig.host);
    console.log('  port:', transportConfig.port);
    console.log('  secure:', transportConfig.secure);
    console.log('  auth.user:', transportConfig.auth.user);
    console.log('  auth.pass (first 10):', transportConfig.auth.pass.substring(0, 10) + '...');
    console.log('  auth.pass (last 10):', '...' + transportConfig.auth.pass.substring(transportConfig.auth.pass.length - 10));

    transporter = nodemailer.createTransport(transportConfig);

    console.log('Transporter created successfully');

    // Test the connection
    try {
        await transporter.verify();
        console.log('✅ SMTP Connection verified successfully!');
    } catch (error: any) {
        console.error('❌ SMTP Connection verification failed:', error.message);
        throw error; // Re-throw to prevent server from starting with broken email
    }
    console.log('--------------------------------');
};

export const sendQuoteEmail = async (quote: any) => {
    if (!transporter) {
        throw new Error('Email transporter not initialized. Call initializeEmailService first.');
    }

    const { clientName, clientEmail, clientAddress, parts, labor, fees, totalAmount, signature, id } = quote;

    if (!clientEmail) {
        console.log('No client email provided, skipping email.');
        return;
    }

    const partsHtml = parts.map((p: any) => `
        <tr>
            <td>${p.name}</td>
            <td>${p.partNumber}</td>
            <td>${p.quantity}</td>
            <td>$${Number(p.markupPrice).toFixed(2)}</td>
        </tr>
    `).join('');

    const laborHtml = labor.map((l: any) => `
        <tr>
            <td>${l.description}</td>
            <td>${l.hours} hrs</td>
            <td>$${Number(l.hourlyRate).toFixed(2)}/hr</td>
            <td>$${Number(l.total).toFixed(2)}</td>
        </tr>
    `).join('');

    const feesHtml = fees.map((f: any) => `
        <tr>
            <td colspan="3">${f.name}</td>
            <td>$${Number(f.amount).toFixed(2)}</td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Quote #${id.substring(0, 8)}</h2>
            <p>Dear ${clientName},</p>
            <p>Thank you for your business. Here are the details of your service quote.</p>
            
            <h3>Client Information</h3>
            <p><strong>Name:</strong> ${clientName}</p>
            <p><strong>Address:</strong> ${clientAddress}</p>
            
            <h3>Parts & Materials</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f8f9fa; text-align: left;">
                    <th style="padding: 8px;">Item</th>
                    <th style="padding: 8px;">PN</th>
                    <th style="padding: 8px;">Qty</th>
                    <th style="padding: 8px;">Price</th>
                </tr>
                ${partsHtml}
            </table>

            <h3>Labor</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f8f9fa; text-align: left;">
                    <th style="padding: 8px;">Description</th>
                    <th style="padding: 8px;">Hours</th>
                    <th style="padding: 8px;">Rate</th>
                    <th style="padding: 8px;">Total</th>
                </tr>
                ${laborHtml}
            </table>

            ${fees.length > 0 ? `
                <h3>Additional Fees</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    ${feesHtml}
                </table>
            ` : ''}

            <div style="text-align: right; margin-top: 20px;">
                <h3>Total Amount: $${Number(totalAmount).toFixed(2)}</h3>
            </div>

            <div style="margin-top: 40px;">
                <h3>Signature</h3>
                <img src="${signature}" alt="Customer Signature" style="max-width: 200px; border: 1px solid #ccc; padding: 10px;" />
                <p>Signed on: ${new Date().toLocaleDateString()}</p>
            </div>
        </div>
    `;

    try {
        const from = process.env.SMTP_FROM || '"HVAC Service" <service@hvac.com>';
        console.log('Sending email from:', from);
        const info = await transporter.sendMail({
            from: from,
            to: clientEmail,
            subject: `Service Quote #${id.substring(0, 8)}`,
            html: html,
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
