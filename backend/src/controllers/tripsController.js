const Trips = require('../../src/models/Trips');
const moment = require('moment-timezone');

const addTrips = async (req, res) => {
  try {
    const { TripsName, routeId, busId, userId, status, bookedSeats, departureTime, endTime } = req.body;
    if (!departureTime || !endTime) {
      return res.status(400).json({ message: 'Thời gian khởi hành và thời gian kết thúc là bắt buộc' });
    }
    const departureTimeFormatted = moment(departureTime, "YYYY-MM-DDTHH:mm", true);
    const endTimeFormatted = moment(endTime, "YYYY-MM-DDTHH:mm", true);

    if (!departureTimeFormatted.isValid() || !endTimeFormatted.isValid()) {
      return res.status(400).json({ message: 'Thời gian không hợp lệ' });
    }
    if (departureTimeFormatted.isSameOrAfter(endTimeFormatted)) {
      return res.status(400).json({ message: 'Thời gian kết thúc phải lớn hơn thời gian khởi hành' });
    }
    const existingTrip = await Trips.findOne({ TripsName });
    if (existingTrip) {
      return res.status(400).json({ message: 'Tên chuyến xe đã tồn tại, vui lòng chọn tên khác' });
    }

    const departureTimeInUTC = departureTimeFormatted.tz('Asia/Ho_Chi_Minh').utc().format();
    const endTimeInUTC = endTimeFormatted.tz('Asia/Ho_Chi_Minh').utc().format();

    const newTrips = new Trips({ 
      TripsName, 
      routeId, 
      busId, 
      userId, 
      departureTime: departureTimeInUTC, 
      endTime: endTimeInUTC, 
      status, 
      bookedSeats 
    });

    // Lưu chuyến xe vào cơ sở dữ liệu
    await newTrips.save();
    res.status(201).json({ message: 'Thêm chuyến xe thành công!', Trips: newTrips });
  } catch (error) {
    console.error("Error adding route:", error);
    res.status(500).json({ message: "Không thể thêm chuyến xe" });
  }
};

const getTripsByUser = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID không được cung cấp' });
  }
  try {
    const getTrips = await Trips.find({ userId: userId });
    
    const tripsWithLocalTime = getTrips.map(trip => ({
      ...trip.toObject(),
      departureTime: moment(trip.departureTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm'),
      endTime: moment(trip.endTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm')
    }));

    res.status(200).json(tripsWithLocalTime);
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ error: 'Không thể lấy danh sách chuyến xe' });
  }
};

const editTrips = async (req, res) => {
  const { id } = req.params;
  const { TripsName, routeId, busId, userId, departureTime, endTime, status, bookedSeats } = req.body;
  // console.log('Dữ liệu nhận được từ frontend:', req.body);
  // console.log('Thời gian khởi hành:', departureTime);
  // console.log('Thời gian kết thúc:', endTime);
  try {
    const departureTimeFormatted = moment(departureTime, "YYYY-MM-DDTHH:mm", true);
    const endTimeFormatted = moment(endTime, "YYYY-MM-DDTHH:mm", true);
    if (!departureTimeFormatted.isValid() || !endTimeFormatted.isValid()) {
      return res.status(400).json({ message: 'Thời gian không hợp lệ' });
    }
    const departureTimeInUTC = departureTimeFormatted.tz('Asia/Ho_Chi_Minh').utc().format();
    const endTimeInUTC = endTimeFormatted.tz('Asia/Ho_Chi_Minh').utc().format();
    
    const updatedTrips = await Trips.findByIdAndUpdate(
      id,
      { TripsName, routeId, busId, departureTime: departureTimeInUTC, endTime: endTimeInUTC, status, bookedSeats },
      { new: true }
    );

    if (!updatedTrips) {
      return res.status(404).json({ message: 'Chuyến xe không tồn tại' });
    }
    if (departureTimeFormatted.isSameOrAfter(endTimeFormatted)) {
      return res.status(400).json({ message: 'Thời gian kết thúc phải lớn hơn thời gian khởi hành' });
    }
    const existingTrip = await Trips.findOne({ TripsName });
    if (existingTrip) {
      return res.status(400).json({ message: 'Tên chuyến xe đã tồn tại, vui lòng chọn tên khác' });
    }
    updatedTrips.departureTime = moment(updatedTrips.departureTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm');
    updatedTrips.endTime = moment(updatedTrips.endTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm');

    res.status(200).json({ message: 'Sửa chuyến xe thành công', Trips: updatedTrips });
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ error: 'Không thể sửa tuyến xe' });
  }
};
  
  const deleteTrips = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleteTrips = await Trips.findByIdAndDelete(id);
      if (!deleteTrips) {
        return res.status(404).json({ error: 'Chuyến xe không tồn tại' });
      }
      res.status(200).json({ message: 'Xóa chuyến xe thành công!' });
    } catch (error) {
      console.error("Error deleting route:", error);
      res.status(500).json({ error: 'Không thể xóa chuyến xe' });
    }
  };
  module.exports = { addTrips, getTripsByUser, editTrips, deleteTrips };
  