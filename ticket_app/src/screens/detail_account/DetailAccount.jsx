import { Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { deleteAsyncStorage, getAsyncStorage, setAsyncStorage } from '../../utils/cookie'
import { styles } from './styles'
import { Icon, ListItem } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { putData } from '../../utils/fetching'
import axios from 'axios'

const DetailAccount = () => {

    const [user, setUser] = useState();
    const nav = useNavigation();
    const [token, setToken] = useState("")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [img, setImg] = useState("")
    const [address, setAddress] = useState("")

    const [isUpdateform, setIsUpdateform] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [currentField, setCurrentField] = useState('');
    const [updatedValue, setUpdatedValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = await getAsyncStorage("token");
            const user = await getAsyncStorage("user");

            console.log("Fetched token:", token);
            console.log("Fetched user:", user);
            setToken(token);
            setUser(user);
        };

        fetchData();
    }, []);

    const handleback = () => {
        nav.navigate("Account")
    }
    const handleShowUpdateform = () => {
        setIsUpdateform(true);
    };

    const openEditModal = (field) => {
        setCurrentField(field);
        setUpdatedValue(user[field]);
        setModalVisible(true);
    };
    const handleUpdate = async () => {

        setFullName(user?.fullName)
        setAddress(user?.address)
        setEmail(user?.email)
        setImg(user?.img)

        const updatedUser = {
            fullName,
            email,
            img,
            address,
        };
        console.log(user?._id);

        try {
            const response = await putData(`users/${user?._id}`, updatedUser);

            // const response = await axios.put(`http://192.168.1.112:5000/api/users/${user?._id}`, updatedUser, {
            //     headers: {
            //         accept: 'application/json',
            //         'Authorization': `Bearer ${token}`
            //     }
            // });

            // Ghi nhận phản hồi đầy đủ
            console.log('Response:', response);
            if (response?.status === 200) {
                const newUser = await response.data;
                setUser(newUser.user);
                setAsyncStorage("user", newUser.user)
                alert("Cập nhật thành công!");
                setIsUpdateform(false);
            } else {
                alert("Cập nhật thất bại! " + (response.message || "Vui lòng thử lại."));
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Có lỗi xảy ra khi cập nhật thông tin.");
        }
    };

    const handleSave = () => {

        setUser({ ...user, [currentField]: updatedValue });
        setModalVisible(false);
    }
    const handleSingOut = async () => {

        deleteAsyncStorage("token")
        deleteAsyncStorage("user")


        nav.navigate("Welcome")
        alert("Đã đăng xuất")

    }

    return (
        <View style={styles.container}>
            <View style={styles.viewHeader}>
                <Image
                    source={require('../../../img/imageheader.png')} // Replace with your image path
                    style={styles.headerImage}
                    resizeMode="cover"
                />
                
                <View style={styles.viewChild}>

                    <TouchableOpacity
                        onPress={handleback}
                        style={styles.btnBack}>
                        <Icon
                            onPress={handleback}
                            type='ionicon' name='chevron-back-outline' color={"white"} size={30} />

                    </TouchableOpacity>
                    <View style={{ marginLeft: 75 }}>
                        <Text style={{ fontSize: 24, color: 'white' }}>Thông tin cá nhân</Text>
                    </View>

                </View>

            </View>

            <ScrollView style={styles.body}>
                <View style={styles.list}>
                    <TouchableOpacity
                        style={styles.view_user}>
                        <Icon name='person-circle' type='ionicon' size={130} color={"#FE9B4B"} />
                        {isUpdateform ? <Icon
                            containerStyle={{ position: 'absolute', top: 85, right: 150 }}
                            raised
                            type='ionicon' name='camera' color={"black"} size={15} /> : null}
                    </TouchableOpacity>

                    <View style={styles.ListItem}>
                        <ListItem >
                            <ListItem.Content>
                                <ListItem.Title>Điện Thoại</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Title>{user?.phoneNumber}</ListItem.Title>
                        </ListItem>

                        <ListItem onPress={() => isUpdateform && openEditModal('fullName')}>
                            <ListItem.Content>
                                <ListItem.Title>Họ và tên</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Title>{user?.fullName}</ListItem.Title>
                            {isUpdateform && <ListItem.Chevron iconProps={{ name: 'edit', type: 'ionicon', color: 'gray', size: 24 }} />}
                        </ListItem>

                        <ListItem onPress={() => isUpdateform && openEditModal('email')}>
                            <ListItem.Content>
                                <ListItem.Title>Email</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Title>{user?.email}</ListItem.Title>
                            {isUpdateform && <ListItem.Chevron iconProps={{ name: 'edit', type: 'ionicon', color: 'gray', size: 24 }} />}
                        </ListItem>

                        <ListItem onPress={() => isUpdateform && openEditModal('gender')}>
                            <ListItem.Content>
                                <ListItem.Title>Giới tính</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Title>{user?.gender || "Chưa cập nhật"}</ListItem.Title>
                            {isUpdateform && <ListItem.Chevron iconProps={{ name: 'edit', type: 'ionicon', color: 'gray', size: 24 }} />}
                        </ListItem>

                        <ListItem onPress={() => isUpdateform && openEditModal('address')}>
                            <ListItem.Content>
                                <ListItem.Title>Địa chỉ</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Title>{user?.address || "Chưa cập nhật"}</ListItem.Title>
                            {isUpdateform && <ListItem.Chevron iconProps={{ name: 'edit', type: 'ionicon', color: 'gray', size: 24 }} />}
                        </ListItem>
                    </View>
                </View>

                <View style={styles.viewBtn}>
                    <TouchableOpacity
                        onPress={isUpdateform ? handleUpdate : handleShowUpdateform}
                        style={styles.btnUpdate}>
                        <Text style={{ color: "white", fontSize: 17 }}>{isUpdateform ? "Cập nhật" : "Cập nhật  thông tin"}</Text>
                    </TouchableOpacity>

                    {!isUpdateform && <TouchableOpacity
                        onPress={handleSingOut}
                        style={styles.btnSignOut}>
                        <Text style={{ color: "#f95300", fontSize: 17 }}>Đăng xuất</Text>
                    </TouchableOpacity>}
                </View>
            </ScrollView>
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cập nhật {currentField}</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={updatedValue}
                            onChangeText={setUpdatedValue}
                        />
                        <TouchableOpacity onPress={handleSave} style={styles.modalSaveButton}>
                            <Text style={{ color: "white", fontSize: 17 }}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancelButton}>
                            <Text style={{ color: "gray", fontSize: 17 }}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>

    )
}

export default DetailAccount
