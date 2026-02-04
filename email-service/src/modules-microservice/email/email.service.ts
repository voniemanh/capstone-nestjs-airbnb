import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import transporter from 'src/common/node-mailer/init.node-mailer';
import { MAIL_SENDER } from 'src/common/constant/app.constant';

@Injectable()
export class EmailService {
    private formatDate(date?: Date) {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('vi-VN');
    }
    private formatPrice(price?: number) {
         if (!price) return '—';
        return price.toLocaleString('en-US') + ' USD';
    }
    create(data: CreateEmailDto) {
        const {
            bookingId,
            name,
            email,
            checkIn,
            checkOut,
            totalPrice,
        } = data;

        const textContent = `
        XÁC NHẬN ĐẶT PHÒNG

        Mã booking: ${bookingId ?? '—'}
        Khách hàng: ${name ?? '—'}
        Email: ${email ?? '—'}

        Check-in: ${this.formatDate(checkIn)}
        Check-out: ${this.formatDate(checkOut)}

        Tổng tiền: ${this.formatPrice(totalPrice)}

        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
        `;

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2 style="color: #2c3e50;">✅ XÁC NHẬN ĐẶT PHÒNG</h2>

            <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px; font-weight: bold;">Mã booking</td>
                <td style="padding: 8px;">${bookingId ?? '—'}</td>
            </tr>
            <tr>
                <td style="padding: 8px; font-weight: bold;">Khách hàng</td>
                <td style="padding: 8px;">${name ?? '—'}</td>
            </tr>
            <tr>
                <td style="padding: 8px; font-weight: bold;">Email</td>
                <td style="padding: 8px;">${email ?? '—'}</td>
            </tr>
            <tr>
                <td style="padding: 8px; font-weight: bold;">Check-in</td>
                <td style="padding: 8px;">${this.formatDate(checkIn)}</td>
            </tr>
            <tr>
                <td style="padding: 8px; font-weight: bold;">Check-out</td>
                <td style="padding: 8px;">${this.formatDate(checkOut)}</td>
            </tr>
            <tr>
                <td style="padding: 8px; font-weight: bold;">Tổng tiền</td>
                <td style="padding: 8px; color: #e74c3c; font-weight: bold;">
                ${this.formatPrice(totalPrice)}
                </td>
            </tr>
            </table>

            <p style="margin-top: 20px;">
            Cảm ơn bạn <b>${name ?? ''}</b> đã tin tưởng và đặt phòng.
            </p>

            <p style="color: #888; font-size: 12px;">
            Email này được gửi tự động, vui lòng không trả lời.
            </p>
        </div>
        `;

        transporter.sendMail({
            from: MAIL_SENDER,
            to: email || MAIL_SENDER,
            subject: `Xác nhận booking #${bookingId ?? ''}`,
            text: textContent,
            html: htmlContent,
        });

        return 'Email confirmation sent successfully ✅';
    }

}
