import { payments } from "./Payments";

export class Transaction{
    date={};
    value;
    payInstrument;
    constructor(day,month,year,value,payInstrument){
        this.date.month=month
        this.date.day=day
        this.date.year=year
        this.value=value;
        this.payInstrument=payments[payInstrument].name
    }
}