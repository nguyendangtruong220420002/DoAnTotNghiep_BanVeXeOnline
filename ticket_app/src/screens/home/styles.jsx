import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontFamily: "Inter"
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
        paddingTop: 40,
        height: 250,
        backgroundColor: "#f95300",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        zIndex: 1,
    },
    headerImage: {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0, // Make sure image is behind other header content
    },
    body: {
        flex: 1,
        paddingHorizontal: 5,
        zIndex: 2,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: "white",
        paddingTop: 210
    },
    search: {
        alignSelf: "center",
        backgroundColor: "white",
        width: "96%",
        borderRadius: 15,
        elevation: 5,
        padding: 13,
        position: "absolute",
        zIndex: 3,
        top: 130
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
    diemdi: {
        padding: 10
    },
    diemden: {
        padding: 10,
        alignSelf: "flex-end"
    },
    iconSwap: {
        position: "relative",
        top: 15,
        backgroundColor: "white",
        height: 35,
        width: 35,
        borderRadius: 50,
        padding: 5,
        elevation: 5, // Đổ bóng cho Android
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
        alignItems: 'center',
        zIndex: 10,
        borderRadius: 10,
        overflow: 'hidden',
        height: 380,
        width: 380,
        elevation: 5,

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
    viewNews: {
        marginVertical: 20,
        paddingLeft: 14,
    },
    viewTextHistory: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingRight: 15,
        paddingVertical: 10
    },
    historyItem: {
        padding: 10,
        backgroundColor: '#E3ECEF',
        marginRight: 10,
        borderRadius: 5,
    },
})