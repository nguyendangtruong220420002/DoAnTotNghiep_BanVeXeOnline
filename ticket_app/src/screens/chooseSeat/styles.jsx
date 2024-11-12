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
  
    body: { height: "100%" },
    seatContainer: {
        marginVertical: 10,
        flexDirection: "row",
    },
    column: { flex: 1, alignItems: 'center' },
    seatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    seatWrapper: {
        alignItems: 'center',
        margin: 5,
        position: 'relative',
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    seatNumber: {
        position: 'absolute',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        color: "#fff",
        top: 2,
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
});