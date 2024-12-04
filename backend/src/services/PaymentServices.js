const PayOS = require('@payos/node');
const CLIENT_ID = process.env.CLIENT_ID;
const API_KEY = process.env.API_KEY;
const CHECKSUM_KEY = process.env.CHECKSUM_KEY;

const payos = new PayOS(CLIENT_ID, API_KEY, CHECKSUM_KEY);
class PaymentServices {
    async getBookingSeat(body) {
        const params = body;
        try {

            const orderCode = params.bookingID;

            console.log('Booking ID:', orderCode);

            if (!orderCode) {
                return { orderInfo: null }; // Trả về thông tin rỗng nếu orderCode không tồn tại
            }

            const orderInfo = await payos.getPaymentLinkInformation(orderCode);
            console.log('Order Information:', orderInfo);

            if (orderInfo) {
                return { orderInfo }; // Trả về thông tin đơn hàng nếu tìm thấy
            } else {
                return { orderInfo: null }; // Không có thông tin đơn hàng
            }
        } catch (error) {
            console.error('Error fetching order information:', error);
            return { orderInfo: null }; // Trả về thông tin rỗng trong trường hợp lỗi
        }
    }

}

module.exports = new PaymentServices();
