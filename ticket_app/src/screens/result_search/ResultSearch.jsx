import { FlatList, Image, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'react-native-elements';
import { styles } from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import darkColors from 'react-native-elements/dist/config/colorsDark';
import { generateDateRange } from "../../config/DateConfig"
import Loading from '../loading/Loading'; // Import the Loading component
import moment from 'moment-timezone';

const ResultSearch = () => {

    const route = useRoute();
    const nav = useNavigation();
    const flatListRef = useRef(null);
    // Parse 'ngaydi' from the navigation params
    const ngaydi = route.params?.ngaydi ? new Date(route.params.ngaydi) : new Date();
    const diemdi = route.params?.diemdi;
    const diemden = route.params?.diemden;
    const soVe = route.params?.soVe;
    const trips = route.params?.trips;


    // Generate initial dates starting from ngaydi
    const [dateArray, setDateArray] = useState(generateDateRange(ngaydi));

    const [loading, setLoading] = useState(true); // Loading state
    // modal Filter
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(''); // Lưu lựa chọn của người dùng
    const [selectedOptions, setSelectedOptions] = useState({
        'Giá': '',
        'Loại ghế': '',
        'Khung giờ': '',
    });

    const monthValue = ngaydi.getMonth() + 1;
    const dayValue = ngaydi.getDate();

    const [date, setDate] = useState(dayValue.toString());
    const [month, setMonth] = useState(monthValue.toString().padStart(2, '0'));
    const [day, setDay] = useState("");





    // State for selected date index
    const [selectedDate, setSelectedDate] = useState(null);

    // Effect to set the selected date based on 'ngaydi' when component mounts
    useEffect(() => {
        const initialSelectedDate = dateArray.findIndex(item =>
            item.fullDate.toDateString() === ngaydi.toDateString()
        );

        setSelectedDate(initialSelectedDate !== -1 ? initialSelectedDate : 0);
    }, []); // Run only once when the component mounts

    // Effect to scroll to the selected date in the FlatList
    useEffect(() => {
        if (flatListRef.current && selectedDate !== null && selectedDate >= 0) {
            try {
                flatListRef.current.scrollToIndex({ index: selectedDate, animated: true });
            } catch (error) {
                console.warn('Error scrolling to index:', error);
            }
        }
    }, [selectedDate]);

    const filterOptions = {
        'Giá': ['Dưới 100k', '100k - 200k', 'Trên 200k'],
        'Loại ghế': ['Ghế thường', 'Ghế mềm', 'Ghế VIP'],
        'Khung giờ': ['Sáng', 'Chiều', 'Tối'],
    };

    const openModal = (filterType) => {
        setSelectedFilter(filterType);
        setModalVisible(true);
    };
    const handleOptionSelect = (option) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [selectedFilter]: option,
        }));
        setModalVisible(false);
    };

    useEffect(() => {
        // Simulating a data fetching or processing delay
        setTimeout(() => {
            setLoading(false); // Set loading to false after data is processed/fetched
        }, 200); // Assuming 2 seconds for the simulated delay
        // Set the header with dynamic data
        nav.setOptions({
            headerTitle: () => (
                <View style={styles.viewTitle}>
                    <View style={styles.viewHeader}>
                        <Text style={styles.headerText}>{diemdi}</Text>
                        <Icon
                            type='ionicon'
                            name='bus-outline'
                            color="white"
                            iconStyle={{ paddingHorizontal: 10 }}
                        />
                        <Text style={styles.headerText}>{diemden}</Text>
                    </View>

                    <View>
                        <Text style={{ color: "white" }}>{soVe} vé, {date}/{month} </Text>
                    </View>
                </View>

            ),
            headerBackground: () => (
                <View style={styles.headerBackgroundContainer}>
                    <Image
                        source={require('../../../img/imageheader.png')}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />

                </View>
            ),
            headerStyle: {
                height: 100,
                backgroundColor: "#f95300",
            },
            headerTitleAlign: "center",
            headerTintColor: 'white',
        });
    }, [nav, diemdi, diemden, date, month]);
    // Display the Loading component if loading is true
    if (loading) {
        return <Loading />;
    }

    const closeModal = () => setModalVisible(false);

    // Provide item layout for better scrolling performance
    const getItemLayout = (data, index) => (
        { length: 60, offset: 90 * index, index } // Adjust the length based on your item height
    );

    // Function to handle date selection
    const handleSelectDate = (item, index) => {

        const selectedFullDate = dateArray[index].fullDate;

        setDate(item.date)
        setMonth(item.month)
        setDay(item.day)

        setSelectedDate(index); // Update the selected date

        // Update the date array to include the selected date range
        setDateArray(generateDateRange(selectedFullDate));
    };
    const handleChooseSeat = (trip) => {

        nav.navigate("ChooseSeat", {
            diemden,
            diemdi,
            trip,
            ngaydi,
        })
    }
    // Update handleTripRoute to accept a trip parameter
    const handleTripRoute = (trip) => {
        nav.navigate("TripRoute", { trip });
    };
    return (
        <View style={styles.container}>

            <View style={styles.body}>
                <View style={{}}>
                    <FlatList
                        style={{ height: 70 }}
                        ref={flatListRef}
                        data={dateArray}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        contentContainerStyle={[styles.containerGap]}
                        renderItem={({ item, index }) => (
                            <TouchableWithoutFeedback
                                onPress={() => handleSelectDate(item, index)}
                            >
                                <View style={[
                                    styles.datecontainer,
                                    index === 0 ? { marginLeft: 24 } : {},
                                    index === dateArray.length - 1 ? { marginRight: 24 } : {},
                                    index === selectedDate ? { backgroundColor: '#f95200', borderRadius: 15 } : {}
                                ]}>
                                    <Text style={index === selectedDate ? { color: 'white', borderRadius: 30 } : { color: '#E5E5E5', borderRadius: 30 }}>{item.day}</Text>
                                    <Text style={index === selectedDate ? {
                                        backgroundColor: "white",
                                        borderRadius: 10,
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        color: "#f95200"
                                    } : {
                                        backgroundColor: "white",
                                        borderRadius: 10,
                                        paddingHorizontal: 10,
                                        paddingVertical: 5
                                    }}>{item.date}/{item.month}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                        getItemLayout={getItemLayout}
                    />
                </View>

                <View style={styles.viewFilter}>
                    {['Giá', 'Loại ghế', 'Khung giờ'].map((filterType) => (
                        <View style={styles.filterChild} key={filterType}>
                            <TouchableOpacity
                                style={styles.btnFilter}
                                onPress={() => openModal(filterType)}
                            >
                                <Text style={styles.textFilter}>{filterType}</Text>
                                <Icon type='ionicon' name='caret-down' size={20} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                <Modal

                    onDismiss={() => setModalVisible(false)}
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Chọn {selectedFilter}</Text>

                            {filterOptions[selectedFilter]?.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.radioButton}
                                    onPress={() => handleOptionSelect(option)}
                                >
                                    <View style={styles.radioIcon}>
                                        {/* Đánh dấu tùy chọn đã chọn cho filter hiện tại */}
                                        {selectedOptions[selectedFilter] === option && <View style={styles.radioSelected} />}
                                    </View>
                                    <Text style={styles.radioText}>{option}</Text>
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity style={styles.btnClose} onPress={closeModal}>
                                <Text style={styles.btnCloseText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View>

                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.listTicket}
                    contentContainerStyle={{ paddingBottom: 10 }}
                >
                    {trips.map((trip, index) => (
                        <TouchableWithoutFeedback
                            key={index}
                            onPress={() => handleChooseSeat(trip)}
                        >
                            <View style={styles.listItem}>
                                <View style={styles.viewtop}>
                                    <View style={styles.viewIcon}>
                                        <Icon type='ionicon' name='wifi' />
                                        <Image source={require('../../../img/plastic-bottle.png')} style={styles.iconimg} />
                                        <Image source={require('../../../img/curtains.png')} style={{ height: 21, width: 21 }} />
                                    </View>
                                    <View>
                                        <View style={styles.viewPrice}>
                                            <Text style={{ fontFamily: "inter", fontSize: 18, color: "#458CC7" }}>
                                                {trip.totalFareAndPrice?.toLocaleString("vi-VN")} VNĐ/vé
                                            </Text>
                                        </View>
                                        <View style={styles.viewSeat}>
                                            <Text style={{ fontFamily: "inter", textAlign: 'right' }}>
                                                còn {trip.busId.cartSeat} ghế
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Đường kẻ ngang dạng gạch */}
                                <View style={styles.dashedLineHorizontal} />

                                <View style={styles.listContent}>
                                    <View>
                                        <Text style={styles.textDiemdi}>{trip.routeId.departure}</Text>
                                        {trip?.departureTime && (
                                            <Text style={styles.textTime}>
                                                {moment(trip.departureTime, 'DD/MM/YYYY, HH:mm')
                                                    .tz('Asia/Ho_Chi_Minh')
                                                    .format('HH:mm')}
                                            </Text>
                                        )}
                                        <View style={styles.viewDateTime}>
                                            <Text style={styles.textDay}>
                                                {day} {date}/{month}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.dashedHorizontal}>
                                        <View style={styles.iconContainer}>
                                            <Icon
                                                type='ionicon'
                                                name='bus-outline'
                                                color={"#FE9B4B"}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ alignItems: "flex-end" }}>
                                        <Text style={styles.textDiemdi}>{trip.routeId.destination}</Text>
                                        {trip?.endTime && (
                                            <Text style={styles.textTime}>
                                                {moment(trip.endTime, 'DD/MM/YYYY, HH:mm')
                                                    .tz('Asia/Ho_Chi_Minh')
                                                    .format('HH:mm')}
                                            </Text>
                                        )}
                                        <View style={styles.viewDateTime}>
                                            <Text style={styles.textDay}>
                                                {day} {date}/{month}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableWithoutFeedback
                                    onPress={() => handleTripRoute(trip)}
                                >
                                    <View style={styles.tripsRoute}>
                                        <Icon type='ionicon' name='alert-circle-outline' size={16} />
                                        <Text style={{ fontFamily: "inter", fontSize: 14, color: "darkblue" }}>Lịch trình</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    ))}
                </ScrollView>

            </View>
        </View>
    );
};

export default ResultSearch;
