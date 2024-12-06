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
        width: "100%",
        height: "100%",
        justifyContent: "space-between"
    },
    imgWel2: {
        width: "100%",
        height: 250,
        marginTop: 40
    },
    textlabel: {
        left: 30,
        margin: 5
    },
    viewInput: {
        flexDirection: 'column',
        marginTop: 10,
    },
    TextInput: {
        padding: 15,
        height: 50,
        width: "90%",
        alignSelf: 'center',
        borderColor: "#ced4da",
        borderRadius: 20,
        borderWidth: 1
    },
    btn_submit: {
        alignSelf: 'center',
        justifyContent: "center",
        backgroundColor: "#FE9B4B",
        height: 40,
        width: 290,
        borderRadius: 20,
        bottom: 50
    },
    text_btn: {
        color: "white",
        fontSize: 14,
        textAlign: 'center',
    }
})