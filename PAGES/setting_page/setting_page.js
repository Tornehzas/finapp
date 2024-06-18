import { View, Text, TextInput, ScrollView,StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HomePageStyle } from "../home_page/home_page_style";
import { sizes } from "../styles";
import { lang } from "../languages";




export function SettingPage({colorTheme,language, setCurrency, db_updateRecord, setLanguage, currency}){
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
              <StatusBar style={colorTheme}/>
                <Text style={HomePageStyle.header}>{lang[language].settings}</Text>
                <View 
                style={{
                  marginTop:sizes.fullHeight*0.005,
                  width:sizes.fullWidth,
                  height:sizes.fullHeight,
                    }}>
            <Text style={{color:"white",height:sizes.fullHeight*0.05, fontSize:23/sizes.fontScale, textAlign:'center'}}>{lang[language].currency}</Text>
              <View style={{
                 width:sizes.fullWidth,
                 height:sizes.fullHeight*0.07,
              }}>
                <ScrollView
              contentOffset={{x:0,y:sizes.fullHeight*0.07*currencies.findIndex(v=>v===currency.toLocaleString())}}
              onScrollEndDrag={(e)=>{
               setCurrency(currencies[Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.07))])
               db_updateRecord('currency', currencies[Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.07))])
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
                           <Text key={i} style={{color:"white",height:sizes.fullHeight*0.07, fontSize:25, textAlign:'center'}}>{item}</Text> 
                        )
                    })
                }
              </ScrollView>
              </View>

              <Text style={{color:"white",height:sizes.fullHeight*0.07, fontSize:23/sizes.fontScale, textAlign:'center'}}>{lang[language].language}</Text>
              <View style={{
width:sizes.fullWidth,
height:sizes.fullHeight*0.07,
              }}>
              <ScrollView
              contentOffset={{x:0,y:sizes.fullHeight*0.07*languages.findIndex(v=>v===language)}}
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              pagingEnabled={true}
              onScrollEndDrag={(e)=>{
                setLanguage(languages[Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.07))])
                db_updateRecord('language', languages[Math.round(e.nativeEvent.contentOffset.y/(sizes.fullHeight*0.07))])
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
                           <Text key={i} style={{color:"white",height:sizes.fullHeight*0.07, fontSize:25/sizes.fontScale, textAlign:'center'}}>{item}</Text> 
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