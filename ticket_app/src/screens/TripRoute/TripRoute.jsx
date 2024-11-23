import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import { Icon } from 'react-native-elements';
import moment from 'moment-timezone';

const TripRoute = () => {
    const nav = useNavigation()

    const route = useRoute();

    const trip = route.params?.trip;

    useEffect(() => {
        // Set the header with dynamic data
        nav.setOptions({
            headerTitle: () => (
                <View style={styles.viewTitle}>
                    <Text style={styles.headerText}>Lịch trình</Text>
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
                height: 80,
                backgroundColor: "#f95300",
            },
            headerTitleAlign: "center",
            headerTintColor: 'white',
        });
    }, [nav]);
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <Text style={{ fontWeight: "500", fontSize: 15 }}>Thông tin chuyến đi</Text>

                <View style={styles.routeName}>
                    <Text style={{ color: "green" }}>{trip?.routeId.departure} </Text>
                    <Icon type='ionicon' name='arrow-forward' />
                    <Text style={{ color: "#f93500" }}> {trip?.routeId.destination} </Text>
                </View>


                <View style={styles.routeBody}>
                    <View style={styles.timeContainer}>
                        <Text>Thời gian</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {trip?.departureTime && (
                                <Text style={styles.timeText}>
                                    {moment(trip.departureTime, 'DD/MM/YYYY, HH:mm')
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format('HH:mm')}
                                </Text>
                            )}
                            <Icon type='material' name='radio-button-checked' color={"green"} />

                            <Text style={styles.locationText}>
                                {trip?.routeId.departure}
                            </Text>
                        </View>

                        {trip?.schedule.map((stop, index) => (

                            <View style={styles.rowContainer} key={stop._id}>

                                <Text style={styles.timeText}>
                                    {moment(stop.time, "HH:mm").tz("Asia/Ho_Chi_Minh").format("HH:mm")}
                                </Text>

                                <Icon type='ionicon' name='location-sharp' />

                                <View style={styles.locationContainer}>
                                    <Text style={styles.stopText}>{stop.name}</Text>
                                    <Text style={styles.stopAddress}>{stop.address}</Text>
                                </View>
                            </View>

                        ))}
                        {trip.schedule.length === 0 && (
                            <View style={styles.dashedLine} />
                        )}
                        
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {trip?.endTime && (
                                <Text style={styles.timeText}>
                                    {moment(trip.endTime, 'DD/MM/YYYY, HH:mm')
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format('HH:mm')}
                                </Text>
                            )}
                            <Icon type='material' name='radio-button-checked' color={"darkorange"} />

                            <Text style={{ color: "darkorange", marginLeft: 9 }}>
                                {trip?.routeId.destination}
                            </Text>
                        </View>
                    </View>
                </View>


            </View>

        </View>
    )
}

export default TripRoute
