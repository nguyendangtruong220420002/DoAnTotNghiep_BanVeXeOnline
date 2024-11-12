
const BusRoute = require('../../src/models/BusRoute');

const addBusRoute = async (req, res) => {
  try {
    const { routeName, departure, destination, stops, distance, totalFare,userId } = req.body;
    
    const newRoute = new BusRoute({ routeName, departure, destination, stops, distance, totalFare, userId});
    await newRoute.save();
    res.status(201).json({message: 'Thêm tuyến xe thành công!', busRoute: newRoute});
  } catch (error) {
    console.error("Error adding route:", error);
    res.status(500).json({ message: "Không thể thêm tuyến xe" });
  }
};
const getBusRoutesByUser = async (req, res) => {
    const { userId } = req.query;
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID không được cung cấp' });
    }
    try {
      const busRoutes = await BusRoute.find({ userId: userId });
      res.status(200).json(busRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      res.status(500).json({ error: 'Không thể lấy danh sách tuyến xe' });
    }
  };
  const editBusRoute = async (req, res) => {
    const { id } = req.params;
    const { routeName, departure, destination, stops, distance, totalFare } = req.body;
  
    try {
      const updatedRoute = await BusRoute.findByIdAndUpdate(
        id,
        { routeName, departure, destination, stops, distance, totalFare },
        { new: true }
      );
  
      if (!updatedRoute) {
        return res.status(404).json({ message: 'Tuyến xe không tồn tại' });
      }
      res.status(200).json({ message: 'Sửa tuyến xe thành công', busRoute: updatedRoute });
    } catch (error) {
      console.error("Error updating route:", error);
      res.status(500).json({ error: 'Không thể sửa tuyến xe' });
    }
  };
  
  const deleteBusRoute = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedRoute = await BusRoute.findByIdAndDelete(id);
      if (!deletedRoute) {
        return res.status(404).json({ error: 'Tuyến xe không tồn tại' });
      }
      res.status(200).json({ message: 'Xóa tuyến xe thành công!' });
    } catch (error) {
      console.error("Error deleting route:", error);
      res.status(500).json({ error: 'Không thể xóa tuyến xe' });
    }
  };
  module.exports = { addBusRoute, getBusRoutesByUser, editBusRoute, deleteBusRoute };
  