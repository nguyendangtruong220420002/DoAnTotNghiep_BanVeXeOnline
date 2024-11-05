import { FlatList, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'react-native-elements';
import { styles } from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import darkColors from 'react-native-elements/dist/config/colorsDark';

const generateDateRange = (baseDate, daysAfter = 30) => {
    const dates = [];
    const today = new Date();
    const startDate = new Date(baseDate);

    // Calculate days before based on the difference between selected date and today
    const differenceInTime = startDate.getTime() - today.getTime();
    const daysBefore = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    // Generate past dates only up to today
    for (let i = 0; i < daysBefore; i++) {
        const pastDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
        dates.push({
            date: pastDate.getDate(),
            day: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ 7'][pastDate.getDay()],
            month: ['1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', '10', '11', 'Tháng 12'][pastDate.getMonth()],
            fullDate: pastDate,
        });
    }

    // Add the base date (selected date)
    dates.push({
        date: startDate.getDate(),
        day: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ 7'][startDate.getDay()],
        month: ['1', ' 2', ' 3', ' 4', ' 5', ' 6', ' 7', ' 8', ' 9', '10', '11', ' 12'][startDate.getMonth()],
        fullDate: startDate,
    });

    // Generate future dates
    for (let i = 1; i <= daysAfter; i++) {
        const futureDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        dates.push({
            date: futureDate.getDate(),
            day: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ 7'][futureDate.getDay()],
            month: ['1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', '10', '11', 'Tháng 12'][futureDate.getMonth()],
            fullDate: futureDate,
        });
    }

    return dates;
};


const ResultSearch = () => {

    const route = useRoute();
    const nav = useNavigation();
    const flatListRef = useRef(null);

    // modal Filter
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(''); // Lưu lựa chọn của người dùng
    const [selectedOptions, setSelectedOptions] = useState({
        'Giá': '',
        'Loại ghế': '',
        'Khung giờ': '',
    });


    // Parse 'ngaydi' from the navigation params
    const ngaydi = route.params?.ngaydi ? new Date(route.params.ngaydi) : new Date();
    const diemi = route.params?.diemdi
    const diemden = route.params?.diemden
    // Generate initial dates starting from ngaydi
    const [dateArray, setDateArray] = useState(generateDateRange(ngaydi));

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


    const closeModal = () => setModalVisible(false);

    const handleBack = () => {
        nav.navigate("Home");
    };

    // Provide item layout for better scrolling performance
    const getItemLayout = (data, index) => (
        { length: 60, offset: 90 * index, index } // Adjust the length based on your item height
    );

    // Function to handle date selection
    const handleSelectDate = (index) => {

        const selectedFullDate = dateArray[index].fullDate;

        setSelectedDate(index); // Update the selected date

        // Update the date array to include the selected date range
        setDateArray(generateDateRange(selectedFullDate));
    };

    return (
        <View style={styles.container}>
            <View style={styles.viewHeader}>
                <Image
                    source={require('../../../img/imageheader.png')}
                    style={styles.headerImage}
                    resizeMode="cover"
                />
                <View style={styles.viewChild}>
                    <TouchableOpacity onPress={handleBack} style={styles.btnBack}>
                        <Icon
                            type='ionicon'
                            name='arrow-back-outline'
                            color="white"
                            size={28}
                            iconStyle={{ alignContent: "flex-start" }}
                        />
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ fontSize: 15, color: 'white', textAlign: 'center' }}>{diemi}</Text>

                        <Icon type='ionicon'
                            name='bus-outline'
                            color={"white"}
                            iconStyle={{ paddingHorizontal: 10 }}
                        />

                        <Text style={{ fontSize: 15, color: 'white', textAlign: 'center' }}>{diemden}</Text>
 
                    </View>
                    <View></View>
                </View>
            </View>

            <View style={styles.body}>
                <View style={{}}>
                    <FlatList
                        style={{ height: 70 }}
                        ref={flatListRef}
                        data={dateArray}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        bounces={false}
                        contentContainerStyle={[styles.containerGap]}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                onPress={() => handleSelectDate(index)}
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
                            </TouchableOpacity>
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

                <ScrollView style={styles.listTicket}>
                    <View style={styles.listItem}>
                        <View style={styles.viewtop}>
                            <View style={styles.viewIcon}>
                                <Icon type='ionicon' name='wifi' />
                                <Image source={require('../../../img/plastic-bottle.png')} style={styles.iconimg} />
                                <Image source={require('../../../img/curtains.png')} style={{
                                    height: 21,
                                    width: 21,
                                }} />
                            </View>
                            <View>
                                <View style={styles.viewPrice}>
                                    <Text style={{ fontFamily: "inter", fontSize: 18 }}>135,000đ/vé</Text>
                                </View>
                                <View style={styles.viewSeat}>
                                    <Text style={{ fontFamily: "inter", textAlign: 'right' }}>còn 10 ghế</Text>
                                </View>
                            </View>
                        </View>
                        {/* dashed*/}
                        <View style={styles.dashedLineHorizontal} />

                        <View style={styles.listContent}>

                        </View>
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.viewtop}>
                            <View style={styles.viewIcon}>
                                <Icon type='ionicon' name='wifi' />
                                <Image source={require('../../../img/plastic-bottle.png')} style={styles.iconimg} />
                                <Image source={require('../../../img/curtains.png')} style={{
                                    height: 21,
                                    width: 21,
                                }} />
                            </View>
                            <View>
                                <View style={styles.viewPrice}>
                                    <Text style={{ fontFamily: "inter", fontSize: 18 }}>135,000đ/vé</Text>
                                </View>
                                <View style={styles.viewSeat}>
                                    <Text style={{ fontFamily: "inter", textAlign: 'right' }}>còn 10 ghế</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.listContent}>

                        </View>
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.viewtop}>
                            <View style={styles.viewIcon}>
                                <Icon type='ionicon' name='wifi' />
                                <Image source={require('../../../img/plastic-bottle.png')} style={styles.iconimg} />
                                <Image source={require('../../../img/curtains.png')} style={{
                                    height: 21,
                                    width: 21,
                                }} />
                            </View>
                            <View>
                                <View style={styles.viewPrice}>
                                    <Text style={{ fontFamily: "inter", fontSize: 18 }}>135,000đ/vé</Text>
                                </View>
                                <View style={styles.viewSeat}>
                                    <Text style={{ fontFamily: "inter", textAlign: 'right' }}>còn 10 ghế</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.listContent}>

                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default ResultSearch;
