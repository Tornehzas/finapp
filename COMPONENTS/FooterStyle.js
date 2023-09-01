import { StyleSheet } from "react-native";

export const FooterStyle=StyleSheet.create({
    background:{

        display:'flex',
        flexDirection:'row',
        backgroundColor:'black',
        width:'100%',
        height:'7%',
        position:'absolute',
        alignItems:'center',
    },
    button:{
        marginLeft:'7%',
        marginRight:'7%',
        height:'90%',
        paddingLeft:'1%',
        paddingTop:'1%',
        paddingRight:'1%',
    },
    image:{
        width:65,
        height:65,
    }
})