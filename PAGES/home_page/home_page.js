import {  Button, FlatList, Modal, ScrollView, TextInput, View } from "react-native";
import {  Text } from "react-native";
import { HomePageStyle } from "./home_page_style";
import {LinearGradient} from 'expo-linear-gradient'
import React, { lazy, useEffect, useState,useLayoutEffect } from "react";
import {Budget, addCategoryTo, getCopyBudget} from "../../LOGIC/Budget";
import Carousel from "react-native-snap-carousel";
import {  Image } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { payments } from "../../LOGIC/Payments";
import { Dimensions } from "react-native";
import { Pressable } from "react-native";
import { ModalComponent } from "../../COMPONENTS/ModalComponent";
import { Transaction } from "../../LOGIC/Transaction";
import { Alert } from "react-native";
import { openDatabase } from "react-native-sqlite-storage";
import * as SQLite from 'expo-sqlite'
import { PieChart } from "react-native-chart-kit-with-pressable-bar-graph";
import { months } from "../../LOGIC/Calendar";
import { onPress } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";
import { Prompt } from "../../COMPONENTS/Prompt";
import { Category } from "../../LOGIC/Category";
import { sizes } from "../styles";
import { lang } from "../languages";
export function HomePage({language,currency,budget,updateBudget,addTransaction,template,updateTemplate,deleteCategory}){

useEffect(()=>{
{/*setData('budget',setBudget)*/}
},[])
const [modalActive,setModalActive]=useState(false)
const [promptActive,setPromptActive]=useState(false)
const [selectedDirection,setSelectedDirection]=useState('spendings')
const [spendingsSelectedCategory,setSpendingsSelectedCategory]=useState(0)
const [incomesSelectedCategory,setIncomesSelectedCategory]=useState(0)
const [selectedPayInstrument, setSelectedPayInstrument]=useState(0)

const showConfirmDialog = (category) => {
  return Alert.alert(
    "",
    lang[language].deleteConfirm,
    [
      {
        text: lang[language].yes,
        onPress: () => {
            if (selectedDirection==='spendings'){
              deleteCategory(new Date().getFullYear(),months[new Date().getMonth()],'spendings',spendingsSelectedCategory)
            }
            else{
              deleteCategory(new Date().getFullYear(),months[new Date().getMonth()],'incomes',incomesSelectedCategory,)
            } 
        },
      },
      {
        text: lang[language].no,
      },
    ]
  );
}
function renderPayInstrument({item}){
    return(
    <GestureRecognizer
    onSwipeUp={()=>{
     setModalActive(true)
    }}
    onSwipeDown={()=>{
        setModalActive(false)
    }}
    style={{
      width:sizes.fullWidth*0.55,
      alignSelf:'center'
    }}
    ><Image id={`${item.name}`} style={{
          width:sizes.fullWidth*0.5, 
          height:sizes.fullWidth*0.5,
          display:'flex', 
          alignSelf:'center',
        }} source={item.img}></Image>
        </GestureRecognizer>
    )
}
function renderHomeTopPages({index}){
        return(
         <View 
         style={{
            marginTop:sizes.fullHeight*0.005,
            width:sizes.fullWidth,
            height:sizes.fullHeight*0.43,
         }}
         >   
            <Text
            style={{
                fontSize:20,
                width:sizes.fullWidth,
                height:sizes.fullHeight*0.03,
                textAlign:'center',
            }}
            >{index===0?lang[language].spendings:lang[language].incomes}</Text>
            <PieChart
              hasLegend={false}
        data={index===0?budget.spendings:budget.incomes}
           accessor="value" 
            width={sizes.fullWidth*0.65}
            height={sizes.fullWidth*0.65}
            fromZero={true}
           avoidFalseZero={true}
           style={{
            marginTop:sizes.fullHeight*0.01,
            alignSelf:'center',
            backgroundColor:"grey",
            borderRadius:1000,
           }}
        chartConfig={{
            color:(opacity=1)=>`rgba(25,25,25,${opacity})`,
        }}
           />
        <ScrollView
        onSnapToItem={(i)=>{
            if(selectedDirection==='spendings'&&budget.spendings[i]){
                budget[selectedDirection][spendingsSelectedCategory].color='grey'
                budget[selectedDirection][i].color='lime'
                setSpendingsSelectedCategory(i)
                updateBudget()
            }
            else if (selectedDirection==='incomes'&&budget.incomes[i]) {
                budget[selectedDirection][incomesSelectedCategory].color='grey'
                budget[selectedDirection][i].color='lime'
                setIncomesSelectedCategory(i)
                updateBudget()
            }
        } 
        }
        onScrollEndDrag={(e)=>{
        if(selectedDirection==='spendings'&&budget.spendings[Math.round(e.nativeEvent.contentOffset.y/70)]){
            budget[selectedDirection][spendingsSelectedCategory].color='grey'
            budget[selectedDirection][Math.round(e.nativeEvent.contentOffset.y/70)].color='lime'
            setSpendingsSelectedCategory(Math.round(e.nativeEvent.contentOffset.y/70))
            updateBudget()
        }
        else if (selectedDirection==='incomes'&&budget.incomes[Math.round(e.nativeEvent.contentOffset.y/70)]){
            budget[selectedDirection][incomesSelectedCategory].color='grey'
            budget[selectedDirection][Math.round(e.nativeEvent.contentOffset.y/70)].color='lime'
            setIncomesSelectedCategory(Math.round(e.nativeEvent.contentOffset.y/70))
            updateBudget()
        }
    }}
        bounces={false}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        overScrollMode="never"
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
         contentContainerStyle={{
            alignItems:'center'
         }}
           >
             {budget[`${index===0?'spendings':'incomes'}`].map((item,i)=>{
return(
    <View   key={i} 
    style={{
                zIndex:1,
                display:"flex",
                height:sizes.fullHeight*0.09,
                width:sizes.fullWidth,
                backgroundColor:'transparent',
                alignItems:'center',
              }}>     
      <Pressable
      style={{
        height:sizes.fullHeight*0.09,
        backgroundColor:'transparent',
        width:sizes.fullWidth,
        alignItems:'center',
    }}
      onLongPress={()=>{
        showConfirmDialog(item)
      }}
      >
         <Text style={{
            color:'white',
            textAlign:'center',
            lineHeight:sizes.fullHeight*0.039,
            fontSize:25,
            height:sizes.fullHeight*0.09,
            width:sizes.fullWidth,
            }}>
              {item.categoryName}{"\n"}{String(item?.value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{currency}
              </Text>
         </Pressable>
    </View>
        ) 
             })}    
             <Pressable
             onPress={()=>{
                setPromptActive(true)
            }}
             style={{
                height:sizes.fullHeight*0.09,
                alignItems:'center',
                width:sizes.fullWidth
             }} 
><Text style={{
  fontSize:30,
  textAlign:'center',
  height:sizes.fullHeight*0.09,
  }}>{lang[language].add}
  </Text>
             </Pressable>
        </ScrollView>
           </View>
        )
}

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

        <Text style={HomePageStyle.header}>{lang[language].budget} {String(budget.sum.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")||0}{currency}</Text>
        
        
        <ModalComponent
        budget={budget}
        modalActive={modalActive}
        setModalActive={setModalActive}
        selectedDirection={selectedDirection}
        selectedPayInstrument={selectedPayInstrument}
        addTransaction={addTransaction}
        language={language}
        />

        <Carousel
        pagingEnabled={true}
        data={[1,2]}
        renderItem={renderHomeTopPages}
        itemWidth={sizes.fullWidth}
        sliderWidth={sizes.fullWidth}
        sliderHeight={sizes.fullHeight*0.43}
        inactiveSlideOpacity={0}
        separatorWidth={0}
        onSnapToItem={(i)=>{
            if(i===0){setSelectedDirection('spendings')}
            if(i===1){setSelectedDirection('incomes')}
            }}
        onScrollEndDrag={(e)=>{
            if(Math.round(e.nativeEvent.contentOffset.x/400)===0){setSelectedDirection('spendings')}
            if(Math.round(e.nativeEvent.contentOffset.x/400)===1){setSelectedDirection('incomes')}
            }}
            contentContainerStyle={{
                alignItems:'center',
            }}
        />
   
<Prompt
promptActive={promptActive}
setPromptActive={setPromptActive}
selectedDirection={selectedDirection}
spendingsSelectedCategory={spendingsSelectedCategory}
incomesSelectedCategory={incomesSelectedCategory}
setIncomesSelectedCategory={setIncomesSelectedCategory}
setSpendingsSelectedCategory={setSpendingsSelectedCategory}
budget={budget}
updateBudget={updateBudget}
template={template}
updateTemplate={updateTemplate}
language={language}
/>
       
        <TextInput
              ref={(input)=>{this.TextInput=input}}
              clearButtonMode="always"
              onChangeText={(text)=>{
                this.data=Number(text.replace(/\s/g,''))
              }}
              data={0}
              keyboardType="numeric"
              placeholder={lang[language].value}
              fontSize={25}
              onSubmitEditing={()=>{
                let newV=Number(Number(this.data).toFixed(2))
                if(selectedDirection==="spendings"&&budget.spendings[spendingsSelectedCategory]&&newV>0){
                addTransaction(new Date().getDate(),new Date().getMonth()+1,new Date().getFullYear(),selectedDirection,spendingsSelectedCategory,newV,selectedPayInstrument)
                budget[selectedDirection][spendingsSelectedCategory].color='lime'
                }
                else if(selectedDirection==='incomes'&&budget.incomes[incomesSelectedCategory]&&newV>0){
                addTransaction(new Date().getDate(),Date().getMonth()+1,new Date().getFullYear(),selectedDirection,incomesSelectedCategory,newV,selectedPayInstrument)
                budget[selectedDirection][incomesSelectedCategory].color='lime'
                }
                this.data=0
                this.TextInput.clear()
              }}
              style={{
                backgroundColor:'transparent',
                width:sizes.fullWidth,
                height:sizes.fullHeight*0.05,
                marginTop:sizes.fullHeight*0.55,
                textAlign:'center',
                position:'absolute'
              }}
        >
        </TextInput>

       

        <Carousel
        enableSnap={true}
        data={payments}
        onScrollEndDrag={(e)=>{setSelectedPayInstrument(Math.round(e.nativeEvent.contentOffset.x/200))}}
        onSnapToItem={(i)=>{setSelectedPayInstrument(i)}}
           renderItem={renderPayInstrument}
           itemWidth={sizes.fullWidth*0.55}
           separatorWidth={0}
           sliderWidth={sizes.fullWidth}
           inactiveSlideOpacity={0}
           containerCustomStyle={{
                marginTop:sizes.fullHeight*0.63,
                position:'absolute',
        }}
        contentContainerStyle={{alignItems:'center'}}
        />
            </LinearGradient>
        </View>
    )
}