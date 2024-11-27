const { StyleSheet } = require("react-native");

export const styles = StyleSheet.create({
    container: { flex: 1, fontFamily: "Inter" },
    viewTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    viewChild: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center'
    },
    headerBackgroundContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        backgroundColor: '#f95300',
    },
    textTime: {
        color: "white",
        padding: 5
    },
    body: {
        backgroundColor: "white",
        width: "100%",
    },
    viewInfoCustomer: {
        padding: 8,
        borderBottomColor: "#eee",
        borderBottomWidth: 3,
        width: "100%"
    },
    headerInfoCus: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 5
    },
    textListItem: {
        fontWeight: "300"
    },
    contentInfioCus: {

    },
    viewTrip: {
        padding: 8,
        borderBottomColor: "#eee",
        borderBottomWidth: 3,
        width: "100%"
    },

    timeContainer: {
        flex: 1,
        paddingRight: 10,
    },
    locationContainer: {
        flex: 1, // Give location more space
        paddingLeft: 10,

    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 5,
    },
    timeText: {
        width: 60, // Fixed width to align times
        fontSize: 14,
        color: "#666",
        textAlign: "right",
        paddingRight: 10,
        fontWeight: "500"
    },
    stopText: {
        fontSize: 14,
        color: "#333",
        fontFamily: "inter",
        paddingVertical: 1,
    },
    stopAddress: {
        fontSize: 12,
        color: "#999",
        fontFamily: "inter",
        paddingVertical: 1,
    },
    locationText: {
        marginLeft: 9,
        color: "green"
    },
    routeName: {

        alignItems: "center",
        padding: 10,
    },
    routeBody: {
        flexDirection: "row",
        justifyContent: "space-between", // Separate Thời gian and Địa điểm
        padding: 10,
    },
    dashedLine: {
        height: 20,  // Adjust based on desired spacing
        width: 1,
        backgroundColor: "gray",
        borderStyle: "dashed",
        borderWidth: 0.5,
        marginVertical: 5,
        left: 72
    },
    tripsRoute: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10,
        alignContent: "center",
        width: 100,
        height: 35,
        left: 65
    },
    viewSeat: {
        padding: 10,
        borderBottomColor: "#eee",
        borderBottomWidth: 3,
        width: "100%"
    },
    ViewPickUp_Drop_Info: {
        padding: 8,
        width: "100%"
    },
    ContentPickUp_Drop_Info: {

    },
    textDiemDon_Tra: {
        fontSize: 18,
        fontWeight: '450',
        padding: 8
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 18,

        marginBottom: 10,
        textAlign: "center"
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    radioIcon: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    radioSelected: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#000',
    },
    radioTextName: {
        fontSize: 14,
        color: "#333",
        fontFamily: "inter",
        paddingVertical: 1,
    },
    radioTextAddress: {
        fontSize: 12,
        color: "#999",
        fontFamily: "inter",
        paddingVertical: 1,
    },

    btnClose: {
        marginTop: 15,
        alignItems: 'center',
    },
    btnCloseText: {
        fontSize: 16,
        color: 'blue',
    },
    modalTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1, // Border cho View
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    textSelected: {
        fontSize: 16,
        color: '#555',
        padding: 5,
    },
    viewBtn: {
        justifyContent: "center",
        height: 100,
        backgroundColor: "white",
        elevation: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    btnContinue: {
        height: 40,
        width: "90%",
        alignSelf: 'center',
        backgroundColor: "#FE9B4B",
        borderRadius: 20,
        justifyContent: "center",
    },
    textbtn: {
        color: "white",
        fontSize: 16,
        textAlign: 'center',
        fontWeight: "500"
    },
    label: {
        fontSize: 16,
        marginVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
})