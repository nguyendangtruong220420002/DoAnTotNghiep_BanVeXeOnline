import { ActivityIndicator, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { deleteAsyncStorage, getAsyncStorage, setAsyncStorage } from '../../utils/cookie'
import { styles } from './styles'
import { Icon, ListItem } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { putData, s3_URL } from '../../utils/fetching'
import axios from 'axios'
import useAuthData, { useAuth } from '../../context/useAuth'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';

const DetailAccount = () => {

    const nav = useNavigation();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [img, setImg] = useState("");
    const [address, setAddress] = useState("");

    const [isUpdateform, setIsUpdateform] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [currentField, setCurrentField] = useState('');
    const [updatedValue, setUpdatedValue] = useState('');

    const { user, setUser } = useAuthData();

    const [loadingAvatar, setLoadingAvatar] = useState(false);

    const [hasPermission, setHasPermisson] = useState();

    useEffect(() => {
        nav.setOptions({
            headerTitle: () => (
                <View style={styles.viewTitle}>
                    <Text style={styles.headerText}>Thông tin cá nhân</Text>
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
    }, [nav]);

    useEffect(() => {
        (async () => {
            const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasPermisson(status.status === 'granted');
        })();
    }, []);

    useEffect(() => {
        setImg(user?.img ? user?.image : null);
    }, []);

    const handleShowUpdateform = () => {
        setIsUpdateform(true);
    };

    const openEditModal = (field) => {
        setCurrentField(field);
        setUpdatedValue(user[field]);
        setModalVisible(true);
    };

    const handleUpdate = async () => {

        const updatedUser = {
            fullName: fullName || user?.fullName,
            email: email || user?.email,
            img: img || user?.img,
            address: address || user?.address,
        };

        console.log(updatedUser);

        try {
            // Send the updated data to your backend API
            const response = await putData(`users/${user?._id}`, updatedUser);

            if (response?.status === 200) {
                const newUser = response.data.user;
                setUser(newUser);
                setAsyncStorage("user", newUser);
                alert("Cập nhật thành công!");
                setIsUpdateform(false);
            } else {
                alert("Cập nhật thất bại! " + (response?.message || "Vui lòng thử lại."));
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Có lỗi xảy ra khi cập nhật thông tin.");
        }
    };

    const handleSave = () => {
        setUser({ ...user, [currentField]: updatedValue });
        setModalVisible(false);
    };

    const handlePickImage = async () => {
        try {
            setLoadingAvatar(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                base64: true,
            });

            if (!result.canceled) {
                // Hiển thị ảnh đã chọn ngay lập tức
                setImg(result.assets[0].uri);

                // Chuẩn bị dữ liệu để upload
                const body = {
                    avatar: {
                        base64: result.assets[0].base64,
                        originalname: result.assets[0].fileName || 'image.jpg',
                        uri: result.assets[0].uri,
                        mimetype: result.assets[0].mimeType || 'image/jpeg',
                        size: result.assets[0].fileSize || 0,
                    },
                };

                // Gửi dữ liệu lên server
                const response = await putData(`users/update-avatar-mobile/${user?._id}`, body);
                console.log(response.data);
                if (response?.status === 200) {
                    // Cập nhật ảnh từ server sau khi upload thành công
                    const newAvatarUrl = response.data.img; // Thay đổi theo API của bạn
                    setImg(newAvatarUrl);

                    // Cập nhật thông tin user
                    const updatedUser = response.data;
                    await setAsyncStorage("user", updatedUser);
                    setUser(updatedUser);

                } else {
                    alert("Không thể cập nhật ảnh. Vui lòng thử lại.");
                }
            }
        } catch (error) {
            console.error("Error picking image:", error);
            alert("Có lỗi xảy ra khi chọn hoặc tải lên ảnh.");
        } finally {
            setLoadingAvatar(false); // Stop loading once done
        }
    };
    const handleSingOut = async () => {
        deleteAsyncStorage("token");
        deleteAsyncStorage("user");
        nav.navigate("Welcome");
        alert("Đã đăng xuất");
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.body}>
                <View style={styles.list}>
                    <TouchableOpacity
                        style={styles.view_user}
                        onPress={isUpdateform ? handlePickImage : null}
                    >
                        {loadingAvatar ? (
                            <ActivityIndicator size="large" color="#FE9B4B" />
                        ) : img || user?.img ? (
                            <Image source={{ uri: user?.img }} style={{ width: 110, height: 110, borderRadius: 100 }} />
                        ) : (
                            <Icon name='person-circle' type='ionicon' size={130} color={"#FE9B4B"} />
                        )}
                        {isUpdateform && (
                            <Icon
                                containerStyle={{ position: 'absolute', top: 85, right: 150 }}
                                raised
                                type='ionicon'
                                name='camera'
                                color={"black"}
                                size={15}
                            />
                        )}
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
                        style={styles.btnUpdate}
                    >
                        <Text style={{ color: "white", fontSize: 17 }}>
                            {isUpdateform ? "Cập nhật" : "Cập nhật thông tin"}
                        </Text>
                    </TouchableOpacity>

                    {!isUpdateform && (
                        <TouchableOpacity
                            onPress={handleSingOut}
                            style={styles.btnSignOut}
                        >
                            <Text style={{ color: "#f95300", fontSize: 17 }}>Đăng xuất</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView >
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
        </View >
    );
};

export default DetailAccount;
