import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { generateSeats } from '../../config/seat'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, tab } from '@react-navigation/native'
import { useEffect } from 'react'
import { styles } from './styles'
import Loading from '../loading/Loading'

const ChooseSeat = () => {

    const nav = useNavigation();
    const route = useRoute();

    const diemdi = route.params?.diemdi
    const diemden = route.params?.diemden

    const [twoSeatArray, setTwoSeatArray] = useState(generateSeats())
    const [selectedSeatArray, setSelectedSeatArray] = useState([]);
    const [price, setPrice] = useState();


    const [loading, setLoading] = useState(true); // Loading state
    const selectedSeat = (index, subIndex, number) => {
        if (!twoSeatArray[index][subIndex].taken) {
            let array = [...selectedSeatArray];
            let temp = [...twoSeatArray];
            temp[index][subIndex].selected = !temp[index][subIndex].selected;
            if (!array.includes(number)) {
                array.push(number);
                setSelectedSeatArray(array);
            } else {
                const tempIndex = array.indexOf(number);
                if (tempIndex > -1) {
                    array.splice(tempIndex, 1);
                    setSelectedSeatArray(array);
                }
            }
            setPrice(array.length * 5.0);
            setTwoSeatArray(temp);
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

    return (
        <View style={styles.container}>


            <View style={styles.body}>

                <View style={styles.seatContainer}>
                    {/* First column: seats 1-16 */}
                    <View style={styles.column}>
                        <Text style={{ textAlign: 'center' }}>Tầng dưới</Text>
                        {twoSeatArray.slice(0, 6).map((row, rowIndex) => ( // Adjusted row count for first 16 seats
                            <View key={`row1-${rowIndex}`} style={styles.seatRow}>
                                {row.map((subItem, colIndex) => (
                                    <TouchableOpacity
                                        key={subItem?.number ?? `seat1-${rowIndex}-${colIndex}`}
                                        disabled={!subItem || subItem?.taken}
                                        style={styles.seatWrapper}
                                        onPress={() => selectedSeat(rowIndex, colIndex, subItem?.number)}
                                    >
                                        {subItem ? (
                                            <>
                                                <Icon
                                                    name='chair'
                                                    type='material'
                                                    color={subItem.selected ? "#f95300" : subItem.taken ? "#757575" : "#BDD8F1"}
                                                    size={40}
                                                />
                                                <Text style={styles.seatNumber}>A{subItem.number}</Text>
                                            </>
                                        ) : (
                                            <View style={styles.emptySeat}></View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>

                    <View style={styles.column}>
                        <Text style={{ textAlign: 'center' }}>Tầng trên</Text>
                        {twoSeatArray.slice(6).map((row, rowIndex) => ( // Remaining rows
                            <View key={`row2-${rowIndex}`} style={styles.seatRow}>

                                {row.map((subItem, colIndex) => (
                                    <TouchableOpacity
                                        key={subItem?.number ?? `seat2-${rowIndex}-${colIndex}`}
                                        disabled={!subItem || subItem?.taken}
                                        style={styles.seatWrapper}
                                        onPress={() => selectedSeat(rowIndex + 6, colIndex, subItem?.number)} // Adjusted index for second column
                                    >
                                        {subItem ? (
                                            <>
                                                <Icon
                                                    name='chair'
                                                    type='material'
                                                    color={subItem.selected ? "#f95300" : subItem.taken ? "#757575" : "#BDD8F1"}
                                                    size={40}
                                                />
                                                <Text style={styles.seatNumber}>B{subItem.number}</Text>
                                            </>
                                        ) : (
                                            <View style={styles.emptySeat}></View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>


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
            </View>
        </View>
    )
}

export default ChooseSeat

