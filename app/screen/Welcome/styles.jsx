import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    imgWel: {
        width: "100%",
        height: 350,
        right: 55,
        marginBottom: 20
    },
    welcomeText: {
        fontSize: 28,
        textAlign: 'center',

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
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
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