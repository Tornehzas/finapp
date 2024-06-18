import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import Carousel from "react-native-snap-carousel";
import { HomePageStyle } from "../home_page/home_page_style";
import { Pressable,StatusBar } from "react-native";
import { Alert } from "react-native";
import { months } from "../../LOGIC/Calendar";
import { calendar } from "../../LOGIC/Calendar";
import { Budget } from "../../LOGIC/Budget";
import { useEffect } from "react";
import { sizes } from "../styles";
import { lang } from "../languages";

export function TransactionPage({colorTheme,budget,currency,db,deleteTransaction,refresh,language}){
  const [selectedYear, setSelectedYear]=useState(new Date().getFullYear())
  const [selectedMonth,setSelectedMonth]=useState(months[new Date().getMonth()])
  const [selectedBudget,setSelectedBudget]=useState(budget)    
  const showConfirmDialog = (direction,category,i) => {
        return Alert.alert(
          "",
          lang[language].deleteTConfirm,
          [
            {
              text: lang[language].yes,
              onPress: () => {
                deleteTransaction(selectedYear,selectedMonth,direction,category,i)
                changeSelectedBudget(selectedYear,selectedMonth)
              },
            },
            {
              text: lang[language].no,
            },
          ]
        );
  }
  useEffect(()=>{
    changeSelectedBudget(selectedYear,selectedMonth)
  },[refresh])
  function changeSelectedBudget(year,month){
    db.transaction(tx=>{
      tx.executeSql(
        `SELECT ${month} FROM budget WHERE year=?`,[year],
        (txObj,resultSet)=>{
          if(resultSet.rows._array[0]&&resultSet.rows._array[0][month]){
            setSelectedBudget(JSON.parse(resultSet.rows._array[0][month]))
          }
          else{
            setSelectedBudget(new Budget())
          }
        }
      )
    })
  }
    function renderTransactionList({index}){
        return(
            <View style={{
              marginTop:sizes.fullHeight*0.01,
              width:sizes.fullWidth,
              height:sizes.fullHeight,
              alignItems:'center'
            }}>
                <Text style={{height:sizes.fullHeight*0.05, fontSize:20/sizes.fontScale, textAlign:'center',color:index===0?'red':'lime'}}>{index===0?lang[language].spendings:lang[language].incomes}</Text>
                <View style={{
                  width:sizes.fullWidth,
                  height:sizes.fullHeight*0.5
                }}>
                <ScrollView 
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
                style={{
              width:sizes.fullWidth,
                }}
                contentContainerStyle={{alignItems:'center'}}>
                  {selectedBudget[`${index===0?'spendings':'incomes'}`].map((category,i)=>{
                    return(
                      <View key={i+200}style={{
                        width:sizes.fullWidth,
                        alignItems:"center"}}>
                        <Text key={i} style={{color:"white",height:sizes.fullHeight*0.05, fontSize:20/sizes.fontScale, textAlign:'center'}}>{category.categoryName}</Text>
                        {category.transactions.map((transaction,ind)=>{
                          return(
                          <Pressable key={ind+100}style={{height:sizes.fullHeight*0.05, fontSize:20/sizes.fontScale, textAlign:'center'}} 
                          onPress={()=>{showConfirmDialog(`${index===0?'spendings':'incomes'}`,i,ind)}}> 
                            <Text key={ind+1} style={{color:"white",height:sizes.fullHeight*0.05, fontSize:20/sizes.fontScale, textAlign:'center'}}>
{`${transaction.date.day}/${transaction.date.month}/${transaction.date.year}`}  {transaction.value}{currency} {lang[language].payments[transaction.payInstrument]}
                            </Text>
                            </Pressable>
                          )
                        })}
                      </View>
                    )
                  })}
                   </ScrollView>
                   </View>
            </View>
        )
  }
    return(
        <View>
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
                  <Text style={HomePageStyle.header}>{lang[language].transactions}</Text>
                  <View 
                  style={{
  marginTop:sizes.fullHeight*0.02,
  display:"flex",
  height:sizes.fullHeight*0.05,
  width:sizes.fullWidth,
  backgroundColor:'transparent',
  alignItems:'center'}}>
                  <ScrollView
contentOffset={{x:0,y:sizes.fullHeight*0.05*(new Date().getFullYear()-2006)}}
pagingEnabled={true}
overScrollMode="never"
showsVerticalScrollIndicator={false}
style={{  width:sizes.fullWidth,
  height:sizes.fullHeight*0.05}}
onScrollEndDrag={(e)=>{
setSelectedYear(calendar.years[Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.05))])
changeSelectedBudget(calendar.years[Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.05))],selectedMonth)
}}
onSnapToItem={(i)=>{
  changeSelectedBudget(calendar.years[i],selectedMonth)
  setSelectedYear(calendar.years[i])
  }}
>
  {calendar.years.map((year)=>{
   return(
    <Text key={year}style={{color:"white",height:sizes.fullHeight*0.05, fontSize:20, textAlign:'center'}}>{year}</Text>
   )
})}
                  </ScrollView>
                  </View>
                  <View style={{
                    marginTop:sizes.fullHeight*0.01,
                    display:"flex",
                    height:sizes.fullHeight*0.05,
                    width:sizes.fullWidth,
                    backgroundColor:'transparent',
                    alignItems:'center'
                  }}>
                  <ScrollView 
contentOffset={{x:0,y:sizes.fullHeight*0.05*(new Date().getMonth())}}
showsVerticalScrollIndicator={false}
pagingEnabled={true}
overScrollMode="never"
style={{width:sizes.fullWidth,
  height:sizes.fullHeight*0.05}}
onScrollEndDrag={(e)=>{
setSelectedMonth(months[Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.05))])
changeSelectedBudget(selectedYear,months[Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.05))])
}}
onSnapToItem={(i)=>{
  setSelectedMonth(months[i])
  changeSelectedBudget(selectedYear,months[i])
  }}
>
  {months.map((month,i)=>{
   return(
    <Text key={i} style={{color:"white",height:sizes.fullHeight*0.05, fontSize:20/sizes.fontScale, textAlign:'center'}}>{lang[language].monthsShort[i]}</Text>
   )
})}
                   </ScrollView>
                   </View>

                  <Carousel
                  data={[1,2]}
                  renderItem={renderTransactionList}
                  itemWidth={sizes.fullWidth}
                  sliderWidth={sizes.fullWidth}
                  />
              </LinearGradient>
  </View>
    )
}