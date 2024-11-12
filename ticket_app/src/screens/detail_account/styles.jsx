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
        left: 0,
        right: 0,
        zIndex: 2,
    },
    list: {
        alignSelf: "center",
        backgroundColor: "white",
        height: 500,
        width: "100%",
        borderRadius: 12,
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

    },
    view_user: {
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ededed",
        padding: 10
    },
    ViewText_Wel: {
        marginLeft: 10,
    },
    ListItem: {

    },
    viewBtn:{
        padding:15
    },
    btnUpdate: {
        alignSelf: "center",
        alignItems:"center",
        backgroundColor:"#f95300",
        height:45,
        width:"80%",
        padding:10,
        borderRadius:30,
        marginBottom:15
    },
    btnSignOut: {
        backgroundColor:"white",
        alignSelf: "center",
        borderColor:"grey",
        borderWidth:1,
        borderRadius:30,
        height:45,
        width:"80%",
        padding:10,
        alignItems:"center",
    },
    // Các style cho modal
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 20,
        paddingVertical: 5,
        fontSize: 16,
    },
    modalSaveButton: {
        backgroundColor: '#FE9B4B',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    modalCancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 5,
    },
})