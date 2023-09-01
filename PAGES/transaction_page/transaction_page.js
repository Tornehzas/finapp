import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import Carousel from "react-native-snap-carousel";
import { HomePageStyle } from "../home_page/home_page_style";
import { Pressable } from "react-native";
import { Alert } from "react-native";
import { months } from "../../LOGIC/Calendar";
import { calendar } from "../../LOGIC/Calendar";
import { Budget } from "../../LOGIC/Budget";
import { useEffect } from "react";
import { sizes } from "../styles";
import { lang } from "../languages";


export function TransactionPage({budget,currency,db,deleteTransaction,refresh,language}){
  const [selectedYear, setSelectedYear]=useState(2006)
  const [selectedMonth,setSelectedMonth]=useState('jan')
  const [selectedBudget,setSelectedBudget]=useState(new Budget())    
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
                <Text style={{height:sizes.fullHeight*0.05, fontSize:25, textAlign:'center',color:index===0?'red':'lime'}}>{index===0?lang[language].spendings:lang[language].incomes}</Text>
                <ScrollView 
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
                style={{
              width:sizes.fullWidth,
              height:sizes.fullHeight,
                }}
                contentContainerStyle={{alignItems:'center'}}>
                  {selectedBudget[`${index===0?'spendings':'incomes'}`].map((category,i)=>{
                    return(
                      <View style={{
                        width:sizes.fullWidth,
                        height:sizes.fullHeight,
                        alignItems:"center"}}>
                        <Text key={i} style={{height:sizes.fullHeight*0.05, fontSize:25, textAlign:'center'}}>{category.categoryName}</Text>
                        {category.transactions.map((transaction,ind)=>{
                          return(
                          <Pressable key={ind}style={{height:sizes.fullHeight*0.05, fontSize:25, textAlign:'center'}} 
                          onPress={()=>{showConfirmDialog(`${index===0?'spendings':'incomes'}`,i,ind)}}> 
                            <Text key={ind+1} style={{height:sizes.fullHeight*0.05, fontSize:25, textAlign:'center'}}>
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

pagingEnabled={true}
overScrollMode="never"
style={{  width:sizes.fullWidth,
  height:sizes.fullHeight*0.05}}
onScrollEndDrag={(e)=>{
setSelectedYear(calendar.years[Math.round(e.nativeEvent.contentOffset.y/40)])
changeSelectedBudget(calendar.years[Math.round(e.nativeEvent.contentOffset.y/40)],selectedMonth)
}}
onSnapToItem={(i)=>{
  changeSelectedBudget(calendar.years[i],selectedMonth)
  setSelectedYear(calendar.years[i])
  }}
>
  {calendar.years.map((year)=>{
   return(
    <Text key={year}style={{height:sizes.fullHeight*0.05, fontSize:25, textAlign:'center'}}>{year}</Text>
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

pagingEnabled={true}
overScrollMode="never"
style={{width:sizes.fullWidth,
  height:sizes.fullHeight*0.05}}
onScrollEndDrag={(e)=>{
setSelectedMonth(months[Math.round(e.nativeEvent.contentOffset.y/40)])
changeSelectedBudget(selectedYear,months[Math.round(e.nativeEvent.contentOffset.y/40)])
}}
onSnapToItem={(i)=>{
  setSelectedMonth(months[i])
  changeSelectedBudget(selectedYear,months[i])
  }}
>
  {months.map((month,i)=>{
   return(
    <Text key={i} style={{height:sizes.fullHeight*0.05, fontSize:25, textAlign:'center'}}>{lang[language].monthsShort[i]}</Text>
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