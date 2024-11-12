import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import axios from 'axios';
import { setAsyncStorage } from '../../../utils/cookie';
import { Icon, Input } from 'react-native-elements';

const ListProvinces = () => {

    const nav = useNavigation()
    const route = useRoute()

    const type = route.params?.type;

    const [diemDi, setDiemDi] = useState('');
    const [diemDen, setDiemDen] = useState('');

    const [searchQuery, setSearchQuery] = useState('');

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set the header with dynamic data
        nav.setOptions({
            headerTitle: () => (
                <View style={styles.viewTitle}>
                    <Text style={styles.headerText}>{type}</Text>
                </View>
            ),
            headerBackground: () => (
                <View style={styles.headerBackgroundContainer}>
                    <Image
                        source={require('../../../../img/imageheader.png')}
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
    }, [nav, type]);

    const handleSelectProvince = async (selectedProvince) => {
        // Use the 'type' to determine whether to set the selected value as 'Điểm đi' or 'Điểm đến'
        if (type === 'Điểm đi') {
            // Set "Điểm đi" value
            await setAsyncStorage("diemDi", selectedProvince)

        } else {
            await setAsyncStorage("diemDen", selectedProvince)
        }
        nav.goBack();
    };

    const getProvinces = async () => {
        try {
            const response = await axios.get("https://open.oapi.vn/location/provinces?size=63");

            if (response.data && Array.isArray(response.data.data)) {
                const provincesData = response.data.data;
                const provinceNames = provincesData.map(province => province.name);
                setData(provinceNames); // Lưu dữ liệu vào state
            } else {
                console.error("Dữ liệu API không hợp lệ:", response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set trạng thái loading là false khi API đã trả về kết quả
        }
    };

    useEffect(() => {
        getProvinces(); // Gọi hàm getProvinces khi component được mount
    }, []);

    // Nếu đang loading, hiển thị ActivityIndicator
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }
    // Lọc dữ liệu theo từ khóa tìm kiếm
    const filteredData = data.filter(province =>
        province.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View>
            <Icon name='search' type='ionicon' color={"gray"} containerStyle={{ position: "absolute", top: 18, left: 15 }} />
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm tỉnh..."
                value={searchQuery}

                onChangeText={setSearchQuery} // Cập nhật từ khóa tìm kiếm
            />

            <View>
                <Text style={{ paddingLeft: 10, fontSize: 18, fontWeight: "600" }}>Tỉnh/Thành phố</Text>
            </View>
            <FlatList
                data={filteredData} // Dữ liệu được truyền vào FlatList
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelectProvince(item)}
                        style={styles.FlatList}
                    >
                        <Text style={styles.textFlatlist}>{item}</Text>
                    </TouchableOpacity>

                )} // Hiển thị từng tên tỉnh
                keyExtractor={(item, index) => index.toString()} // Sử dụng index làm key cho từng item
            />
        </View>
    );
};
export default ListProvinces

