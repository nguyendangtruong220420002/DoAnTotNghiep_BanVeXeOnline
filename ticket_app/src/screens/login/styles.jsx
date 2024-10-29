import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    welcomeText: {
        fontSize: 28,
        textAlign: 'center',
        paddingTop: 15
    },
    imgWel2:{
        width: "100%",
        height: 323,
        marginTop: 40
    },
    container: {
        flex:1
    },
    viewInput:{
        flexDirection:'column',
        marginTop:10,
    },
    TextInput: {
        padding:15,
        height: 50,
        width: "82%",
        alignSelf: 'center',
        borderColor: "#ced4da",
        borderRadius: 20,
        borderWidth:1
    },
    btn_submit : {
        alignSelf:'center',
        justifyContent: "center",
        backgroundColor:"#FE9B4B",
        height:40,
        width:290,
        borderRadius:20,
    },
    text_btn :{
        color:"white",
        fontSize:14,
        textAlign:'center',
    }
});