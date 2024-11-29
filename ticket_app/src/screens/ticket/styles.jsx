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
        height: "100%",
        position: "absolute",
        top: 140,  // Adjust this value based on how much overlap you want
        left: 0,
        right: 0,
        zIndex: 2,
    },
    headerCard: {
        justifyContent: "space-between",
        flexDirection: "row"
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5, // For Android shadow effect
    },
    bookingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bookingDetails: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    bookingDate: {
        fontSize: 14,
        color: '#f95300',
        marginTop: 5,
        marginLeft: 5,
        fontWeight: "bold"
    },
    bookingInfo: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
        marginLeft: 5,
        fontWeight: "bold"
    },
    bookingFare: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#f95300',
        textAlign: "right"
    },
    dashedLineHorizontal: {
        width: '100%',
        height: 1,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E0E0E0',
        marginVertical: 10,
    },
})