import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomePage } from "../PAGES/home_page/home_page";
import { AnalyticsPage } from "../PAGES/analytics_page/analytics_page";
import { SettingPage } from "../PAGES/setting_page/setting_page";
import { Header } from "react-native/Libraries/NewAppScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Appearance, Image, useColorScheme } from "react-native";
import { FooterStyle } from "./FooterStyle";
import { Budget, addCategoryTo } from "../LOGIC/Budget";
import { useState, useEffect } from "react";
import { getCopyBudget } from "../LOGIC/Budget";
import { TransactionPage } from "../PAGES/transaction_page/transaction_page";
import * as SQLite from 'expo-sqlite'
import { Category } from "../LOGIC/Category";
import { months } from "../LOGIC/Calendar";
import { Transaction } from "../LOGIC/Transaction";
import { payments } from "../LOGIC/Payments";

export const Tab=createBottomTabNavigator()
export function Tabs(){
  const [refresh, setRefresh]=useState({c:0})
  const [currency, setCurrency]=useState('$')
  const [language, setLanguage]=useState('English')
  const [budget,setBudget]=useState(new Budget())
  const [template,setTemplate]=useState(new Budget())
  let colorTheme=Appearance.getColorScheme()
const db=SQLite.openDatabase('tomerchant.db')
function updateBudget(){
    budget.sum=budget.incomesSum-budget.spendingsSum
    setBudget(getCopyBudget(budget))
    db.transaction(tx=>{
      tx.executeSql(
        `UPDATE budget SET ${months[new Date().getMonth()]}=? WHERE year=?`,[JSON.stringify(budget),new Date().getFullYear()],
        (txObj,resultSet)=>{
          let nR={c:refresh.c+1}
        setRefresh(nR)}
      )
    })
}
function db_createTable(){
db.transaction(tx=>{
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS budget (current TEXT, language TEXT, currency TEXT, year INTEGER, jan TEXT, feb TEXT, mar TEXT, apr TEXT, may TEXT, jun TEXT, jul TEXT, aug TEXT, sep TEXT, oct TEXT, nov TEXT, dec TEXT)`,null,
      (txObj, resultSet)=>{}) 
})
db.transaction(tx=>{
  tx.executeSql(
    'SELECT current FROM budget',null,
    (txObj, resultSet)=>{
      if(resultSet.rows._array.length===0){
            tx.executeSql('INSERT INTO budget (current,language,currency) VALUES (?,?,?)'),[JSON.stringify(template),'english','$'],
            (txObj, resultSet)=>{
      }
  }
} 
  )
})
}
function addTransaction(day,month,year,direction,category,value,payInstrument){
  if(month-1===new Date().getMonth()&&year===new Date().getFullYear()){
    budget[direction][category].transactions.push(new Transaction(day,month,year,value,payInstrument))
    budget[direction][category].value=Number((Number(budget[direction][category].value)+Number(value)).toFixed(2))
    budget[`${direction}Sum`]=Number(budget[`${direction}Sum`])+Number(value)
    budget[direction][category][`${payments[payInstrument].name}value`]=Number((Number(budget[direction][category][`${payments[payInstrument].name}value`])+Number(value)).toFixed(2))
    budget[`${direction}${payments[payInstrument].name}Sum`]=Number(budget[`${direction}${payments[payInstrument].name}Sum`])+Number(value)
    updateBudget()
    let nR={c:refresh.c+1}
    setRefresh(nR)
  }
  else{
    db.transaction(tx=>{
      tx.executeSql(
        `SELECT year FROM budget WHERE year=?`,[year],
        (txObj,resultSet)=>{
          if(resultSet.rows._array.length===0){
            let b=new Budget()
            addCategoryTo(b,direction,budget[direction][category].categoryName)
            b[direction][0].value+=value
            b[direction][0].transactions.push(new Transaction(day,month,year,value,payInstrument))
            b[`${direction}Sum`]+=value
            b[direction][0][`${payments[payInstrument].name}value`]=Number((Number(b[direction][0][`${payments[payInstrument].name}value`])+Number(value)).toFixed(2))
            b[`${direction}${payments[payInstrument].name}Sum`]=Number(b[`${direction}${payments[payInstrument].name}Sum`])+Number(value)
            b.sum=b.incomesSum-b.spendingsSum
             tx.executeSql(
              `INSERT INTO budget (year, ${months[month-1]}) VALUES (?,?)`,[year,JSON.stringify(b)],
              (txObj,resultSet)=>{  
                let nR={c:refresh.c+1}
                setRefresh(nR)}
             )
          }
          else{
            tx.executeSql(
              `SELECT ${months[month-1]} FROM budget WHERE year=?`,[year],
              (txObj, resultSet)=>{ 
                let b=new Budget()
                 addCategoryTo(b,direction,budget[direction][category].categoryName)
                  b[direction][0].value+=value
                  b[direction][0].transactions.push(new Transaction(day,month,year,value,payInstrument))
                  b[`${direction}Sum`]+=value
                  b[direction][0][`${payments[payInstrument].name}value`]=Number((Number(b[direction][0][`${payments[payInstrument].name}value`])+Number(value)).toFixed(2))
                  b[`${direction}${payments[payInstrument].name}Sum`]=Number(b[`${direction}${payments[payInstrument].name}Sum`])+Number(value)
                  b.sum=b.incomesSum-b.spendingsSum;
                if(resultSet.rows._array[0][`${months[month-1]}`]===null){
                  tx.executeSql(
                    `UPDATE budget SET ${months[month-1]}=? WHERE year=?`,[JSON.stringify(b),year],
                    (txObj,resultSet)=>{ 
                    
                      let nR={c:refresh.c+1}
                       setRefresh(nR)
                    }
                  )
                }
                else{
                  let b=JSON.parse(resultSet.rows._array[0][`${months[month-1]}`])
                  let i=b[direction].findIndex((el,index)=>{
                   if(el.categoryName===budget[direction][category].categoryName){
                    return true
                   } 
                    return false
                  });
                  if(i>=0){
                    b[direction][i].value+=value
                    b[direction][i].transactions.push(new Transaction(day,month,year,value,payInstrument))
                    b[`${direction}Sum`]+=value
                    b[direction][i][`${payments[payInstrument].name}value`]=Number((Number(b[direction][i][`${payments[payInstrument].name}value`])+Number(value)).toFixed(2))
                    b[`${direction}${payments[payInstrument].name}Sum`]=Number(b[`${direction}${payments[payInstrument].name}Sum`])+Number(value)
                    b.sum=b.incomesSum-b.spendingsSum
                      tx.executeSql(
                    `UPDATE budget SET ${months[month-1]}=? WHERE year=?`, [JSON.stringify(b), year],
                    (txObj,resultSet)=>{
                            let nR={c:refresh.c+1}
                            setRefresh(nR)
                    }
                  )
  
                  }
                  else if(i===-1){
                    addCategoryTo(b,direction,budget[direction][category].categoryName)
                    b[direction][b[direction].length-1].value+=value
                    b[direction][b[direction].length-1].transactions.push(new Transaction(day,month,year,value,payInstrument))
                    b[`${direction}Sum`]+=value
                    b[direction][b[direction].length-1][`${payments[payInstrument].name}value`]=Number((Number(b[direction][b[direction].length-1][`${payments[payInstrument].name}value`])+Number(value)).toFixed(2))
                    b[`${direction}${payments[payInstrument].name}Sum`]=Number(b[`${direction}${payments[payInstrument].name}Sum`])+Number(value)
                    b.sum=b.incomesSum-b.spendingsSum
                    tx.executeSql(
                      `UPDATE budget SET ${months[month-1]}=? WHERE year=?`, [JSON.stringify(b), year],
                      (txObj,resultSet)=>{
                        let nR={c:refresh.c+1}
                        setRefresh(nR)
                      }
                    ) 
                  }
                }
              }
            )
          }
        },
      )
    }) 
  }
}
function deleteTransaction(year,month,direction,category,i){
  db.transaction(tx=>{
    tx.executeSql(
      `SELECT ${month} FROM budget WHERE year=?`,[year],
      (txObj,resultSet)=>{  
        if(year===new Date().getFullYear()&&month===months[new Date().getMonth()]){
        budget[`${direction}Sum`]-=budget[direction][category].transactions[i].value
        budget[direction][category].value-=budget[direction][category].transactions[i].value
        budget[`${direction}${budget[direction][category].transactions[i].payInstrument}Sum`]-=budget[direction][category].transactions[i].value
        budget[direction][category][`${budget[direction][category].transactions[i].payInstrument}value`]-=budget[direction][category].transactions[i].value
        budget[direction][category].transactions.splice(i,1)
        updateBudget() 
        let nR={c:refresh.c+1}
        setRefresh(nR)
      }
      else{
      let b=JSON.parse(resultSet.rows._array[0][month])
      b[`${direction}Sum`]-=b[direction][category].transactions[i].value
      b[direction][category].value-=b[direction][category].transactions[i].value
      b[`${direction}${b[direction][category].transactions[i].payInstrument}Sum`]-=b[direction][category].transactions[i].value
      b[direction][category][`${b[direction][category].transactions[i].payInstrument}value`]-=b[direction][category].transactions[i].value
      b[direction][category].transactions.splice(category,1)
      b.sum=b.incomesSum-b.spendingsSum
      tx.executeSql(
        `UPDATE budget SET ${month}=?`,[JSON.stringify(b)],
        (txObj,resultSet)=>{
          let nR={c:refresh.c+1}
          setRefresh(nR)
    }
      )
      
      }
  })
  })
}
function deleteCategory(year,month,direction,category){
db.transaction(tx=>{
  tx.executeSql(
    `SELECT ${month} FROM budget WHERE year=?`,[year],
    (txObj,resultSet)=>{  
      if(year===new Date().getFullYear()&&month===months[new Date().getMonth()]){
      budget[`${direction}Sum`]-=budget[direction][category].value
      budget[`${direction}cardSum`]-=budget[direction][category].cardvalue
      budget[`${direction}cashSum`]-=budget[direction][category].cashvalue
      budget[`${direction}cryptoSum`]-=budget[direction][category].cryptovalue
      budget[direction].splice(category,1)
      template[direction].splice(category,1)
      updateBudget()
      updateTemplate()
      
    }
   else{
    let b=JSON.parse(resultSet.rows._array[0][month])
    b[`${direction}Sum`]-=b[direction][category].value
    b[`${direction}cardSum`]-=b[direction][category].cardvalue
    b[`${direction}cashSum`]-=b[direction][category].cashvalue
    b[`${direction}cryptoSum`]-=b[direction][category].cryptovalue
    b[direction].splice(category,1)
    b.sum=b.incomesSum-b.spendingsSum
    tx.executeSql(
      `UPDATE budget SET ${month}=?`,[JSON.stringify(b)],
      (txObj,resultSet)=>{
        let nR={c:refresh.c+1}
        setRefresh(nR)
      }
    )
    }
})
})

}
function updateTemplate(){
  setTemplate(getCopyBudget(template))
db.transaction(tx=>{
  tx.executeSql(
    'UPDATE budget SET current=?',[JSON.stringify(template)],
    (txObj,resultSet)=>{}
  )
})
}
function db_updateRecord(column, value){
  db.transaction(tx=>{
    tx.executeSql(
      `UPDATE budget SET ${column}=?`,[value],
      (txObj, resultSet)=>{}
    )
  })
}

function db_setStates(){
db.transaction(tx=>{
  tx.executeSql(
    'SELECT currency FROM budget',null,(txObj, resultSet)=>{
    if(resultSet.rows._array[0].currency){
        setCurrency(resultSet.rows._array[0].currency)}},
  )
})
db.transaction(tx=>{
  tx.executeSql(
    `SELECT ${months[new Date().getMonth()]} FROM budget WHERE year=?`,[new Date().getFullYear()],(txObj, resultSet)=>{
      if(resultSet.rows._array.length===0){
        tx.executeSql(
          `INSERT INTO budget (year,${months[new Date().getMonth()]}) VALUES (?,?)`,[new Date().getFullYear(),JSON.stringify(template)],
          (txObj, resultSet)=>{setBudget(JSON.parse(JSON.stringify(template)))}
        )
      }
      else if(!resultSet.rows._array[0][`${months[new Date().getMonth()]}`]){
        tx.executeSql(
          `INSERT INTO budget (${months[new Date().getMonth()]}) VALUES(?) WHERE year=?`,[JSON.stringify(template),new Date().getFullYear()],
          (txObj,resultSet)=>{
            setBudget(JSON.parse(JSON.stringify(template)))
          }
        )
      }
      else if(resultSet.rows._array[0][`${months[new Date().getMonth()]}`]){
         setBudget(JSON.parse(resultSet.rows._array[0][`${months[new Date().getMonth()]}`]))
      }
      
    }
  )
})
db.transaction(tx=>{
  tx.executeSql(
    'SELECT current FROM budget',null,(txObj, resultSet)=>{
      if(resultSet.rows._array[0].current){
        setTemplate(JSON.parse(resultSet.rows._array[0].current))
      }
    }
  )
})
db.transaction(tx=>{
  tx.executeSql(
    'SELECT language FROM budget',null,(txObj, resultSet)=>{
      if(resultSet.rows._array[0].language){

        setLanguage(resultSet.rows._array[0].language)
      }
    }
  )
})
}

  useEffect(()=>{
  // db.closeAsync()
  // db.deleteAsync()
db_createTable()
db_setStates() 
},[])
    return (
        <NavigationContainer>
            <Tab.Navigator  
            screenOptions={{
                headerShown:false,
                tabBarStyle:FooterStyle.background, 
                tabBarStyle:{
                borderTopWidth:0,
                elevation:0,
                position:'absolute',
                backgroundColor:'#131313',
                borderTopEndRadius:90,
                borderTopStartRadius:90,
            }
            }}
            >
              
                <Tab.Screen name="home_page" children={()=><HomePage 
                currency={currency} 
                budget={budget} 
                updateBudget={updateBudget}
                addTransaction={addTransaction}
                template={template}
                updateTemplate={updateTemplate}
                deleteCategory={deleteCategory}
                language={language}
                colorTheme={colorTheme}
                />}
                  options={{
                    tabBarItemStyle:FooterStyle.button,
                    tabBarShowLabel:false,
                    tabBarIcon:()=>(
                        <Image style={FooterStyle.image} source={require('../assets/house.png')}/>
                    ),
                  }}/>
                <Tab.Screen name='analytics_page' children={()=><AnalyticsPage 
                budget={budget} 
                currency={currency}
                db={db}
                deleteCategory={deleteCategory}
                refresh={refresh}
                setRefresh={setRefresh}
                language={language}
                colorTheme={colorTheme}
                />}
                  options={{
                    tabBarItemStyle:FooterStyle.button,
                    tabBarShowLabel:false,
                    tabBarIcon:()=>(
                     <Image style={FooterStyle.image} source={require('../assets/analytics.png')}/>
                    )
                  }}/>
                <Tab.Screen name="transactions_page" children={()=><TransactionPage 
                budget={budget} 
                currency={currency}
                db={db}
                deleteTransaction={deleteTransaction}
                refresh={refresh}
                setRefresh={setRefresh}
                language={language}
                colorTheme={colorTheme}
                />}
                options={{
                  tabBarItemStyle:FooterStyle.button,
                  tabBarShowLabel:false,
                  tabBarIcon:()=>(
                   <Image style={FooterStyle.image} source={require('../assets/transactions.png')}/>
                  )
                  }}/>
                <Tab.Screen name='setting_page' children={()=><SettingPage 
                currency={currency}
                setCurrency={setCurrency}
                db_updateRecord={db_updateRecord}
                setLanguage={setLanguage}
                language={language}
                colorTheme={colorTheme}
                />}
                  options={{
                    tabBarItemStyle:FooterStyle.button,
                    tabBarShowLabel:false,
                    tabBarIcon:()=>(
                     <Image style={FooterStyle.image} source={require('../assets/setting.png')}/>
                    )
                  }}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}
