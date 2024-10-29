import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from './styles'
import { Icon, Input } from 'react-native-elements'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import SelectDropdown from 'react-native-select-dropdown'
import { calendarsConfig } from '../../config/CalendarConfig';
import { solarToLunar } from 'lunar-calendar'
import axios from 'axios';
import { getAsyncStorage } from '../../utils/cookie';

const Home = () => {

  const [user, setUser] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [selectedDiemDi, setSelectedDiemDi] = useState(null);
  const [selectedDiemDen, setSelectedDiemDen] = useState(null);

  const [datefrom, setDatefrom] = useState(new Date())
  const [dateto, setDateto] = useState(new Date())
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [show, setShow] = useState(false);
  const [soVe, setSoVe] = useState("1");

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectingDateFor, setSelectingDateFor] = useState('from');

  LocaleConfig.locales['vi'] = calendarsConfig;
  LocaleConfig.defaultLocale = 'vi';

  const getProvinces = async () => {
    try {

      const response = await axios.get("https://open.oapi.vn/location/provinces?size=63");

      // Kiểm tra xem dữ liệu trả về có hợp lệ hay không
      if (response.data && Array.isArray(response.data.data)) {
        const provincesData = response.data.data;

        const provinceNames = provincesData.map(province => province.name);
        const pre = provincesData.map(province => province.typeText);

        setData(provinceNames);  // Setting the extracted data to state

      } else {
        console.error("Dữ liệu API không hợp lệ:", response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAsyncStorage("token");
      const user = await getAsyncStorage("user");

      console.log("Fetched token:", token);
      console.log("Fetched user:", user);
      setUser(user);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProvincesAndDistricts = async () => {
      setLoading(true); // Đặt loading về true trước khi bắt đầu

      try {
        // Lấy danh sách tỉnh/thành phố
        const provincesResponse = await axios.get("https://open.oapi.vn/location/provinces?size=63");
        if (provincesResponse.data && Array.isArray(provincesResponse.data.data)) {
          const provincesData = provincesResponse.data.data;
          const cleanedProvinces = provincesData.map((province) => ({
            ...province,
            name: province.name.replace(/^(Tỉnh|Thành phố) /, ""),
          }));

          const allDistricts = [];
          const totalCount = 705;
          const pageSize = 100;
          let page = 1;


          while (true) {
            try {
              const districtResponse = await axios.get(`https://open.oapi.vn/location/districts?page=${page}&size=${pageSize}`);
              if (districtResponse.data.code === 'success') {
                const districtsData = districtResponse.data.data.map((district) => {
                  // Tìm tỉnh tương ứng với quận/huyện
                  const province = provincesData.find(prov => prov.id === district.provinceId);
                  return {
                    ...district,
                    provinceName: province ? province.name.replace(/^(Tỉnh|Thành phố) /, "") : '',
                    label: `${district.name.replace(/^(Huyện|Quận) /, "")} - ${province ? province.name.replace(/^(Tỉnh|Thành phố) /, "") : ''}`,
                  };
                });

                allDistricts.push(...districtsData);

                // console.log(`Đã lấy ${districtsData.length} quận/huyện từ trang ${page}.`);
                if (districtsData.length < pageSize) break;

                page++; // Tăng trang
              } else {
                console.error(`Lỗi từ API: ${districtResponse.data.message}`);
                break;
              }
            } catch (error) {
              if (error.response && error.response.status === 429) {
                //     console.error('Quá nhiều yêu cầu, đang chờ để thử lại...');
                await new Promise(resolve => setTimeout(resolve, 1000));
              } else {
                console.error('Lỗi Khi Lấy Dữ Liệu API:', error.message);
                break;
              }
            }
          }

          setProvinces(cleanedProvinces);
          setDistricts(allDistricts);
        } else {
          //   console.error("Dữ liệu API không hợp lệ:", provincesResponse.data);
        }

        setLoading(false);
      } catch (error) {
        //  console.error("Lỗi Khi Lấy Dữ Liệu API:", error);
        setLoading(false);
      }
    };

    fetchProvincesAndDistricts();
  }, []);


  const handleSwap = () => {
    setSelectedDiemDi(selectedDiemDen);
    setSelectedDiemDen(selectedDiemDi);
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

  const handleSearch = () => {

    const newDateTo = show ? dateto : 'null'

    console.log("Điểm đi", selectedDiemDi);
    console.log("điểm đến", selectedDiemDen);

    console.log("Ngày đi", datefrom);
    console.log("Ngày về", newDateTo);
    console.log("Số vé: ", soVe);



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
            <Icon name='person-circle' type='ionicon' size={48} color={"white"} />
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
      <ScrollView style={styles.body}>
        <View style={styles.search}>
          <View style={styles.viewVitri}>

            <View style={styles.viewDiemDi}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>Điểm đi</Text>
              <SelectDropdown
                data={data}
                defaultValue={selectedDiemDi}
                defaultValueByIndex={provinces.length}

                onSelect={(selectedItem, index) => {
                  setSelectedDiemDi(selectedItem);
                }}
                renderButton={(selectedItem, isOpen) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>{selectedItem || 'Chọn điểm đi'}</Text>
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View
                      style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && { backgroundColor: '#D2D9DF' }),
                      }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                    </View>
                  );
                }}
                dropdownStyle={styles.dropdownMenuStyle}
                search
                searchInputStyle={styles.dropdownSearchInputStyle}
                searchInputTxtColor={'#151E26'}
                searchPlaceHolder={'Tìm kếm điểm đi'}
                searchPlaceHolderColor={'#72808D'}
                renderSearchInputLeftIcon={() => {
                  return <Icon name='search-outline' type='ionicon' color={'#72808D'} size={18} />;
                }}
              />

            </View>
            <View style={styles.iconSwap} >
              <TouchableOpacity onPress={handleSwap}>
                <Icon name="swap-horizontal-outline" type='ionicon' w color={'#FE9B4B'} />
              </TouchableOpacity>

            </View>

            <View style={styles.viewDiemden}>
              <Text style={{ fontSize: 16, textAlign: 'right', fontWeight: '500' }}>Điểm đến</Text>
              <SelectDropdown
                data={data}
                defaultValueByIndex={provinces.length}
                defaultValue={selectedDiemDen}
                onSelect={(selectedItem, index) => {
                  setSelectedDiemDen(selectedItem);
                }}
                renderButton={(selectedItem, isOpen) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle1}>{selectedItem || 'Chọn điểm đến'}</Text>
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View
                      style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && { backgroundColor: '#D2D9DF' }),
                      }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                    </View>
                  );
                }}
                dropdownStyle={styles.dropdownMenuStyle}
                search
                searchInputStyle={styles.dropdownSearchInputStyle}
                searchInputTxtColor={'#151E26'}
                searchPlaceHolder={'Tìm kếm điểm đến'}
                searchPlaceHolderColor={'#72808D'}
                renderSearchInputLeftIcon={() => {
                  return <Icon name='search-outline' type='ionicon' color={'#72808D'} size={18} />;
                }}
              />
            </View>
          </View>

          <View style={styles.Viewdate}>
            <View style={styles.dateColumn}>
              <Text style={styles.datePickerText}>Ngày đi</Text>
              <TouchableOpacity style={styles.touchDateFrom} onPress={() => showCalendar('from')}>
                <Text style={styles.weekDayText}>
                  {datefrom.toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'long',
                    weekday: 'long',
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
                    month: 'long',
                    weekday: 'long',
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
                style={{ width: 400, height: 400 }}
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
      </ScrollView>

    </View>

  )
}

export default Home

