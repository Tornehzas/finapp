export const payments=[
{
name:'card',
img:require('../assets/card.png')
},
{
name:'cash',
img:{
    ['\u0024']:require('../assets/cashDollar.png'),
    ['\u00A3']:require('../assets/cashPound.png'),
    ['\u20AC']:require('../assets/cashEuro.png'),
    ['\u20BD']:require('../assets/cashRouble.png'),
    ['\u00A5']:require('../assets/cashYuan.png'),
    ['\u20A3']:require('../assets/cashFrank.png')
}

},
{
name:"crypto",
img:require('../assets/crypto.png')
}

]