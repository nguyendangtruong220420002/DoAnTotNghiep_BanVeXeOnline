import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
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
        fontSize: 18,
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
    body: {
        padding: 10
    },
    routeName: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    routeBody: {
        flexDirection: "row",
        justifyContent: "space-between", // Separate Thời gian and Địa điểm
        padding: 10,
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
        fontFamily: "inter",
        textAlign: "right",
        paddingRight: 10,
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
    dashedLine: {
        height: 20,  // Adjust based on desired spacing
        width: 1,
        backgroundColor: "gray",
        borderStyle: "dashed",
        borderWidth: 0.5,
        marginVertical: 5,
        left: 72
    },
})