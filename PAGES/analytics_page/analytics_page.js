import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HomePageStyle } from "../home_page/home_page_style";
import { Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Budget } from "../../LOGIC/Budget";
import { calendar } from "../../LOGIC/Calendar";
import { enablePromise, openDatabase } from "react-native-sqlite-storage";
import { Button } from "react-native";
import Carousel from "react-native-snap-carousel";
import { BarChart, LineChart} from 'react-native-chart-kit-with-pressable-bar-graph'
import { months } from "../../LOGIC/Calendar";
import { Alert } from "react-native";
import { sizes } from "../styles";
import { height } from "deprecated-react-native-prop-types/DeprecatedImagePropType";
import { lang } from "../languages";
export function AnalyticsPage({budget, currency, db,deleteCategory,refresh,language}){
  const [analyticsBudget, setAnalyticsBudget]=useState(new Budget())
  const [selectedYear, setSelectedYear]=useState(2006)
  const [selectedMonth,setSelectedMonth]=useState(0)
  const [analyticsSums, setAnalyticsSums]=useState([0,0,0,0,0,0,0,0,0,0,0,0])
  const [selectedAnalyticsType,setSelectedAnalyticsType]=useState(0)
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
              analyticsBudget[direction].splice(index,1)
              setAnalyticsBudget(analyticsBudget)
              updateAnalyticsBudget(selectedYear,selectedMonth)
              updateAnalyticsSums(selectedYear)
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
                <Text style={HomePageStyle.header}>{lang[language].analytics}</Text>
<View 
style={{
  display:"flex",
  height:sizes.fullHeight*0.04,
  width:sizes.fullWidth,
  backgroundColor:'transparent',
  alignItems:'center',
}}
>
<ScrollView 
pagingEnabled={true}
overScrollMode="never"
showsVerticalScrollIndicator={false}
onScrollEndDrag={(e)=>{
setSelectedYear(calendar.years[Math.round(e.nativeEvent.contentOffset.y/40)])
updateAnalyticsSums(calendar.years[Math.round(e.nativeEvent.contentOffset.y/40)])
updateAnalyticsBudget(calendar.years[Math.round(e.nativeEvent.contentOffset.y/40)],selectedMonth)
}}
onSnapToItem={(i)=>{
  setSelectedYear(calendar.years[i])
  updateAnalyticsSums(calendar.years[i])
  updateAnalyticsBudget(calendar.years[i],selectedMonth)
}}
style={{
  width:sizes.fullWidth,
  height:sizes.fullHeight*0.04
}}
>
  {calendar.years.map((year)=>{
   return(
    <Text key={year} style={{height:sizes.fullHeight*0.04, fontSize:25, textAlign:'center'}}>{year}</Text>
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
   height:sizes.fullHeight*0.04,
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
  height:sizes.fullHeight*0.04, 
}}
contentContainerStyle={{alignItems:'center'}}
onScrollEndDrag={(e)=>{setSelectedAnalyticsType(Math.round(e.nativeEvent.contentOffset.y/40))}}
onSnapToItem={(i)=>{setSelectedAnalyticsType(i)}}
>
  <Text style={{fontSize:20, width:sizes.fullWidth,height:sizes.fullHeight*0.04,  textAlign:'center'}}>{lang[language].categories}</Text>
  <Text style={{fontSize:20, width:sizes.fullWidth,height:sizes.fullHeight*0.04,  textAlign:'center'}}>{lang[language].payInstruments}</Text>
</ScrollView>
</View>
<View style={{ 
  marginTop:sizes.fullHeight*0.01,
   height:sizes.fullHeight*0.05,
   width:sizes.fullWidth,
   backgroundColor:'transparent',
   alignItems:'center'}}>
<Text style={{alignSelf:'flex-start',fontSize:20,textAlign:'center',width:sizes.fullWidth/2,height:sizes.fullHeight*0.04,position:'absolute',color:'lime'}}>{lang[language].incomes}</Text>
<Text style={{alignSelf:'flex-end',fontSize:20,textAlign:'center',width:sizes.fullWidth/2,height:sizes.fullHeight*0.04,position:'absolute',color:'red'}}>{lang[language].spendings}</Text>
</View>

<View 
style={{
  marginTop:sizes.fullHeight*0.01,
  height:sizes.fullHeight*0.2,
  width:sizes.fullWidth,
  backgroundColor:'transparent',
}}>
  {selectedAnalyticsType===0?
    <View 
    style={{
      height:sizes.fullHeight*0.2,
      width:sizes.fullWidth,
      backgroundColor:'transparent',
      alignItems:'center',
    }}>
    <ScrollView  
    style={{
      width:sizes.fullWidth/2,
      height:sizes.fullHeight*0.26,
      alignSelf:'flex-start',
    position:'absolute'
    }}
    contentContainerStyle={{
      alignItems:"center",
      }}>
    {analyticsBudget.incomes.map((item,i)=>{return(
  <Pressable  key={i+1}
  onLongPress={()=>{showConfirmDialog('incomes',i)}}
  style={{
    height:sizes.fullHeight*0.05,
      width:sizes.fullWidth/2,
      textAlign:'center'
  }}
  >
    <Text 
    style={{
      fontSize:20,
      height:sizes.fullHeight*0.05,
      width:sizes.fullWidth/2,
      textAlign:'center'
    }} key={i}>{item.categoryName} {item.value}{currency}</Text></Pressable> 
  )})}
  </ScrollView>
  <ScrollView 
  style={{
    width:sizes.fullWidth/2,
    height:sizes.fullHeight*0.26,  
    alignSelf:'flex-end',
    position:'absolute'
    }}
    contentContainerStyle={{
      alignItems:"center"
      }}>
    {analyticsBudget.spendings.map((item,i)=>{return(
  <Pressable key={i+1}
  onLongPress={()=>{showConfirmDialog('spendings',i)}}
  style={{
    height:sizes.fullHeight*0.05,
      width:sizes.fullWidth/2,
      textAlign:'center'
  }}
  >
    <Text
    style={{
      fontSize:20,
      height:sizes.fullHeight*0.05,
      width:sizes.fullWidth/2,
      textAlign:'center'
    }} 
    key={i}>{item.categoryName} {item.value}{currency}</Text>
    </Pressable>  
  )})}
  </ScrollView>
  </View>
:
  <View
  style={{
    marginTop:sizes.fullHeight*0.01,
    height:sizes.fullHeight*0.2,
    width:sizes.fullWidth,
    backgroundColor:'transparent',
    alignItems:'center'
  }}
  >
    <View style={{
      alignSelf:"flex-start",
      position:'absolute',
      alignItems:'center',
      width:sizes.fullWidth/2,
      height:sizes.fullHeight*0.2
    }}>
    <Text style={{fontSize:20,textAlign:'center',width:sizes.fullWidth/2,height:sizes.fullHeight*0.05}}>{lang[language].payments.card} {analyticsBudget.incomescardSum}{currency}</Text>
    <Text style={{fontSize:20,textAlign:'center',width:sizes.fullWidth/2,height:sizes.fullHeight*0.05}}>{lang[language].payments.cash} {analyticsBudget.incomescashSum}{currency}</Text>
    <Text style={{fontSize:20,textAlign:'center',width:sizes.fullWidth/2,height:sizes.fullHeight*0.05}}>{lang[language].payments.crypto} {analyticsBudget.incomescryptoSum}{currency}</Text>
    </View>
    <View style={{
        alignSelf:"flex-end",
        position:'absolute',
        alignItems:'center',
        width:sizes.fullWidth/2,
        height:sizes.fullHeight*0.2
    }}>
    <Text style={{fontSize:20,textAlign:'center',width:sizes.fullWidth/2,height:sizes.fullHeight*0.05}}>{analyticsBudget.spendingscardSum}{currency}</Text>
    <Text style={{fontSize:20,textAlign:'center',width:sizes.fullWidth/2,height:sizes.fullHeight*0.05}}>{analyticsBudget.spendingscashSum}{currency}</Text>
    <Text style={{fontSize:20,textAlign:'center',width:sizes.fullWidth/2,height:sizes.fullHeight*0.05}}>{analyticsBudget.spendingscryptoSum}{currency}</Text>
    </View>
  </View>
  }
  
</View>
</LinearGradient>
       
        </View>
    )
}