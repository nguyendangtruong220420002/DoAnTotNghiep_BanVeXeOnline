import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    viewHeader: {
        height: 100,
        backgroundColor: "#f95300",
        position: "relative",
        zIndex: 1,
        paddingTop: 45
    },
    btnBack: {
        alignSelf: "flex-start",
        marginLeft: 5,

    },
    viewChild: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    headerImage: {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        height: "180%"
    },
    body: {
        position: "absolute",
        top: 100,
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
        padding: 15
    },
    listItem: {
        height: 80,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 5,
        padding: 5
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
})