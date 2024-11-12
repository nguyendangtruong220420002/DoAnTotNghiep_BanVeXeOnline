import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 35,
        margin: 10,
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

    FlatList: {
        width: "100%",
        padding: 10,
        borderTopWidth: 0.2,
        borderColor: "grey",
    },
    textFlatlist: {
        fontSize: 18,
        fontWeight: "300"
    }
})