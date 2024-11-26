import { StyleSheet } from "react-native";

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
    topBody: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        width: "100%",
        elevation: 0.2,
        borderBottomWidth: 0.1,

    },
    body: { height: "100%", justifyContent: 'space-between' },

    seatContainer: {

        marginVertical: 10,
        flexDirection: "row",
        marginLeft: 15,
        justifyContent: "space-between"
    },

    column: { flex: 1, alignItems: 'center' },
    column1: {

    },
    seatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5
    },
    seatWrapper: {
        alignItems: 'center',
        position: 'relative',
        width: 35,
        margin: 1,
        height: 35,
        justifyContent: 'center',
    },
    seatWrapper1: {
        alignItems: 'center',
        position: 'relative',
        width: 35,
        marginHorizontal: 5,
        marginBottom: 9.5,
        height: 35,
        justifyContent: 'center',
    },
    seatNumber: {
        position: 'absolute',
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        color: "#fff",
        top: 5
    },
    emptySeat: { width: 30, height: 30 },
    radioIcon: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
    },
    chosing: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 5,
    },
    bottom: {
        width: "100%",
        height: 200,
        elevation: 0.2,
        borderTopWidth: 0.1,
        paddingBottom:15
    },
    btnContinue: {
        height: 40,
        width: "90%",
        alignSelf: 'center',
        justifyContent: "center",
        backgroundColor: "#FE9B4B",
        borderRadius: 20,
    },
    textbtn: {
        color: "white",
        fontSize: 14,
        textAlign: 'center',
    }
});