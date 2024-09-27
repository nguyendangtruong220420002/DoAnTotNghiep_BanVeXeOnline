import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from './styles'
import { Switch } from '@gluestack-ui/themed';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Icon, Input } from 'react-native-elements'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import SelectDropdown from 'react-native-select-dropdown'
import { calendarsConfig } from '../../CalendarConfig/CalendarConfig';
import { solarToLunar } from 'lunar-calendar'

const Home = () => {

  const [data, setData] = useState([]);

  const [selectedDiemDi, setSelectedDiemDi] = useState(null);
  const [selectedDiemDen, setSelectedDiemDen] = useState(null);

  const [datefrom, setDatefrom] = useState(new Date())
  const [dateto, setDateto] = useState(new Date())


  const [show, setShow] = useState(false);
  const [soVe, setSoVe] = useState("1");
  const today = new Date();

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectingDateFor, setSelectingDateFor] = useState('from');

  LocaleConfig.locales['vi'] = calendarsConfig;
  LocaleConfig.defaultLocale = 'vi';

  const getProvinces = async () => {
    try {
      const response = await fetch('https://provinces.open-api.vn/api');
      const json = await response.json();

      const provinceNames = json.map(province => province.name);

      setData(provinceNames);  // Setting the extracted data to state


    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProvinces();
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

    console.log("Điểm đi", selectedDiemDi);
    console.log("điểm đến", selectedDiemDen);
    
    console.log("Ngày đi",datefrom);
    console.log("Ngày về",dateto);
    console.log("Số vé: ",soVe);
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <Image
          source={require('../../img/imageheader.png')}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 5 }}>
          <View style={styles.view_Wel}>
            <Icon name='person-circle' type='ionicon' size={48} color={"white"} />
            <View style={styles.ViewText_Wel}>
              <Text style={{ color: "white" }}>Xin chào,</Text>
              <Text style={{ fontSize: 18, color: "white" }}>Phem Sỹ Thái</Text>
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
                defaultValueByIndex={data.length}

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
                defaultValueByIndex={data.length}
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
                size={'sm'}
                isDisabled={false}
                trackColor={{ false: 'gray', true: '#FE9B4B' }}
                thumbColor={'white'}
                activeThumbColor={'#FE9B4B'}
                ios_backgroundColor={'gray'}
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
                    onPress={(day) => onDaySelect(day)}  // Pass the selected day to the onDaySelect function
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
                markedDates={{
                  [datefrom.toISOString().split('T')[0]]: {
                    selected: true,
                    marked: true,
                    selectedColor: "lightblue"
                    // Màu cho ngày "Đi"
                  },
                  [dateto.toISOString().split('T')[0]]: {
                    selected: true,
                    marked: true,
                    selectedColor: "orange"
                    // Màu cho ngày "Về"
                  },
                  ...getDatesInRange(datefrom, dateto).reduce((acc, date) => {
                    const formattedDate = date.toISOString().split('T')[0];
                    if (formattedDate !== datefrom.toISOString().split('T')[0] && formattedDate !== dateto.toISOString().split('T')[0]) {
                      acc[formattedDate] = {
                        marked: true,
                        selected: true,
                        selectedColor: 'lightgray', // Màu cho các ngày giữa `datefrom` và `dateto`
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

