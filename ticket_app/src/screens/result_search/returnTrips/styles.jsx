import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        fontFamily: "Inter"
    },
    viewHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    viewTitle: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
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
    body: {

        top: 0,
        left: 0,
        right: 0,
        height: "100%",
        backgroundColor: "#E0E0E0",
    },
    containerGap: {
        gap: 24,
        paddingVertical: 10,
        backgroundColor: "white"
    },
    datecontainer: {
        width: 95,
        height: 60,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "space-around",
        //backgroundColor: "lightgray",
        paddingBottom: 0

    },
    viewFilter: {
        height: 80,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        gap: 15,
        backgroundColor: "white",
        alignItems: "center"

    },
    filterChild: {
        width: "30%",
        backgroundColor: "#E0E0E0",
        height: 40,
        borderRadius: 20,
        padding: 10
    },
    btnFilter: {
        height: "100%",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row"
    },
    textFilter: {
        fontSize: 16,
        color: "black",
        textAlign: "left"
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
        fontWeight: 'bold',
        marginBottom: 10,
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
    radioText: {
        fontSize: 16,
    },
    btnClose: {
        marginTop: 15,
        alignItems: 'center',
    },
    btnCloseText: {
        fontSize: 16,
        color: 'blue',
    },
    listTicket: {
        padding: 3,
    },
    listItem: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 5,
        padding: 15
    },
    viewtop: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },
    viewIcon: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },
    iconimg: {
        height: 25,
        width: 25,
    },
    dashedLineHorizontal: {
        width: '100%',
        height: 1,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E0E0E0',
        marginVertical: 10,
    },
    dashedHorizontal: {
        width: '20%',
        height: 1,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E0E0E0',
        marginVertical: 10,
        alignSelf: "center"
    },
    iconContainer: {
        position: 'absolute',
        top: -15,
        left: '50%',
        transform: [{ translateX: -10 }],  // Điều chỉnh lại để căn chính xác theo chiều ngang
    },
    listContent: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",

    },
    textDiemdi: {
        color: "#757575"
    },
    textTime: {
        fontSize: 28,
        fontWeight: "bold"
    },
    textDay: {
        color: "#757575",
        paddingRight: 5
    },
    viewDateTime: {
        flexDirection: "row",

    },
    tripsRoute: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10,
        alignContent: "center",
        width: 100,
        height: 35
    }
})