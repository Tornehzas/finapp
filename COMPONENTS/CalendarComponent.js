import { ScrollView, View, Text } from "react-native";
import { calendar } from "../LOGIC/Calendar";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { useState } from "react";
import { sizes } from "../PAGES/styles";
import { lang } from "../PAGES/languages";

export function CalendarComponent({language,selectedYear,setSelectedYear,selectedMonth,setSelectedMonth,selectedDay,setSelectedDay}){
    
    return(
        <View 
        style={{
             width:'100%',
             height:'100%',
             flexDirection:'row',
             justifyContent:'center',
             alignItems:'center',
        }}
        >
<ScrollPicker
wrapperBackground="none"
wrapperHeight={sizes.fullHeight*0.3}
itemHeight={sizes.fullHeight*0.06}
highlightColor="black"
dataSource={calendar.months[selectedMonth].days}
selectedIndex={0}
renderItem={(item)=>{
   return(<Text
    style={{
        width:sizes.fullWidth*0.89,
        height:sizes.fullHeight*0.05,
        fontSize:23,
        textAlign:'center',
        textAlignVertical:'center'
    }}
    >{item}</Text>)
}}
onValueChange={(v,i)=>{setSelectedDay(v)}}
></ScrollPicker>

<ScrollPicker
wrapperBackground="none"
wrapperHeight={sizes.fullHeight*0.3}
itemHeight={sizes.fullHeight*0.06}
highlightColor="black"
dataSource={calendar.months}
selectedIndex={0}
renderItem={(item,index)=>{
   return(<Text
    style={{
        width:sizes.fullWidth*0.89,
        height:sizes.fullHeight*0.05,
        fontSize:23,
        textAlign:'center',
        textAlignVertical:'center'
    }}
    >{lang[language].months[index]}</Text>)
}}
onValueChange={(v,i)=>{setSelectedMonth(i)}}
></ScrollPicker>

<ScrollPicker
wrapperBackground="none"
wrapperHeight={sizes.fullHeight*0.3}
itemHeight={sizes.fullHeight*0.06}
highlightColor="black"
dataSource={calendar.years}
selectedIndex={0}
renderItem={(item)=>{
   return(<Text
    style={{
        width:sizes.fullWidth*0.89,
        height:sizes.fullHeight*0.05,
        fontSize:23,
        textAlign:'center',
        textAlignVertical:'center'
    }}
    >{item}</Text>)
}}
onValueChange={(v,i)=>{setSelectedYear(v)}}
></ScrollPicker>

        </View>
    )
}
