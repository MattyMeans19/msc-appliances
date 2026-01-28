// lib/email.ts
import { Resend } from 'resend';
import { ReceiptEmail } from '@/components/email-receipt';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderReceipt(orderData: any) {
  try {
    // const { data, error } = await resend.emails.send({
    //   from: 'MSC Appliances <orders@mscappliances.com>', // Use your verified domain here
    //   to: [orderData.customer.email],
    //   subject: `Order Confirmed - #${orderData.id.replace('sale_', '')}`,
    //   react: ReceiptEmail({ order: orderData }),
    // });
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Must use this for testing
      to: ['mattymeans@gmail.com'], // Must be YOUR email
      subject: 'Test Receipt',
      react: ReceiptEmail({ order: orderData }),
    })

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email Setup Error:", err);
    return { success: false, err };
  }
}