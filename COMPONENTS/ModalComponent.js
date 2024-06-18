
import { height, width } from "deprecated-react-native-prop-types/DeprecatedImagePropType";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Pressable, ScrollView } from "react-native";
import { View,Text } from "react-native";
import { TextInput } from "react-native";
import  { ReactNativeModal } from "react-native-modal";
import {CalendarComponent}  from "./CalendarComponent";
import { Transaction } from "../LOGIC/Transaction";
import { calendar } from "../LOGIC/Calendar";
import { months } from "../LOGIC/Calendar";
import { sizes } from "../PAGES/styles";
import { lang } from "../PAGES/languages";
export function ModalComponent({language,budget,modalActive,selectedDirection,selectedPayInstrument,addTransaction}){
  const [selectedYear, setSelectedYear]=useState(2006)
  const [selectedMonth, setSelectedMonth]=useState(0)
  const [selectedDay, setSelectedDay]=useState(1)
  const [modalSpendingsSelectedCategory, setModalSpendingsSelectedCategory]=useState(0)
  const [modalIncomesSelectedCategory, setModalIncomesSelectedCategory]=useState(0)
   return(
    <ReactNativeModal
    animationIn={'fadeIn'}
    animationOut={'fadeOut'}
    hasBackdrop={false}
    coverScreen={false}
    isVisible={modalActive}
    onModalHide={()=>{
      setModalSpendingsSelectedCategory(0)
      setModalIncomesSelectedCategory(0)
    }}
    style={{
      position:'absolute',
      marginLeft:0,
      alignItems:'center',
      width:sizes.fullWidth,
      height:sizes.fullHeight*0.6,
      alignSelf:'flex-start'
    }}
    >
    <View   
style={{
        marginTop:0,
        display:'flex',
        width:sizes.fullWidth,
        height:sizes.fullHeight*0.6,
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#112D41',
        padding:sizes.fullWidth*0.02,
    }}>

<LinearGradient 
      colors={['#02AAB0','#00cdac']}
      locations={[
        0.5, 0.8
      ]}
      start={{x:0,y:0.2}}
      end={{x:1,y:1}}
      style={{
        display:'flex',
        alignItems:'center',
        borderRadius:10,
        position:'absolute',
        marginTop:'5%',
        width:sizes.fullWidth*0.89,
        height:sizes.fullHeight*0.3,
    }}
      >
<CalendarComponent
selectedYear={selectedYear}
setSelectedYear={setSelectedYear}
selectedMonth={selectedMonth}
setSelectedMonth={setSelectedMonth}
selectedDay={selectedDay}
setSelectedDay={setSelectedDay}
language={language}
/>
  </LinearGradient>

<LinearGradient 
      colors={['#02AAB0','#00cdac']}
      locations={[
        0.5, 0.8
      ]}
      start={{x:0,y:0.2}}
      end={{x:1,y:1}}
      style={{
        width:sizes.fullWidth*0.89, 
        height:sizes.fullHeight*0.05,
        display:'flex',
        alignItems:'center',
        borderRadius:10,
        marginTop:sizes.fullHeight*0.35,
        position:'absolute',
    }}
      >
      <ScrollView
            onSnapToItem={(i)=>{
             selectedDirection==='spendings'?setModalSpendingsSelectedCategory(i):setModalIncomesSelectedCategory(i)
          } 
          }
          onScrollEndDrag={(e)=>{
              selectedDirection==='spendings'?setModalSpendingsSelectedCategory(Math.round(e.nativeEvent.contentOffset.y/70)):setModalIncomesSelectedCategory(Math.round(e.nativeEvent.contentOffset.y/70))
          }
      }
      contentContainerStyle={{
        flexGrow:1,
        alignItems:'center',
        justifyContent:'center'
      }}
      overScrollMode="never"
      pagingEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{
        height:sizes.fullHeight*0.05,
        width:'100%',
        borderRadius:10,
      }}
      >
         {budget[`${selectedDirection}`].map((el,index)=>{
          return(
        <Text 
            style={{color:'white',width:'100%',height:sizes.fullHeight*0.05,textAlign:'center',fontSize:20/sizes.fontScale}}
            key={index}>{el.categoryName}</Text>
          )
         })}
      </ScrollView> 
</LinearGradient>

<LinearGradient 
      colors={['#02AAB0','#00cdac']}
      locations={[
        0.5, 0.8
      ]}
      start={{x:0,y:0.2}}
      end={{x:1,y:1}}
      style={{
        width:sizes.fullWidth*0.89, 
        height:sizes.fullHeight*0.05,
        display:'flex',
        alignItems:'center',
        borderRadius:10,
        marginTop:sizes.fullHeight*0.42,
        position:'absolute',
    }}
      >
      <TextInput 
      ref={(input)=>{this.textInput=input}}
      onChangeText={(text)=>{
        if(isNaN(Number(text.replace(/\s/g,'')))||(text[0]==='0'&&text[1]!=='.')){this.dataA=0}
        else this.dataA=Number(text.replace(/\s/g,''))
      }}
      dataA={0}
      keyboardType="numeric"
      placeholder="value"
      fontSize={20/sizes.fontScale}
      onSubmitEditing={()=>{
        let newV=Number(this.dataA.toFixed(2))
        if(selectedDirection==='spendings'&&newV>0){
        addTransaction(selectedDay,selectedMonth+1,selectedYear,selectedDirection,modalSpendingsSelectedCategory,newV,selectedPayInstrument)
        }
        else if(selectedDirection==='incomes'&&newV>0){
        addTransaction(selectedDay,selectedMonth+1,selectedYear,selectedDirection,modalIncomesSelectedCategory,newV,selectedPayInstrument)      
        }
        
        this.dataA=0
        this.textInput.clear()
      }}
      style={{
        color:'white',
        width:'100%',
        height:sizes.fullHeight*0.05,
        borderRadius:10,
        textAlign:'center',
        position:'absolute',
        marginTop:0,
      }}
      ></TextInput>
</LinearGradient>  

    </View>
    </ReactNativeModal>
   )
}