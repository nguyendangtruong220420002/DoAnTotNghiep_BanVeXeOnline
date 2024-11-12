const Bus = require('../../src/models/Bus');

// Thêm một xe buýt mới
const addBus = async (req, res) => {
  try {
    const { busName, busType, cartSeat, licensePlate, Price, userId , status } = req.body; 
    const newBus = new Bus({ busName, busType,cartSeat, licensePlate, Price, userId ,  status: status || 'Chờ' });
    await newBus.save();
    res.status(201).json({ message: 'Thêm xe buýt thành công!', bus: newBus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Không thể thêm xe buýt' });
  }
};
const getBusesByUser = async (req, res) => {
  const { userId } = req.query; 
  //console.log("User ID on server:", userId); 
  if (!userId) {
    return res.status(400).json({ message: 'User ID không được cung cấp' });
  }
  try {
    const buses = await Bus.find({ userId: userId });
    res.status(200).json(buses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Không thể lấy danh sách xe buýt' });
  }
};

const editBus = async (req, res) => {
  const { id } = req.params;
  const { busName, busType,cartSeat, licensePlate, Price, status  } = req.body; 

  try {
    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      { busName, busType,cartSeat, licensePlate ,Price},
      { new: true } // Trả về bản ghi đã cập nhật
    );

    if (!updatedBus) {
      return res.status(404).json({ message: 'Xe buýt không tồn tại' });
    }
    res.status(200).json({ message: 'Sửa xe buýt thành công', bus: updatedBus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Không thể sửa xe buýt' });
  }
};

// Xóa xe buýt
const deleteBus = async (req, res) => {
  const { id } = req.params; // Lấy ID xe buýt từ tham số
  try {
    const deletedBus = await Bus.findByIdAndDelete(id); // Xóa xe buýt theo ID
    if (!deletedBus) {
      return res.status(404).json({ error: 'Xe buýt không tồn tại' });
    }
    res.status(200).json({ message: 'Xóa xe buýt thành công!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Không thể xóa xe buýt' });
  }
};

module.exports = { addBus, getBusesByUser, editBus, deleteBus };