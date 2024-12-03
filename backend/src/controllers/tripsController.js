const Trips = require('../../src/models/Trips');
const Bus = require('../../src/models/Bus');
const BusRoute= require('../../src/models/BusRoute');
const User = require('../../src/models/User');
const moment = require('moment-timezone');

const addNewDays = async () => {
  try {
    const today = moment().startOf('day'); // Ngày bắt đầu của hôm nay

    // Lấy chuyến xe có `tripType` là 'Cố định'
    const existingTrips = await Trips.findOne({ tripType: 'Cố định' });

    if (existingTrips && existingTrips.tripDates) {
      // Lấy ngày cuối cùng trong danh sách hiện tại
      const lastTripDate = moment(
        existingTrips.tripDates[existingTrips.tripDates.length - 1].date
      );

      // Chỉ thêm ngày tiếp theo nếu ngày cuối chưa đạt đến hôm nay + 15 ngày
      const nextTripDate = lastTripDate.clone().add(1, 'day');
      const maxAllowedDate = today.clone().add(15, 'days');

      if (nextTripDate.isSameOrBefore(maxAllowedDate)) {
        await Trips.updateOne(
          { tripType: 'Cố định' },
          {
            $push: {
              tripDates: {
                date: nextTripDate.toDate(),
                sales: { totalTicketsSold: 0, totalRevenue: 0 },
              },
            },
          }
        );
        console.log(`Đã thêm ngày ${nextTripDate.format('YYYY-MM-DD')} vào hệ thống`);
      } else {
        console.log('Không cần thêm ngày mới, đã đủ 15 ngày');
      }
    } else {
      console.log('Không tìm thấy chuyến xe hoặc dữ liệu ngày trống!');
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

// const getTripsByUser = async (req, res) => {
//   const { userId } = req.query;
//   if (!userId) {
//     return res.status(400).json({ message: 'User ID không được cung cấp' });
//   }
//   try {
//     const getTrips = await Trips.find({ userId: userId });
    
//     const tripsWithLocalTime = getTrips.map(trip => ({
//       ...trip.toObject(),
//       departureTime: moment(trip.departureTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm'),
//       endTime: moment(trip.endTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm')
//     }));
//     res.status(200).json(tripsWithLocalTime);
//   } catch (error) {
//     console.error("Error fetching routes:", error);
//     res.status(500).json({ error: 'Không thể lấy danh sách chuyến xe' });
//   }
// };

const getTripsByUser = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'User ID không được cung cấp' });
  }
  try {
    
    const getTrips = await Trips.find({userId: userId });

    const tripsWithLocalTime = getTrips.map(trip => ({
      ...trip.toObject(),
      departureTime: moment(trip.departureTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm'),
      endTime: moment(trip.endTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm'),
      tripDates: trip.tripDates.map((dateObj) => ({
        ...dateObj,
        date: moment(dateObj.date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm'),
        sales: dateObj.sales, 
        bookedSeats: dateObj.bookedSeats 
      }))
    }));
   

    res.status(200).json(tripsWithLocalTime);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: 'Không thể lấy danh sách chuyến xe' });
  }
};
const addTicket = async (req, res) => {
  const { userId, note, tripId, date, status, seatId } = req.body;
  // Kiểm tra dữ liệu đầu vào
  if (!userId || !tripId || !date || !seatId) {
    return res.status(400).json({ message: 'Dữ liệu không đầy đủ' });
  }
  try {
    const formattedDate = date.replace(',', ''); 
    const normalizedDate = moment(formattedDate, 'DD/MM/YYYY HH:mm').tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');

//console.log("normalizedDate", normalizedDate);

const trip = await Trips.findById(tripId);
if (!trip) {
  return res.status(404).json({ message: 'Không tìm thấy chuyến đi' });
}

//console.log("All tripDates:", trip.tripDates);
const tripDate = trip.tripDates.find((td) => {
  const tripDateStr = td.date.toISOString().split('T')[0]; 
  return tripDateStr === normalizedDate;
});

if (!tripDate) {
 // console.log("tripDate", tripDate);
  return res.status(404).json({ message: "Không tìm thấy ngày cho chuyến đi này" });
}
if (!Array.isArray(tripDate.bookedSeats.booked)) {
  tripDate.bookedSeats.booked = []; 
}

const seatExists = tripDate.bookedSeats.booked.some((seat) => seat.seatId === seatId && seat.status !== 'Đã Hủy');
if (seatExists) {
  return res.status(400).json({ message: 'Ghế đã được đặt trước' });
}
    tripDate.bookedSeats.booked.push({
      seatId,
      userId,
      bookingDate: new Date(),
      status,
      note,
    });

    await trip.save();

    res.status(201).json({ message: 'Thêm vé thành công!', ticket: { userId, note, tripId, date, status, seatId } });
  } catch (error) {
    console.error('Error adding ticket:', error);
    res.status(500).json({ error: 'Không thể thêm vé vào hệ thống' });
  }
};

const editTicket = async (req, res) => {
  const { id } = req.params;
  const {  note, tripId, date, status, seatId } = req.body;
  // console.log("id", id);
  // console.log("note", note);
  // console.log("tripId", tripId);
  // console.log("date", date);
  // console.log("status", status);
  // console.log("seatId", seatId);
  
  if (!tripId || !date) {
    return res.status(400).json({ message: 'Dữ liệu không đầy đủ' });
  }

  try {
    const formattedDate = date.replace(',', ''); 
    const normalizedDate = moment(formattedDate, 'DD/MM/YYYY HH:mm').tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');

//console.log("normalizedDate", normalizedDate);

const trip = await Trips.findById(tripId);
if (!trip) {
  return res.status(404).json({ message: 'Không tìm thấy chuyến đi' });
}

//console.log("All tripDates:", trip.tripDates);
const tripDate = trip.tripDates.find((td) => {
  const tripDateStr = td.date.toISOString().split('T')[0]; 
  return tripDateStr === normalizedDate;
});

if (!tripDate) {
 // console.log("tripDate", tripDate);
  return res.status(404).json({ message: "Không tìm thấy ngày cho chuyến đi này" });
}
    if (!Array.isArray(tripDate.bookedSeats.booked)) {
      tripDate.bookedSeats.booked = [];
    }

    // Tìm vé trong danh sách bookedSeats theo seatId và userId
    const ticketIndex = tripDate.bookedSeats.booked.findIndex(ticket => ticket._id.toString() === id);

    if (ticketIndex === -1) {
      return res.status(404).json({ message: "Không tìm thấy vé này" });
    }

    // Cập nhật thông tin vé
    tripDate.bookedSeats.booked[ticketIndex].seatId = seatId;
    tripDate.bookedSeats.booked[ticketIndex].status = status;
    tripDate.bookedSeats.booked[ticketIndex].note = note;

    // Lưu thay đổi vào cơ sở dữ liệu
    await trip.save();
    res.status(200).json({ message: 'Cập nhật vé thành công!', ticket: tripDate.bookedSeats.booked[ticketIndex] });
  } catch (error) {
    console.error('Error editing ticket:', error);
    res.status(500).json({ error: 'Không thể sửa vé trong hệ thống' });
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

    const departureTimeInUTC = departureTimeFormatted.tz('Asia/Ho_Chi_Minh').utc().format();
    const endTimeInUTC = endTimeFormatted.tz('Asia/Ho_Chi_Minh').utc().format();
      console.log("Dữ liệu sau khi chuyển đổi sang UTC:");
      console.log("departureTime (UTC):", departureTimeInUTC);
      console.log("endTime (UTC):", endTimeInUTC);
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
  if (!departure || !destination || !departureDate || !tripType) {
    console.log("Thiếu thông tin tìm kiếm:", { departure, destination, departureDate, returnDate, tripType });
    return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin tìm kiếm' });
  }
  try {
    // const actualDeparture = tripType === "Khứ hồi" ? destination : departure;
    // const actualDestination = tripType === "Khứ hồi" ? departure : destination;
    console.log("Thông tin tìm kiếm:");
    console.log("Loại chuyến:", tripType);
    console.log("Điểm đi:", departure);
    console.log("Điểm đến:", destination);
    console.log("Ngày đi:", departureDate);
    console.log("Ngày về:", returnDate || "Không có");

    const route = await BusRoute.findOne({ departure: departure, destination: destination });

    if (!route) {
      console.log("Không tìm thấy tuyến đường:", { departure, destination });
      return res.status(404).json({ message: 'Tuyến đường không tồn tại' });
    }
    console.log("Tuyến đường tìm thấy:", route);

    const formattedTime = moment(departureDate).format('HH:mm');
    console.log("Thời gian định dạng HH:mm:", formattedTime);

    const queryConditions = {
      routeId: route._id,
      'tripDates.date': {
        $gte: moment(departureDate).startOf('day').toDate(),
        $lte: moment(departureDate).endOf('day').toDate(),
      },
      status: "Đang hoạt động"
    };

    console.log("Điều kiện tìm kiếm chuyến xe:", queryConditions);

    let trips = [];

    if (tripType === "Khứ hồi" && returnDate) {
      console.log("Chuyến khứ hồi với ngày về:", returnDate);

      const departureTrips = await Trips.find(queryConditions)
        .populate('routeId')
        .populate('userId')
        .populate('busId');

      console.log("Danh sách chuyến đi (departureTrips):", departureTrips.length);

      const returnRoute = await BusRoute.findOne({ departure: destination, destination: departure });

      if (returnRoute) {
        console.log("Tuyến đường khứ hồi tìm thấy:", returnRoute);

        const returnTrips = await Trips.find({
          routeId: returnRoute._id,
          'tripDates.date': {
            $gte: moment(returnDate).startOf('day').toDate(),
            $lte: moment(returnDate).endOf('day').toDate(),
          },
          status: "Đang hoạt động"
        })
          .populate('routeId')
          .populate('userId')
          .populate('busId');
        console.log("Danh sách chuyến về (returnTrips):", returnTrips.length);

        departureTrips.forEach(departureTrip => {
          departureTrip.returnTrips = returnTrips.filter(returnTrip =>
            returnTrip.routeId._id.toString() === departureTrip.routeId._id.toString());
        });
        trips = [...departureTrips];
        // console.log("trips", trips)
      } else {
        console.log("Không tìm thấy tuyến đường khứ hồi:", { actualDestination, actualDeparture });
        return res.status(404).json({ message: 'Tuyến đường khứ hồi không tồn tại' });
      }
    } else {
      trips = await Trips.find(queryConditions)
        .populate('routeId')
        .populate('userId')
        .populate('busId');
      console.log("Danh sách chuyến một chiều:", trips.length);
    }
    const tripsWithLocalTime = trips.map(trip => {
      const tripDatesWithLocalTime = trip.tripDates.map(tripDate => ({
        ...tripDate.toObject(),
        date: moment(tripDate.date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm'),
      }));

      const departureTime = trip.departureTime ? moment(trip.departureTime).tz('Asia/Ho_Chi_Minh').format('HH:mm') : null;
      const returnTime = trip.returnTrips && trip.returnTrips[0]
        ? moment(trip.returnTrips[0].departureTime).tz('Asia/Ho_Chi_Minh').format('HH:mm')
        : null;

      if (departureTime && departureTime >= formattedTime) {
        return {
          ...trip.toObject(),
          departureTime: departureTime ? moment(trip.departureTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm') : null,
          endTime: trip.endTime ? moment(trip.endTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm') : null,
          returnTime: returnTime,
          tripDates: tripDatesWithLocalTime,
          user: trip.userId,
          bus: trip.busId,
          returnTrips: trip.returnTrips || []
        };
      }
      return null;
    }).filter(trip => trip !== null);

    console.log("Danh sách chuyến xe đã xử lý (tripsWithLocalTime):", tripsWithLocalTime.length);

    let fromTrips = [];
    let toTrips = [];
    let TripsOne = [];

    if (tripType === "Khứ hồi") {
      fromTrips = tripsWithLocalTime.filter(trip => trip.departureTime);
      toTrips = tripsWithLocalTime.filter(trip => trip.returnTime);
    } else {
      TripsOne = tripsWithLocalTime;
    }

    console.log("Chuyến đi (fromTrips):", fromTrips.length);
    console.log("Chuyến về (toTrips):", toTrips.length);
    console.log("Chuyến một chiều (TripsOne):", TripsOne.length);

    res.status(200).json({
      fromTrips: fromTrips,
      toTrips: toTrips,
      TripsOne: TripsOne
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chuyến xe:", error.message);
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




  module.exports = { addTrips, getTripsByUser, editTrips, deleteTrips, getTripsSeach, updateTripSchedule,deleteTripSchedule,addTicket ,editTicket };
  