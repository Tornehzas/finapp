import { Easing, StyleSheet } from "react-native";
import { sizes } from "../styles";




export const HomePageStyle=StyleSheet.create({
    header:{
     alignSelf:'flex-start',
     fontSize:25,
     color:"white",
     marginTop:sizes.fullHeight*0.045
    },
    page:{
     display:'flex',
     width:sizes.fullWidth,
     height:sizes.fullHeight,
     alignItems:'center',
    },
    gradient:{
        width:sizes.fullWidth,
        height:sizes.fullHeightS,
        alignItems:'center',
        paddingLeft:sizes.fullWidth*0.04,
        paddingRight:sizes.fullWidth*0.04,
    }
})