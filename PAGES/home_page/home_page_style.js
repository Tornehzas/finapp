import { Easing, StyleSheet } from "react-native";
import { sizes } from "../styles";




export const HomePageStyle=StyleSheet.create({
    header:{
     alignSelf:'flex-start',
     fontSize:30,
    },
    page:{
     display:'flex',
     width:sizes.fullWidth,
     height:sizes.fullHeight,
     alignItems:'center',
    },
    gradient:{
        width:sizes.fullWidth,
        height:sizes.fullHeight,
        alignItems:'center',
        paddingLeft:sizes.fullWidth*0.04,
        paddingRight:sizes.fullWidth*0.04,
        paddingTop:sizes.fullHeight*0.05,
    }
})