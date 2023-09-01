import { View, Text, TextInput, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HomePageStyle } from "../home_page/home_page_style";
import { sizes } from "../styles";
import { lang } from "../languages";
export function SettingPage({language, setCurrency, db_updateRecord, setLanguage}){
const currencies=['\u0024','\u00A3','\u20AC','\u20BD','\u00A5','\u20A3']
const languages=['English', 'Русский', 'Español']
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
                <Text style={HomePageStyle.header}>{lang[language].settings}</Text>
                <View 
                style={{
                  marginTop:sizes.fullHeight*0.005,
                  width:sizes.fullWidth,
                  height:sizes.fullHeight,
                    }}>
            <Text style={{height:sizes.fullHeight*0.05, fontSize:30, textAlign:'center'}}>{lang[language].currency}</Text>
              <View style={{
                 width:sizes.fullWidth,
                 height:sizes.fullHeight*0.07,
              }}>
                <ScrollView
              onScrollEndDrag={(e)=>{
               setCurrency(currencies[Math.round(e.nativeEvent.contentOffset.y/60)])
               db_updateRecord('currency', currencies[Math.round(e.nativeEvent.contentOffset.y/60)])
              }}
              onSnapToItem={(i)=>{
                setCurrency(currencies[i])
                db_updateRecord('currency', currencies[i])
              }}
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              pagingEnabled={true}
              style={{
                width:sizes.fullWidth,
                height:sizes.fullHeight*0.07,
              }}
              contentContainerStyle={{
                alignItems:'center',
              }}
              >
                {
                    currencies.map((item,i)=>{
                        return(
                           <Text key={i} style={{height:sizes.fullHeight*0.07, fontSize:40, textAlign:'center'}}>{item}</Text> 
                        )
                    })
                }
              </ScrollView>
              </View>

              <Text style={{height:sizes.fullHeight*0.07, fontSize:30, textAlign:'center'}}>{lang[language].language}</Text>
              <View style={{
width:sizes.fullWidth,
height:sizes.fullHeight*0.07,
              }}>
              <ScrollView
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              pagingEnabled={true}
              onScrollEndDrag={(e)=>{
                setLanguage(languages[Math.round(e.nativeEvent.contentOffset.y/60)])
                db_updateRecord('language', languages[Math.round(e.nativeEvent.contentOffset.y/60)])
               }}
               onSnapToItem={(i)=>{
                 setLanguage(languages[i])
                 db_updateRecord('language', languages[i])
               }}
              style={{
                width:sizes.fullWidth,
                height:sizes.fullHeight*0.07,
              }}
              contentContainerStyle={{
                alignItems:'center',
              
              }}
              >
                {
                    languages.map((item,i)=>{
                        return(
                           <Text key={i} style={{height:sizes.fullHeight*0.07, fontSize:35, textAlign:'center'}}>{item}</Text> 
                        )
                    })
                }
                

              </ScrollView>
                </View>
              </View>
            </LinearGradient>
</View>
    )
}