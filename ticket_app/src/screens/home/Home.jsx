import { Image, ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { styles } from './styles'
import { Icon, Input } from 'react-native-elements'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { calendarsConfig } from '../../config/CalendarConfig';
import { solarToLunar } from 'lunar-calendar'
import axios from 'axios';
import { deleteAsyncStorage, getAsyncStorage, setAsyncStorage } from '../../utils/cookie';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useAuthData, { useAuth } from '../../context/useAuth';
import { getData } from '../../utils/fetching';


const Home = () => {

  const nav = useNavigation();

  const [trips, setTrips] = useState([]);

  const [diemDi, setDiemDi] = useState('');
  const [diemDen, setDiemDen] = useState('');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();

  const [datefrom, setDatefrom] = useState(new Date())
  const [dateto, setDateto] = useState(new Date())
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [show, setShow] = useState(false);
  const [soVe, setSoVe] = useState("1");

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectingDateFor, setSelectingDateFor] = useState('from');

  const [searchHistory, setSearchHistory] = useState([]);
  const [visibleHistory, setVisibleHistory] = useState();

  LocaleConfig.locales['vi'] = calendarsConfig;
  LocaleConfig.defaultLocale = 'vi';

  const { user, token, setUser } = useAuthData();

  const getProvinces = async () => {

    try {
      const diemDi = await getAsyncStorage("diemDi");
      const diemDen = await getAsyncStorage("diemDen");
      setDiemDi(diemDi || '');  // Đảm bảo không có giá trị thì đặt chuỗi rỗng
      setDiemDen(diemDen || '');
    } catch (error) {
      console.error(error);
    }
  };


  useFocusEffect(
    React.useCallback(() => {

      getProvinces();
      getSearchHistory();
    }, [])
  );


  const getSearchHistory = async () => {
    try {

      const history = await getAsyncStorage('searchHistory');
      if (history) {
        setVisibleHistory(true);
      }
      setSearchHistory(Array.isArray(history) ? history : []); // Ensure history is an array
    } catch (error) {
      console.error("Error fetching search history: ", error);
    }
  };

  const deleteHistorySearch = async () => {
    try {
      setVisibleHistory(false);
      await deleteAsyncStorage("searchHistory")
    } catch (error) {
      console.error("Error delet search history: ", error);
    }
  }
  const handleSwap = () => {
    const temp = diemDi;
    setDiemDi(diemDen);
    setDiemDen(temp);
  };

  // Convert solar dates to lunar dates
  const getLunarDate = (date) => {
    try {
      const lunar = solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
      return `${lunar.lunarDay}/${lunar.lunarMonth}`;
    } catch (error) {
      console.error('Error converting date:', error);
      return '';
    }
  };

  const showCalendar = (type) => {
    setSelectingDateFor(type); // "from" or "to"
    setCalendarVisible(true);
  };

  const onDaySelect = (day) => {
    const selectedDate = new Date(day.dateString);
    if (selectingDateFor === 'from') {
      if (selectedDate > dateto) {
        setDateto(selectedDate); // Cập nhật ngày về nếu ngày đi lớn hơn ngày về
      }
      setDatefrom(selectedDate);
    } else {
      if (selectedDate >= datefrom) {
        setDateto(selectedDate);
      } else {
        setDateto(datefrom); // Đảm bảo ngày về không nhỏ hơn ngày đi
      }
    }
    setCalendarVisible(false); // Ẩn lịch sau khi chọn
  };

  const DayComponent = ({ date, marking, onPress }) => {
    const lunarDate = getLunarDate(new Date(date.dateString));

    // Conditional styling based on marking
    const isMarked = marking?.marked || false;
    const isSelected = marking?.selected || false;
    const minDate = selectingDateFor === 'from' ? new Date().toISOString().split('T')[0] : datefrom.toISOString().split('T')[0]
    const isBeforeMinDate = new Date(date.dateString) < new Date(minDate);
    return (
      <TouchableOpacity
        disabled={isBeforeMinDate}
        onPress={() => onPress(date)}>
        <View
          style={[
            styles.dayContainer,
            // Apply specific style if marked
            isSelected && { backgroundColor: marking.selectedColor },
            isBeforeMinDate && { opacity: 0.5 },
          ]}
        >
          <Text style={styles.dayText}>{date.day}</Text>
          <Text style={styles.lunarDateText}>{lunarDate}</Text>

          {/* Optionally display a marker, like a dot or icon */}
          {isMarked && <View style={styles.markerDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  const getDatesInRange = (startDate, endDate) => {
    let dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); // Tăng thêm 1 ngày
    }
    return dateArray;
  };

  const handleSearch = async () => {

    const newDateTo = show ? dateto.toISOString() : 'null'

    const searchItem = {
      diemdi: diemDi,
      diemden: diemDen,
      ngaydi: datefrom.toISOString(),
      ngayve: newDateTo,
      soVe: soVe,
      timestamp: new Date().toISOString(),  // Thời gian tìm kiếm
    };

    try {
      // Retrieve existing search history from AsyncStorage
      const existingHistory = await getAsyncStorage('searchHistory');
      const updatedHistory = Array.isArray(existingHistory) ? [searchItem, ...existingHistory] : [searchItem];

      // Save the updated history array to AsyncStorage
      await setAsyncStorage('searchHistory', updatedHistory);

      const response = await getData("tripsRoutes/search", {
        departure: diemDi,
        destination: diemDen,
        departureDate: datefrom.toISOString(),
        returnDate: newDateTo,
        tripType: show,
        userId: user?._id,
      });
      console.log(response?.data);

      setTrips(response?.data);
      //Navigate to the RSearch screen with parameters
      nav.navigate("RSearch", {
        trips: response?.data,
        ngaydi: datefrom.toISOString(),
        ngayve: newDateTo,
        diemdi: diemDi,
        diemden: diemDen,
        soVe: soVe
      });
    } catch (error) {
      if (error.response) {
        console.error("Error fetching trips:", error.response.data);
        console.error("Status code:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  }


  const handleGetProvinces = (type) => {
    nav.navigate("ListProvinces", { type })
  }
  const handleSearchHistory = (diemDi, diemDen) => {
    setDiemDi(diemDi)
    setDiemDen(diemDen)
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <Image
          source={require('../../../img/imageheader.png')}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 5 }}>
          <View style={styles.view_Wel}>
            {user?.img ? (
              <Image source={{ uri: user?.img }} style={{ width: 50, height: 50, borderRadius: 100 }} />
            ) : (
              <Icon name='person-circle' type='ionicon' size={48} color={"white"} />
            )}

            <View style={styles.ViewText_Wel}>
              <Text style={{ color: "white" }}>Xin chào,</Text>
              <Text style={{ fontSize: 18, color: "white" }}>{user?.fullName}</Text>
            </View>
          </View>

          <View style={styles.viewContact}>
            <Icon
              size={22}
              raised
              name='headset'
              type='material'
              color='#f50'
              onPress={() => console.log('contact')} />
          </View>
        </SafeAreaView>

      </View>
      <View style={styles.search}>
        <View style={styles.viewVitri}>

          <View style={styles.viewDiemDi}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Điểm đi</Text>

            <TouchableOpacity
              style={styles.diemdi}
              onPress={() => handleGetProvinces("Điểm đi")}>
              {diemDi ? (
                <Text style={{ fontSize: 16 }}>{diemDi}</Text>
              ) :
                (<Text style={{ fontSize: 16 }}>Chọn điểm đến</Text>)}

            </TouchableOpacity>
          </View>
          <View style={styles.iconSwap} >
            <TouchableOpacity onPress={handleSwap}>
              <Icon name="swap-horizontal-outline" type='ionicon' w color={'#FE9B4B'} />
            </TouchableOpacity>

          </View>

          <View style={styles.viewDiemden}>
            <Text style={{ fontSize: 16, textAlign: 'right', fontWeight: '500' }}>Điểm đến</Text>
            <TouchableOpacity
              style={styles.diemden}
              onPress={() => handleGetProvinces("Điểm đến")}>
              {diemDen ? (
                <Text style={{ fontSize: 16 }}>{diemDen}</Text>
              ) :
                (<Text style={{ fontSize: 16 }}>Chọn điểm đến</Text>)}
            </TouchableOpacity>

          </View>
        </View>

        <View style={styles.Viewdate}>
          <View style={styles.dateColumn}>
            <Text style={styles.datePickerText}>Ngày đi</Text>
            <TouchableOpacity style={styles.touchDateFrom} onPress={() => showCalendar('from')}>
              <Text style={styles.weekDayText}>
                {datefrom.toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: "numeric",
                  weekday: 'short',
                })}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateColumn}>
            <Text style={[styles.datePickerText, { color: show ? 'black' : '#C2C0C0' }]}>Ngày về</Text>
            <TouchableOpacity
              disabled={!show}
              style={[styles.touchDateTo, { color: show ? 'black' : '#C2C0C0' }]}
              onPress={() => showCalendar('to')}>
              <Text style={[styles.weekDayText, { color: show ? 'black' : '#C2C0C0' }]}>
                {dateto?.toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: "numeric",
                  weekday: 'short',
                })}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.roundTrip}>
            <Text style={{ padding: 5, fontSize: 16 }}>Khứ hồi</Text>
            <Switch
              value={show}
              onValueChange={(value) => setShow(value)}
            />
          </View>
        </View>

        {/* Hiển thị lịch khi cần */}
        {calendarVisible && (
          <View style={styles.datePickerOverlay}>
            <Calendar
              hideExtraDays
              style={{ width: 400, height: 430 }}
              minDate={selectingDateFor === 'from' ? new Date().toISOString().split('T')[0] : datefrom.toISOString().split('T')[0]}
              dayComponent={({ date, marking }) => (
                <DayComponent
                  date={date}
                  marking={marking}
                  onPress={(day) => onDaySelect(day)} // Pass the selected day to the onDaySelect function
                />
              )}
              theme={{
                'stylesheet.calendar.header': {
                  dayTextAtIndex0: {
                    color: 'red',
                  },
                  dayTextAtIndex6: {
                    color: 'blue',
                  },
                },
              }}
              markedDates={selectingDateFor === 'from'
                ? {
                  // Only mark the departure date with lightblue color for one-way trip
                  [datefrom.toISOString().split('T')[0]]: {
                    selected: true,
                    marked: true,
                    selectedColor: "lightblue",
                  },
                }
                : {
                  // Mark both departure and return dates with different colors for round-trip
                  [datefrom.toISOString().split('T')[0]]: {
                    selected: true,
                    marked: true,
                    selectedColor: "lightblue", // Departure date color
                  },
                  [dateto.toISOString().split('T')[0]]: {
                    selected: true,
                    marked: true,
                    selectedColor: "orange", // Return date color
                  },
                  // Highlight dates between departure and return
                  ...getDatesInRange(datefrom, dateto).reduce((acc, date) => {
                    const formattedDate = date.toISOString().split('T')[0];
                    if (formattedDate !== datefrom.toISOString().split('T')[0] && formattedDate !== dateto.toISOString().split('T')[0]) {
                      acc[formattedDate] = {
                        marked: true,
                        selected: true,
                        selectedColor: 'lightgray', // Dates between departure and return
                      };
                    }
                    return acc;
                  }, {}),
                }}
            />
          </View>
        )}


        <View style={styles.soLuong}>
          <Input
            value={soVe}
            leftIcon={{ type: 'ionicon', name: 'person-outline' }}
            label="Số vé"
            labelStyle={{ color: 'black', fontWeight: '500', paddingBottom: 5 }}
            containerStyle={{ width: '28%' }}
            inputMode="numeric"
            onChangeText={(text) => setSoVe(text)}
            inputContainerStyle={{ borderWidth: 1, borderRadius: 10, borderColor: '#ccc' }}
          />
        </View>

        <TouchableOpacity style={styles.btn_submit} onPress={() => handleSearch()}>
          <Text style={styles.text_btn}>Tìm tuyến xe</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <ScrollView style={styles.viewNews}
          showsHorizontalScrollIndicator={false}
        >

          {visibleHistory && (
            <View>
              <View style={styles.viewTextHistory}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>Tìm kiếm gần đây</Text>
                <TouchableOpacity
                  onPress={() => deleteHistorySearch()}
                >
                  <Text style={{ fontSize: 13, color: "red" }}>Xoá lịch sử</Text>
                </TouchableOpacity>

              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal>
                {searchHistory.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => handleSearchHistory(item.diemdi, item.diemden)}
                    key={index} style={styles.historyItem}>
                    <Text>{item?.diemdi} - {item?.diemden}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>


          )}

          <View style={styles.viewTextHistory}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Tin tức</Text>

          </View>
          <View style={{ width: "100%", height: 80, backgroundColor: "gray" }}>

          </View>
          <View style={{ width: "100%", height: 80, backgroundColor: "gray" }}>

          </View>
          <View style={{ width: "100%", height: 80, backgroundColor: "gray" }}>

          </View>
          <View style={{ width: "100%", height: 80, backgroundColor: "gray" }}>

          </View>
          <View style={{ width: "100%", height: 80, backgroundColor: "gray" }}>

          </View>
        </ScrollView>

      </View>

    </View>

  )
}

export default Home

