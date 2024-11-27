import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { generateSeats, generate41Seats } from '../../config/seat'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, tab } from '@react-navigation/native'
import { useEffect } from 'react'
import { styles } from './styles'
import Loading from '../loading/Loading'
import moment from 'moment-timezone';

const ChooseSeat = () => {

    const nav = useNavigation();
    const route = useRoute();

    const trip = route.params?.trip;
    const diemdi = route.params?.diemdi
    const diemden = route.params?.diemden

    const totalFareAndPrice = trip?.totalFareAndPrice;

    const [twoSeatArray, setTwoSeatArray] = useState(generate41Seats())
    const [selectedSeatArray, setSelectedSeatArray] = useState([]);
    const [price, setPrice] = useState();


    const [loading, setLoading] = useState(true); // Loading state

    const selectedSeat = (index, subIndex, number) => {
        if (!twoSeatArray[index][subIndex].taken) {
            let array = [...selectedSeatArray];
            let temp = [...twoSeatArray];
            temp[index][subIndex].selected = !temp[index][subIndex].selected;

            // Determine the prefix based on seat number
            let seatLabel = number <= 23 ? `A${number}` : `B${number}`;

            // Toggle selection logic
            if (!array.includes(seatLabel)) {
                // Seat is selected, so we add it to the array
                array.push(seatLabel);
            } else {
                // Seat is unselected, so we remove it from the array
                const tempIndex = array.indexOf(seatLabel);
                if (tempIndex > -1) {
                    array.splice(tempIndex, 1);
                }
            }

            setSelectedSeatArray(array);  // Update the selectedSeatArray
            // Update price based on the number of selected seats
            setPrice(array.length * totalFareAndPrice);
            setTwoSeatArray(temp);  // Update the seat array
        }
    };


    useEffect(() => {
        setTimeout(() => {
            setLoading(false); // Set loading to false after data is processed/fetched
        }, 200);
        // Set the header with dynamic data
        nav.setOptions({
            headerTitle: () => (
                <View style={styles.viewTitle}>
                    <Text style={styles.headerText}>{diemdi}</Text>
                    <Icon
                        type='ionicon'
                        name='bus-outline'
                        color="white"
                        iconStyle={{ paddingHorizontal: 10 }}
                    />
                    <Text style={styles.headerText}>{diemden}</Text>
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
    }, [nav, diemdi, diemden]);

    if (loading) {
        return <Loading />;
    }
    const handleInfoPayment = () => {
        nav.navigate("InfoPayment", { trip, diemdi, diemden, selectedSeatArray, price })
    }
    return (
        <View style={styles.container}>


            <View style={styles.body}>
                <View>
                    <View style={styles.topBody}>
                        <Text style={{ padding: 10 }}>Ngày đi</Text>
                        {trip?.departureTime && (
                            <Text style={styles.textTime}>
                                {moment(trip.departureTime, 'DD/MM/YYYY, HH:mm')
                                    .tz('Asia/Ho_Chi_Minh')
                                    .format('HH:mm, DD/MM/YYYY ')}
                            </Text>
                        )}
                    </View>
                    <View style={styles.seatContainer}>
                        {/* First column: seats 1-16 */}
                        <View style={styles.column1}>
                            <Text style={{ textAlign: 'center' }}>Tầng dưới</Text>
                            {twoSeatArray.slice(0, 7).map((row, rowIndex) => ( // Adjusted row count for first 16 seats
                                <View key={`row1-${rowIndex}`} style={styles.seatRow}>
                                    {row.map((subItem, colIndex) => (
                                        <TouchableWithoutFeedback
                                            key={subItem?.number ?? `seat1-${rowIndex}-${colIndex}`}
                                            onPress={() => subItem && !subItem.taken && selectedSeat(rowIndex, colIndex, subItem.number)}
                                        >
                                            <View
                                                style={[
                                                    styles.seatWrapper,
                                                    !subItem ? styles.emptySeatWrapper : {},
                                                ]}
                                            >
                                                {subItem ? (
                                                    <>
                                                        <Icon
                                                            name="chair"
                                                            type="material"
                                                            color={subItem.selected ? "#f95300" : subItem.taken ? "#757575" : "#BDD8F1"}
                                                            size={34}
                                                        />
                                                        <Text style={styles.seatNumber}>A{subItem.number}</Text>
                                                    </>
                                                ) : (
                                                    <View style={styles.emptySeat}></View>
                                                )}
                                            </View>
                                        </TouchableWithoutFeedback>
                                    ))}
                                </View>
                            ))}
                        </View>

                        <View style={styles.column}>
                            <Text style={{ textAlign: 'center' }}>Tầng trên</Text>
                            {twoSeatArray.slice(7).map((row, rowIndex) => ( // Remaining rows
                                <View key={`row2-${rowIndex}`} style={styles.seatRow}>
                                    {row.map((subItem, colIndex) => (
                                        <TouchableWithoutFeedback
                                            key={subItem?.number ?? `seat2-${rowIndex}-${colIndex}`}
                                            onPress={() => subItem && !subItem.taken && selectedSeat(rowIndex + 7, colIndex, subItem?.number)} // Adjusted index for second column
                                        >
                                            <View style={styles.seatWrapper1}>
                                                {subItem ? (
                                                    <>
                                                        <Icon
                                                            name="chair"
                                                            type="material"
                                                            color={subItem.selected ? "#f95300" : subItem.taken ? "#757575" : "#BDD8F1"}
                                                            size={34}
                                                        />
                                                        <Text style={styles.seatNumber}>B{subItem.number}</Text>
                                                    </>
                                                ) : (
                                                    <View style={styles.emptySeat}></View>
                                                )}
                                            </View>
                                        </TouchableWithoutFeedback>
                                    ))}
                                </View>
                            ))}
                        </View>

                    </View>
                </View>


                <View>
                    <View style={styles.radioIcon}>
                        <View style={styles.chosing}>
                            <Icon name='ellipse' type='ionicon' color={"#757575"} />
                            <Text>Đã bán</Text>
                        </View>
                        <View style={styles.chosing}>
                            <Icon name='ellipse' type='ionicon' color={"#BDD8F1"} />
                            <Text>Còn trống</Text>
                        </View>
                        <View style={styles.chosing}>
                            <Icon name='ellipse' type='ionicon' color={"#f95300"} />
                            <Text>Đang chọn</Text>
                        </View>

                    </View>
                    <View style={styles.bottom}>
                        <View style={{ marginLeft: 20, paddingVertical: 10 }}>
                            <Text style={{ fontWeight: 500 }} >Chiều đi</Text>
                            <Text style={{ fontWeight: '300' }}>{selectedSeatArray.length || 0} vé</Text>
                            <Text style={{ fontWeight: '300' }}>{selectedSeatArray.map(seat => seat).join(', ')}</Text>
                        </View>

                        <View style={{ marginLeft: 20, paddingVertical: 15 }}>
                            <Text style={{ fontSize: 20, fontWeight: 450 }}>Số tiền: {price?.toLocaleString("vi-VN") || 0}đ</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleInfoPayment()}
                            style={styles.btnContinue}>
                            <Text style={styles.textbtn}>Tiếp tục</Text>
                        </TouchableOpacity>
                    </View>
                </View>



            </View>

        </View>
    )
}

export default ChooseSeat

