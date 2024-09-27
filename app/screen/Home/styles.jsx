import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    view_Wel: {
        flexDirection: "row",
        alignItems: "center",
        margin: 15,
    },
    ViewText_Wel: {
        marginLeft: 10,

    },
    viewHeader: {
        height: 250,
        backgroundColor: "#f95300",
        position: "relative",
        zIndex: 1,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0, // Make sure image is behind other header content
    },
    body: {
        height: "100%",
        position: "absolute",
        top: 140,  // Adjust this value based on how much overlap you want
        left: 0,
        right: 0,
        zIndex: 2,
    },
    search: {
        alignSelf: "center",
        backgroundColor: "white",
        height: "100%",
        width: "96%",
        borderRadius: 15,
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        padding: 13,
    },
    viewVitri: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignContent: "center",
        alignContent: "center",
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#C2C0C0",
        borderCurve: "continuous",
        paddingHorizontal: 10
    },
    viewDiemDi: {
        width: '50%',
    },
    viewDiemden: {
        width: '50%',
    },
    iconSwap: {
        position: "relative",
        top: 15,
        backgroundColor: "white",
        height: 35,
        width: 35,
        borderRadius: 50,
        padding: 5,
        shadowColor: "#000", // Màu của bóng
        shadowOffset: { width: 0, height: 1 }, // Độ dịch chuyển của bóng
        shadowOpacity: 0.25, // Độ mờ của bóng (0-1)
        shadowRadius: 2.84, // Độ tỏa của bóng
    },
    btn_submit: {
        alignSelf: 'center',
        justifyContent: "center",
        backgroundColor: "#FE9B4B",
        height: 48,
        width: 330,
        borderRadius: 15,
    },
    text_btn: {
        color: "white",
        fontSize: 16,
        textAlign: 'center',
    },
    Viewdate: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#C2C0C0",
    },
    dayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderRadius: 5,
    },
    dayText: {
        fontSize: 16,
    },
    lunarDateText: {
        fontSize: 10,
        color: 'gray',
    },
    selectedDay: {
        backgroundColor: 'orange',
        color: 'white',
    },
    markedDay: {
        backgroundColor: '#e0f7fa', // Light blue background for marked days
    },
    holidayDay: {
        backgroundColor: '#ffebee', // Light red background for holidays
    },
    markerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'orange', // Small red dot for marked days
        marginTop: 4,
    },
    dateColumn: {
        flexDirection: "column",
        alignItems: "flex-start", // Center content within each column
        width: "25%", // Slightly adjusted for better width distribution
    },

    touchDateTo: {
        width: '100%', // Ensures full width for button
        padding: 8, // Padding inside the button for better touch area
        borderRadius: 8, // Rounded corners for modern look
        borderWidth: 1,
        borderColor: '#ccc',


    },
    touchDateFrom: {
        width: '100%', // Consistent full width
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',

    },
    datePickerOverlay: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: 400,
        width: 400
    },
    datePickerText: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '500',
    },
    roundTrip: {
        flexDirection: "row",
        top: 10,
    },
    soLuong: {
        width: "100%",
        paddingTop: 8
    },
    dropdownButtonStyle: {
        width: "100%",
        height: 45,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'left',
    },
    dropdownButtonTxtStyle1: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'right',
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownSearchInputStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#B1BDC8',
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#B1BDC8',
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
        textAlign: 'left',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    viewNews: {

    },
    contentNews: {
        flexDirection: "row"
    },
    historySearch: {
        backgroundColor: "#ccc",
        height: 35,
        marginHorizontal: 15
    }
})