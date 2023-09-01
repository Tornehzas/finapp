export class Category{
    categoryName;
    value;
    color;
    transactions;
    cardvalue;
    cashvalue;
    cryptovalue
    constructor(name){
        this.categoryName=name
        this.value=0
        this.cardvalue=0
        this.cashvalue=0
        this.cryptovalue=0
        this.color="grey"
        this.transactions=[]
    }
}