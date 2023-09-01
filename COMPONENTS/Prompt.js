import { Button, Pressable, TextInput, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import { addCategoryTo } from "../LOGIC/Budget";
import { Category } from "../LOGIC/Category";
import { sizes } from "../PAGES/styles";

export  function Prompt({language,budget,promptActive,setPromptActive,selectedDirection,spendingsSelectedCategory,incomesSelectedCategory,setIncomesSelectedCategory,setSpendingsSelectedCategory,updateBudget,template,updateTemplate}){
    return (
        <ReactNativeModal
    animationIn={'fadeIn'}
    animationOut={'fadeOut'}
    hasBackdrop={false}
    coverScreen={false}
    isVisible={promptActive}
    style={{
        alignItems:'center',
        width:sizes.fullWidth*0.96,
        height:sizes.fullHeight*0.08,
        display:'flex',
        alignSelf:'center',
        position:'absolute',
        marginTop:sizes.fullHeight*0.41
      }}
        >
   <LinearGradient 
      colors={['#02AAB0','#00cdac']}
      locations={[
        0.5, 0.8
      ]}
      start={{x:0,y:0.2}}
      end={{x:1,y:1}}
      style={{
        width:sizes.fullWidth*0.96, 
        height:sizes.fullHeight*0.08,
        display:'flex',
        alignItems:'center',
        borderRadius:10,
        alignSelf:"center"
    }}
      >
   <View
   style={{height:sizes.fullHeight*0.08,width:sizes.fullWidth*0.96,position:"absolute",alignItems:"center"}}
   >
    <Pressable 
    onPress={()=>{setPromptActive(false)}}
    style={{height:sizes.fullHeight*0.04,width:sizes.fullWidth*0.1,backgroundColor:'#132D48',borderRadius:10, justifyContent:'center',alignItems:"center"}}>
<Text>X</Text>
    </Pressable>
   </View>
      <TextInput 
      data
      style={{width:sizes.fullWidth*0.89,height:sizes.fullHeight*0.04,fontSize:25,marginTop:sizes.fullHeight*0.04,textAlign:'center'}}
      onChangeText={(text)=>{this.data=text}}
      onSubmitEditing={()=>{
              setPromptActive(false)
              let t=JSON.parse(JSON.stringify(template))
              addCategoryTo(budget,selectedDirection,this.data)
              addCategoryTo(template,selectedDirection,this.data)
              updateBudget()
              updateTemplate()
                if(selectedDirection==='spendings'){
                    budget[selectedDirection][spendingsSelectedCategory].color='grey'
                    setSpendingsSelectedCategory(budget.spendings.length-1)
                }
                if(selectedDirection==='incomes'){
                    budget[selectedDirection][incomesSelectedCategory].color='grey'
                    setIncomesSelectedCategory(budget.incomes.length-1)
               }
      }}
      ></TextInput>
</LinearGradient>

        </ReactNativeModal>
    )
}