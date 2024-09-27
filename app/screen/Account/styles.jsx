import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    viewHeader: {
        height: 250,
        backgroundColor: "#f95300",
        position: "relative",
        zIndex: 1,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20
    },
    headerImage: {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0, // Make sure image is behind other header content
    },
    body: {
        height: "100%",
        position: "absolute",
        top: 140,  // Adjust this value based on how much overlap you want
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
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth:1,
        borderBottomColor:"#ededed",
        padding:15
    },
    ViewText_Wel: {
        marginLeft: 10,
    },
    ListItem:{

    }
})