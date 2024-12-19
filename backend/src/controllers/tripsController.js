const Trips = require('../../src/models/Trips');
const Bus = require('../../src/models/Bus');
const BusRoute = require('../../src/models/BusRoute');
const User = require('../../src/models/User');
const moment = require('moment-timezone');

const addNewDays = async () => {
  try {
    const today = moment().startOf('day');

    const existingTrips = await Trips.findOne({ tripType: 'Cố định' });

    if (existingTrips && existingTrips.tripDates) {
      const lastTripDate = moment(
        existingTrips.tripDates[existingTrips.tripDates.length - 1].date
      );

      // Lấy ngày tiếp theo, và kiểm tra nếu ngày đó đã tồn tại chưa trước khi thêm
      const nextTripDate = lastTripDate.clone().add(1, 'day');
      const existingDates = new Set(
        existingTrips.tripDates.map(dateObj => moment(dateObj.date).format('YYYY-MM-DD'))
      );

      // Kiểm tra nếu ngày chưa có trong danh sách thì mới thêm
      if (!existingDates.has(nextTripDate.format('YYYY-MM-DD'))) {
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
        console.log(`Ngày ${nextTripDate.format('YYYY-MM-DD')} đã tồn tại.`);
      }
    } else {
      console.log('Không tìm thấy chuyến xe hoặc dữ liệu ngày trống!');
    }
  } catch (error) {
    console.error('Lỗi khi thêm ngày mới:', error);
  }
};

const addTrips = async (req, res) => {
  try {
    const { TripsName, routeId, busId, userId, status, departureTime, endTime, tripType, schedule: initialSchedule, totalFareAndPrice } = req.body;

    if (!tripType) {
      return res.status(400).json({ message: 'Trip type is required' });
    }

    let tripDates = [];

    // Nếu tripType là 'Cố định'
    if (tripType === 'Cố định') {
      const today = moment().startOf('day');

      // Tạo mảng ngày (15 ngày tiếp theo)
      for (let i = 0; i < 15; i++) {
        const tripDate = today.clone().add(i, 'days').format('YYYY-MM-DD');
        tripDates.push({
          date: moment(tripDate).toDate(),
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
      schedule: initialSchedule || [],
    });

    await newTrip.save();
    await Bus.findByIdAndUpdate(busId, { status: 'Đang phục vụ' });

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
  if (!userId || !tripId || !date || !seatId) {
    return res.status(400).json({ message: 'Dữ liệu không đầy đủ' });
  }

  try {
    const formattedDate = date.replace(',', '');
    const normalizedDate = moment(formattedDate, 'DD/MM/YYYY HH:mm')
      .tz('Asia/Ho_Chi_Minh', true)
      .toISOString(); 

    //console.log("normalizedDate (ISO format):", normalizedDate);
    const tripDateOnly = moment(normalizedDate).format('YYYY-MM-DD');
    //console.log("tripDateOnly:", tripDateOnly);  
    const trip = await Trips.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Không tìm thấy chuyến đi' });
    }

    const tripDate = trip.tripDates.find((td) => {
      const tripDateStr = moment(td.date).format('YYYY-MM-DD'); 
      return tripDateStr === tripDateOnly;
    });
    if (!tripDate) {
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
  const { note, tripId, date, status, seatId } = req.body;

  if (!tripId || !date) {
    return res.status(400).json({ message: 'Dữ liệu không đầy đủ' });
  }

  try {
    const formattedDate = date.replace(',', '');
    const normalizedDate = moment(formattedDate, 'DD/MM/YYYY HH:mm')
      .tz('Asia/Ho_Chi_Minh')  
      .format('YYYY-MM-DD');  
    const trip = await Trips.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Không tìm thấy chuyến đi' });
    }
    const tripDate = trip.tripDates.find((td) => {
      const tripDateStr = moment(td.date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'); 
      return tripDateStr === normalizedDate;
    });

    if (!tripDate) {
      return res.status(404).json({ message: "Không tìm thấy ngày cho chuyến đi này" });
    }
    if (!Array.isArray(tripDate.bookedSeats.booked)) {
      tripDate.bookedSeats.booked = [];
    }
    const ticketIndex = tripDate.bookedSeats.booked.findIndex(ticket => ticket._id.toString() === id);
    if (ticketIndex === -1) {
      return res.status(404).json({ message: "Không tìm thấy vé này" });
    }
    tripDate.bookedSeats.booked[ticketIndex].seatId = seatId;
    tripDate.bookedSeats.booked[ticketIndex].status = status;
    tripDate.bookedSeats.booked[ticketIndex].note = note;
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
    const currentTrip = await Trips.findById(id);
    if (!currentTrip) {
      return res.status(404).json({ message: 'Chuyến xe không tồn tại' });
    }

    let tripDates = [];
    if (tripType === 'Cố định') {
      const today = moment();
      // Tạo mảng tripDates với 15 ngày liên tiếp
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
      // Nếu không phải chuyến cố định, tạo chỉ 1 ngày
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
      tripDates, // Cập nhật mảng tripDates
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


// const updateTripSchedule = async (req, res) => {
//   const { tripId } = req.params;
//   const { schedule } = req.body;

//   try {
//     const trip = await Trips.findByIdAndUpdate(
//       tripId,
//       { $set: { schedule: schedule } },
//       { new: true }
//     );

//     if (!trip) {
//       return res.status(404).json({ message: 'Chuyến đi không tồn tại' });
//     }
//     res.json(trip);
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi server', error });
//   }
// };
const updateTripSchedule = async (req, res) => {
  const { tripId } = req.params;
  const { schedule } = req.body;

  try {
    // Kiểm tra trùng lặp thời gian trong danh sách `schedule`
    const times = schedule.map((item) => item.time);
    const hasDuplicateTimes = new Set(times).size !== times.length;

    if (hasDuplicateTimes) {
      return res.status(400).json({ message: 'Thời gian trong lịch trình không được trùng nhau' });
    }

    // Cập nhật lịch trình trong cơ sở dữ liệu
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



const getTripsSeach = async (req, res) => {
  const { departure, destination, departureDate, returnDate, tripType } = req.query;
  try {
    console.log("Thông tin tìm kiếm:");
    console.log("Loại chuyến:", tripType);
    console.log("Điểm đi:", departure);
    console.log("Điểm đến:", destination);
    console.log("Ngày đi:", departureDate);
    console.log("Ngày về:", returnDate || "Không có");
    const route = await BusRoute.find({ departure: departure, destination: destination });
    if (!route) {
      return res.status(404).json({ message: 'Tuyến đường không tồn tại' });
    }
    console.log("Tuyến đường tìm thấy:", route);
    const formattedTime = moment(departureDate).format('HH:mm');
    const routeIds = route.map(route => route._id);
    const queryConditions = {
      // routeId: route._id,
      routeId: { $in: routeIds },
      'tripDates.date': {
        $gte: moment(departureDate).startOf('day').toDate(),
        $lte: moment(departureDate).endOf('day').toDate(),
      },
      status: "Đang hoạt động"
    };
    // console.log("Điều kiện tìm kiếm chuyến xe:", queryConditions);

    let TripsOne = [];
    let RouteTrips = [];

    if (tripType === "Khứ hồi" && departureDate && returnDate) {

      const departureTrips = await Trips.find(queryConditions)
        .populate('routeId')
        .populate('userId')
        .populate('busId');

      const returnRoute = await BusRoute.find({ departure: destination, destination: departure });
      if (returnRoute) {
        // console.log("Tuyến đường tìm thấy khứ hồi:", returnRoute);
        const returnRouteIds = returnRoute.map(route => route._id);
        const queryConditionsRoundTrip = {
          // routeId: returnRoute._id,
          routeId: { $in: returnRouteIds },
          'tripDates.date': {
            $gte: moment(returnDate).startOf('day').toDate(),
            $lte: moment(returnDate).endOf('day').toDate(),
          },
          status: "Đang hoạt động"
        };
        // console.log("Điều kiện tìm kiếm chuyến xe khứ hồi:", queryConditionsRoundTrip);
        const returnTrips = await Trips.find(queryConditionsRoundTrip)
          .populate('routeId')
          .populate('userId')
          .populate('busId');
        TripsOne = departureTrips;
        RouteTrips = returnTrips;

      }
      else {
        TripsOne = departureTrips;
        return res.status(404).json({ message: 'Tuyến đường khứ hồi không tồn tại' });
      }
    } else {
      const oneWayTrips = await Trips.find(queryConditions)
        .populate('routeId')
        .populate('userId')
        .populate('busId');
      TripsOne = oneWayTrips;
    }
    const tripsWithLocalTime = TripsOne.map(trip => {
      const tripDatesWithLocalTime = trip.tripDates.map(tripDate => ({
        ...tripDate.toObject(),
        date: moment(tripDate.date, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm'),
      }));
      const departureTime = trip.departureTime
        ? moment(trip.departureTime, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('HH:mm')
        : null;
      const returnTime = trip.returnTrips && trip.returnTrips[0]
        ? moment(trip.returnTrips[0].departureTime, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('HH:mm')
        : null;

      return {
        ...trip.toObject(),
        departureTime: departureTime
          ? moment(trip.departureTime, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm')
          : null,
        endTime: trip.endTime
          ? moment(trip.endTime, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm')
          : null,
        returnTime: returnTime
          ? moment(trip.returnTrips[0]?.departureTime, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm')
          : null,
        tripDates: tripDatesWithLocalTime,
        user: trip.userId,
        bus: trip.busId,
        returnTrips: trip.returnTrips || [],
      };
    });

    const RouteTripsWithLocalTime = RouteTrips.map(returnTrip => {
      const returnDatesWithLocalTime = returnTrip.tripDates.map(returnTripDate => ({
        ...returnTripDate.toObject(), date: moment(returnTripDate.date, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm'),
      }));
      const returnTime = returnTrip.departureTime ? moment(returnTrip.departureTime, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('HH:mm') : null;
      const departureTime = returnTrip.departureTime ? moment(returnTrip.departureTime, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('HH:mm') : null;
      return {
        ...returnTrip.toObject(),
        departureTime: departureTime ? moment(returnTrip.departureTime, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm') : null,
        endTime: returnTrip.endTime ? moment(returnTrip.endTime, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm') : null,
        returnTime: returnTime ? moment(returnTrip.departureTime, 'DD/MM/YYYY, HH:mm').tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm') : null,
        tripDates: returnDatesWithLocalTime,
        user: returnTrip.userId,
        bus: returnTrip.busId,
      };
    });

    console.log("Danh sách chuyến xe đã xử lý:", tripsWithLocalTime.length);
    // console.log("Danh sách chuyến xe đã Khư hồi:", RouteTripsWithLocalTime.length);
    res.status(200).json({
      TripsOne: tripsWithLocalTime,
      RouteTrips: RouteTripsWithLocalTime,

    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chuyến xe:", error.message);
    res.status(500).json({ error: 'Không thể lấy danh sách chuyến xe' });
  }
};


module.exports = { addTrips, getTripsByUser, editTrips, deleteTrips, getTripsSeach, updateTripSchedule, deleteTripSchedule, addTicket, editTicket };
