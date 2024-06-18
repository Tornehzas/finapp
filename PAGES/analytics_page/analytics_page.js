import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HomePageStyle } from "../home_page/home_page_style";
import { Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Budget } from "../../LOGIC/Budget";
import { calendar } from "../../LOGIC/Calendar";
import { enablePromise, openDatabase } from "react-native-sqlite-storage";
import { Button,StatusBar } from "react-native";
import Carousel from "react-native-snap-carousel";
import { BarChart, LineChart} from 'react-native-chart-kit-with-pressable-bar-graph'
import { months } from "../../LOGIC/Calendar";
import { Alert } from "react-native";
import { sizes } from "../styles";
import { height } from "deprecated-react-native-prop-types/DeprecatedImagePropType";
import { lang } from "../languages";


export function AnalyticsPage({colorTheme,budget, currency, db,deleteCategory,refresh,language}){
  const [analyticsBudget, setAnalyticsBudget]=useState(budget)
  const [selectedYear, setSelectedYear]=useState(new Date().getFullYear())
  const [selectedMonth,setSelectedMonth]=useState(new Date().getMonth())
  const [analyticsSums, setAnalyticsSums]=useState([0,0,0,0,0,0,0,0,0,0,0,0])
  const [selectedAnalyticsType,setSelectedAnalyticsType]=useState(0)
  const [selectedDirection,setSelectedDirection]=useState('incomes')
function updateAnalyticsSums(year){
  db.transaction(tx=>{
    tx.executeSql(
      'SELECT * FROM budget WHERE year=?',[year],
      (txObj,resultSet)=>{
        let arr=[]
        for(let i=0;i<12;i++){
          if(resultSet.rows._array[0]&&resultSet.rows._array[0][`${months[i]}`]){
          let b=JSON.parse(resultSet.rows._array[0][`${months[i]}`])
          arr.push(b.sum)
          }
          else{
            arr.push(0)
          }
        }
        setAnalyticsSums(arr)
      }
    )
  })
}
function updateAnalyticsBudget(year,month){
  db.transaction(tx=>{
    tx.executeSql(
      `SELECT * FROM budget WHERE year=?`,[year],
      (txObj,resultSet)=>{
        if(resultSet.rows._array[0]&&resultSet.rows._array[0][`${months[month]}`]){
          setAnalyticsBudget(JSON.parse(resultSet.rows._array[0][`${months[month]}`]))
        }
        else{setAnalyticsBudget(new Budget())}
      }
    )
  })
}
const showConfirmDialog = (direction,index) => {
  return Alert.alert(
    "",
    lang[language].deleteConfirm,
    [
      {
        text: lang[language].yes,
        onPress: () => {
              deleteCategory(selectedYear,months[selectedMonth],direction,index)
              let bu=JSON.parse(JSON.stringify(analyticsBudget))
              bu[direction].splice(index,1)
              setAnalyticsBudget(bu)
        }
      },
      {
        text:lang[language].no,
      }
    ]
  );
}
useEffect(()=>{
  updateAnalyticsBudget(selectedYear,selectedMonth)
  updateAnalyticsSums(selectedYear)
},[refresh])
    return(
        <View style={HomePageStyle.page}>
            <LinearGradient
            colors={['#032D38','#032D38','#112D41']}
            locations={[
                0,0.3,0.8
            ]}
            start={{x:0,y:0}}
            end={{x:1,y:1}}
            style={HomePageStyle.gradient}
            >
              <StatusBar style={colorTheme}/>
                <Text style={HomePageStyle.header}>{lang[language].analytics}</Text>
<View 
style={{
  display:"flex",
  height:sizes.fullHeight*0.05,
  width:sizes.fullWidth,
  backgroundColor:'transparent',
  alignItems:'center',
}}
>
<ScrollView 
contentOffset={{x:0,y:sizes.fullHeight*0.05*(new Date().getFullYear()-2006)}}
pagingEnabled={true}
overScrollMode="never"
showsVerticalScrollIndicator={false}
onScrollEndDrag={(e)=>{
setSelectedYear(calendar.years[Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.05))])
updateAnalyticsSums(calendar.years[Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.05))])
updateAnalyticsBudget(calendar.years[Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.05))],selectedMonth)
}}
onSnapToItem={(i)=>{
  setSelectedYear(calendar.years[i])
  updateAnalyticsSums(calendar.years[i])
  updateAnalyticsBudget(calendar.years[i],selectedMonth)
}}
style={{
  width:sizes.fullWidth,
  height:sizes.fullHeight*0.05,
}}
>
  {calendar.years.map((year)=>{
   return(
    <Text key={year} style={{color:"white",height:sizes.fullHeight*0.05, fontSize:20/sizes.fontScale, textAlign:'center'}}>{year}</Text>
   )
})}
</ScrollView>
</View>
<View style={{
   marginTop:sizes.fullHeight*0.01,
   height:sizes.fullHeight*0.35,
   width:'100%',
   backgroundColor:'transparent',
   alignItems:'center',
}}>
<ScrollView
overScrollMode="never"
showsHorizontalScrollIndicator={false}
horizontal={true}
style={{
  height:sizes.fullHeight*0.35,
  width:'100%',
  marginTop:0,
}}
contentContainerStyle={{alignItems:"center"}}
>
 <BarChart
 showValuesOnTopOfBars={true}
 segments={0}
 fromZero={true}
 onDataPointClick={({index})=>{
  setSelectedMonth(index)
  updateAnalyticsBudget(selectedYear,index)
 }}
  data={{
    labels: lang[language].monthsShort,
    datasets: [
      {
        data:analyticsSums,
        color: (opacity = 1) => `rgba(5, 229, 255, ${opacity})`, // optional
        strokeWidth: 3 // optional
      }
    ],
  }}
 style={{
  marginLeft:-sizes.fullWidth*0.2
 }}
  width={12*50}
  height={sizes.fullHeight*0.35}
  chartConfig={{
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(5, 229, 255, ${opacity})`,
  }}
/> 
</ScrollView>
</View>
<View style={{
   marginTop:sizes.fullHeight*0.01,
   height:sizes.fullHeight*0.05,
   width:sizes.fullWidth,
   backgroundColor:'transparent',
   alignItems:'center',
}}>
<ScrollView
pagingEnabled={true}
overScrollMode="never"
showsVerticalScrollIndicator={false}
style={{
  width:sizes.fullWidth,
  height:sizes.fullHeight*0.05, 
}}
contentContainerStyle={{alignItems:'center'}}
onScrollEndDrag={(e)=>{setSelectedAnalyticsType(Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.05)))}}
onSnapToItem={(i)=>{setSelectedAnalyticsType(i)}}
>
  <Text style={{color:"white",fontSize:20/sizes.fontScale, width:sizes.fullWidth,height:sizes.fullHeight*0.05,  textAlign:'center'}}>{lang[language].categories}</Text>
  <Text style={{color:"white",fontSize:20/sizes.fontScale, width:sizes.fullWidth,height:sizes.fullHeight*0.05,  textAlign:'center'}}>{lang[language].payInstruments}</Text>
</ScrollView>
</View>
<View style={{ 
   height:sizes.fullHeight*0.05,
   width:sizes.fullWidth,
   backgroundColor:'transparent',
   alignItems:'center'}}>
<ScrollView 
onScrollEndDrag={(e)=>{
  if(e.nativeEvent.contentOffset.y/sizes.fullHeight*0.05===0){
    setSelectedDirection('incomes')}
  else{setSelectedDirection('spendings')}
}}
pagingEnabled={true}
scrollEnabled={true}
showsVerticalScrollIndicator={false}
overScrollMode="never"
contentContainerStyle={{
  width:sizes.fullWidth,
  backgroundColor:'transparent',
  alignItems:'center',
}}>
<Text style={{fontSize:20/sizes.fontScale,textAlign:'center',width:sizes.fullWidth/2,height:sizes.fullHeight*0.05,color:'lime'}}>{lang[language].incomes}</Text>
<Text style={{fontSize:20/sizes.fontScale,textAlign:'center',width:sizes.fullWidth/2,height:sizes.fullHeight*0.05,color:'red'}}>{lang[language].spendings}</Text>
</ScrollView>
</View>

<View 
style={{
  marginTop:sizes.fullHeight*0.01,
  width:sizes.fullWidth,
  backgroundColor:'transparent',      
  marginLeft:sizes.fullWidth*0.1,
  height:sizes.fullHeight*0.25
}}>
  {selectedAnalyticsType===0?
    <ScrollView 
    scrollEnabled={true} 
    overScrollMode="never"
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      alignItems:"center",
      width:sizes.fullWidth,
      }}>
    {analyticsBudget[selectedDirection].map((item,i)=>{return(
  <Pressable  key={i+1}
  onLongPress={()=>{showConfirmDialog(selectedDirection,i)}}
  style={{
    height:sizes.fullHeight*0.05,
    width:sizes.fullWidth,
  }}
  >
    <Text 
    style={{
      color:"white",
      fontSize:20/sizes.fontScale,
      height:sizes.fullHeight*0.05,
      width:sizes.fullWidth,
    }} key={i}>{item.categoryName} {item.value}{currency}</Text></Pressable> 
  )})}
  </ScrollView>
:
    <View style={{
      width:sizes.fullWidth,
      height:sizes.fullHeight*0.3
    }}>
    <Text style={{color:"white",fontSize:20/sizes.fontScale,width:sizes.fullWidth,height:sizes.fullHeight*0.05}}>{lang[language].payments.card} {analyticsBudget[`${selectedDirection}cardSum`]}{currency}</Text>
    <Text style={{color:"white",fontSize:20/sizes.fontScale,width:sizes.fullWidth,height:sizes.fullHeight*0.05}}>{lang[language].payments.cash} {analyticsBudget[`${selectedDirection}cashSum`]}{currency}</Text>
    <Text style={{color:"white",fontSize:20/sizes.fontScale,width:sizes.fullWidth,height:sizes.fullHeight*0.05}}>{lang[language].payments.crypto} {analyticsBudget[`${selectedDirection}cryptoSum`]}{currency}</Text>
  </View>
  }
  
</View>
</LinearGradient>
       
        </View>
    )
}