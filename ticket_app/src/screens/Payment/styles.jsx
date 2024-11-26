const { StyleSheet } = require("react-native");

export const styles = StyleSheet.create({
    container: { flex: 1, fontFamily: "inter", backgroundColor: "white" },
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
        fontWeight: "450"
    },
    contentInfioCus: {

    },
    viewTrip: {
        padding: 8,
        borderBottomColor: "#eee",
        borderBottomWidth: 3,
        width: "100%"
    },
    textaddress: {
        fontWeight: "300"
    },
    textTitle: {
        color: "green"
    },
    viewPayment: {
        backgroundColor: "#ECECEC",
        padding: 10,
        margin: 8,
        borderRadius: 15
    },
    viewCost: {
        borderBottomWidth: 0.2,
        borderBottomColor: "grey",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 5,
    },
    viewBtn: {
        justifyContent: "center",
        height: 120,
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
    timerText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "red",
    },
})