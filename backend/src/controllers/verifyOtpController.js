const admin = require('../../src/services/firebaseConfig');

exports.verifyOtp = async (req, res) => {
  const { verificationId, otp } = req.body;

  if (!verificationId || !otp) {
    return res.status(400).json({ error: 'Thiếu thông tin xác thực' });
  }

  try {
    const credential = admin.auth.PhoneAuthProvider.credential(verificationId, otp);
    const user = await admin.auth().signInWithCredential(credential);
    
    res.status(200).json({ message: 'Xác thực thành công', user });
  } catch (error) {
    console.error('Xác thực OTP thất bại:', error);
    res.status(400).json({ error: 'Mã OTP không hợp lệ hoặc xác thực thất bại.' });
  }
};