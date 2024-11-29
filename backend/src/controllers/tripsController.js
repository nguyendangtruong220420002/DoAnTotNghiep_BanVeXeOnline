const Trips = require('../../src/models/Trips');
const Bus = require('../../src/models/Bus');
const BusRoute= require('../../src/models/BusRoute');
const moment = require('moment-timezone');

const addNewDays = async () => {
  try {
    const today = moment().startOf('day'); // Bắt đầu từ đầu ngày hiện tại

    // Lấy các chuyến xe có tripType là 'Cố định'
    const existingTrips = await Trips.findOne({ tripType: 'Cố định' });
    let existingDates = [];
    if (existingTrips && existingTrips.tripDates) {
      existingDates = existingTrips.tripDates
        .filter(dateObj => moment(dateObj.date).isSameOrAfter(today))
        .map(dateObj => moment(dateObj.date).format('YYYY-MM-DD'));
    }

    // Thêm các ngày còn thiếu (15 ngày tiếp theo)
    let tripDates = [];
    for (let i = 0; i < 15; i++) {
      const tripDate = today.clone().add(i, 'days').format('YYYY-MM-DD');
      if (!existingDates.includes(tripDate)) {
        tripDates.push({
          date: moment(tripDate).toDate(),
          sales: {
            totalTicketsSold: 0,
            totalRevenue: 0,
          },
        });
      }
    }

    // Cập nhật lại các chuyến xe (nếu có)
    if (tripDates.length > 0) {
      await Trips.updateOne({ tripType: 'Cố định' }, { $push: { tripDates: { $each: tripDates } } });
      console.log('Đã thêm ngày mới vào hệ thống');
    } else {
      console.log('Không có ngày mới nào để thêm');
    }
  } catch (error) {
    console.error('Lỗi khi thêm ngày mới:', error);
  }
};

// Hàm thêm chuyến xe mới
const addTrips = async (req, res) => {
  try {
    const { TripsName, routeId, busId, userId, status, departureTime, endTime, tripType, schedule: initialSchedule, totalFareAndPrice } = req.body;
    
    if (!tripType) {
      return res.status(400).json({ message: 'Trip type is required' });
    }

    let tripDates = [];
    
    if (tripType === 'Cố định') {
      const today = moment().startOf('day'); 
    
      const existingTrips = await Trips.findOne({ tripType: 'Cố định' });
      let existingDates = [];
      if (existingTrips && existingTrips.tripDates) {
        existingDates = existingTrips.tripDates
          .filter(dateObj => moment(dateObj.date).isSameOrAfter(today))
          .map(dateObj => moment(dateObj.date).format('YYYY-MM-DD'));
      }
    
      for (let i = 0; i < 15; i++) {
        const tripDate = today.clone().add(i, 'days').format('YYYY-MM-DD');
        if (!existingDates.includes(tripDate)) {
          tripDates.push({
            date: moment(tripDate).toDate(),
            sales: {
              totalTicketsSold: 0,
              totalRevenue: 0,
            },
          });
        }
      }
    } else {
      if (!departureTime || !endTime) {
        return res.status(400).json({ message: 'Thời gian khởi hành và thời gian kết thúc là bắt buộc cho chuyến xe không cố định' });
      }
      
      const tripDate = moment(departureTime).format('YYYY-MM-DD');
      tripDates.push({
        date: moment(departureTime).toDate(),
        sales: {
          totalTicketsSold: 0,
          totalRevenue: 0,
        },
      });
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

    const newTrip = new Trips({
      TripsName,
      routeId,
      busId,
      userId,
      departureTime: departureTimeInUTC,
      endTime: endTimeInUTC,
      status,
      totalFareAndPrice,
      tripType,
      tripDates,  
      schedule: initialSchedule || []  
    });

    await newTrip.save();
    await Bus.findByIdAndUpdate(busId, { status: 'Đang phục vụ' });

    // Gọi hàm thêm ngày mới tự động sau khi thêm chuyến xe
    await addNewDays();

    res.status(201).json({ message: 'Thêm chuyến xe thành công!', Trip: newTrip });

  } catch (error) {
    console.error("Error adding trip:", error);
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
  const { TripsName, routeId, busId, userId, departureTime, endTime, status, tripType, schedule: updatedSchedule, totalFareAndPrice } = req.body;

  try {
    console.log("Dữ liệu gửi từ frontend:");
    console.log("departureTime từ frontend:", departureTime);
    console.log("endTime từ frontend:", endTime);
    const currentTrip = await Trips.findById(id);
    if (!currentTrip) {
      return res.status(404).json({ message: 'Chuyến xe không tồn tại' });
    }

    // Xử lý dữ liệu chuyến xe theo tripType
    let tripDates = [];
    if (tripType === 'Cố định') {
      const today = moment();
      const existingtripDates = await Trips.find({
        tripType: 'Cố định',
        'tripDates.date': { $gte: today.format('YYYY-MM-DD'), $lt: today.clone().add(15, 'days').format('YYYY-MM-DD') }
      });
      for (let i = 0; i < 15; i++) {
        const tripDate = today.clone().add(i, 'days');
        tripDates.push({
          date: tripDate.toDate(),
          sales: {
            totalTicketsSold: 0,
            totalRevenue: 0,
          },
        });
      }
    } else {
      if (!departureTime || !endTime) {
        return res.status(400).json({ message: 'Thời gian khởi hành và thời gian kết thúc là bắt buộc cho chuyến xe không cố định' });
      }
      
      const tripDate = moment(departureTime).format('YYYY-MM-DD');
      tripDates.push({
        date: moment(departureTime).toDate(),
        sales: {
          totalTicketsSold: 0,
          totalRevenue: 0,
        },
      });
    }

    const departureTimeFormatted = moment(departureTime, "YYYY-MM-DDTHH:mm", true);
    const endTimeFormatted = moment(endTime, "YYYY-MM-DDTHH:mm", true);

    if (!departureTimeFormatted.isValid() || !endTimeFormatted.isValid()) {
      return res.status(400).json({ message: 'Thời gian không hợp lệ' });
    }
    if (departureTimeFormatted.isSameOrAfter(endTimeFormatted)) {
      return res.status(400).json({ message: 'Thời gian kết thúc phải lớn hơn thời gian khởi hành' });
    }

    const existingTrip = await Trips.findOne({ TripsName, _id: { $ne: id } });
    if (existingTrip) {
      return res.status(400).json({ message: 'Tên chuyến xe đã tồn tại, vui lòng chọn tên khác' });
    }

    // Chuyển đổi giờ phút về định dạng UTC
    const departureTimeInUTC = departureTimeFormatted.tz('Asia/Ho_Chi_Minh').utc().format();
    const endTimeInUTC = endTimeFormatted.tz('Asia/Ho_Chi_Minh').utc().format();

      // Log lại dữ liệu sau khi chuyển đổi giờ phút
      console.log("Dữ liệu sau khi chuyển đổi sang UTC:");
      console.log("departureTime (UTC):", departureTimeInUTC);
      console.log("endTime (UTC):", endTimeInUTC);

    // Cập nhật dữ liệu chuyến xe
    const updatedData = {
      TripsName,
      routeId,
      busId,
      userId,
      departureTime: departureTimeInUTC,
      endTime: endTimeInUTC,
      status,
      totalFareAndPrice,
      tripType,
      tripDates,  
      schedule: updatedSchedule || []  
    };

    if (currentTrip.busId.toString() !== busId) {
      await Bus.findByIdAndUpdate(currentTrip.busId, { status: 'Chờ' });
      await Bus.findByIdAndUpdate(busId, { status: 'Đang phục vụ' });
    }

    const updatedTrips = await Trips.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: 'Sửa chuyến xe thành công', Trips: updatedTrips });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ error: 'Không thể sửa chuyến xe' });
  }
};
  
  const deleteTrips = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleteTrips = await Trips.findByIdAndDelete(id);
      if (!deleteTrips) {
        return res.status(404).json({ error: 'Chuyến xe không tồn tại' });
      }
      await Bus.findByIdAndUpdate(deleteTrips.busId, { status: 'Chờ' });
      res.status(200).json({ message: 'Xóa chuyến xe thành công!' });
    } catch (error) {
      console.error("Error deleting route:", error);
      res.status(500).json({ error: 'Không thể xóa chuyến xe' });
    }
  };


const updateTripSchedule = async (req, res) => {
  const { tripId } = req.params; 
  const { schedule } = req.body; 

  try {
    const trip = await Trips.findByIdAndUpdate(
      tripId,
      { $set: { schedule: schedule } }, 
      { new: true } 
    );

    if (!trip) {
      return res.status(404).json({ message: 'Chuyến đi không tồn tại' }); 
    }
    res.json(trip); 
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error }); 
  }
};

const getTripsSeach = async (req, res) => {
  const { departure, destination, departureDate, returnDate, tripType } = req.query;
  console.log("departureDate",departureDate );

  // Kiểm tra các tham số cần thiết
  if (!departure || !destination || !departureDate || !tripType) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin tìm kiếm' });
  }

  try {
      // Tìm tuyến đường
      const route = await BusRoute.findOne({ departure, destination });

      if (!route) {
          return res.status(404).json({ message: 'Tuyến đường không tồn tại' });
      }
      const departureMoment = moment(departureDate).tz('Asia/Ho_Chi_Minh');
      // Điều kiện tìm kiếm chuyến xe
      const queryConditions = {
          routeId: route._id,
          'tripDates.date': {
              $gte: moment(departureDate).startOf('day').toDate(),
              $lte: moment(departureDate).endOf('day').toDate(),
          },
       
      };
      if (departureMoment.isSame(moment(), 'day')) {
     
        const filterTime = moment().tz('Asia/Ho_Chi_Minh').toDate();
        queryConditions['departureTime'] = { $gte: filterTime }; 
      }
      if (tripType === "Khứ hồi" && returnDate) {
          queryConditions.returnDate = {
              $gte: moment(returnDate).startOf('day').toDate(),
              $lte: moment(returnDate).endOf('day').toDate(),
          };
      }
      const trips = await Trips.find(queryConditions)
          .populate('routeId')
          .populate('userId')
          .populate('busId');
      const tripsWithLocalTime = trips.map(trip => {
          const tripDatesWithLocalTime = trip.tripDates.map(tripDate => ({
              ...tripDate.toObject(),
              date: moment(tripDate.date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm'),
          }));

          return {
              ...trip.toObject(),
              departureTime: moment(trip.departureTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm'),
              endTime: moment(trip.endTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm'),
              tripDates: tripDatesWithLocalTime, 
              user: trip.userId,
              bus: trip.busId,
          };
      });

      res.status(200).json(tripsWithLocalTime);
  } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ error: 'Không thể lấy danh sách chuyến xe' });
  }
};

const deleteTripSchedule = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trips.findByIdAndUpdate(
      tripId,
      { $unset: { schedule: "" } }, 
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: 'Chuyến đi không tồn tại' });
    }
    res.json({ message: 'Lịch trình chuyến đi đã bị xóa thành công', trip });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};




  module.exports = { addTrips, getTripsByUser, editTrips, deleteTrips, getTripsSeach, updateTripSchedule,deleteTripSchedule};
  