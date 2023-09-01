import { Category } from "./Category"

export class Budget{
    spendings
    incomes
    spendingsSum
    spendingscardSum
    spendingscashSum
    spendingscryptoSum
    incomesSum
    incomescardSum
    incomescashSum
    incomescryptoSum
    sum;
    savings;
    constructor(){
        this.spendings=[]
        this.incomes=[]
        this.spendingsSum=0
        this.spendingscardSum=0
    this.spendingscashSum=0
    this.spendingscryptoSum=0
        this.incomesSum=0
        this.incomescardSum=0
        this.incomescashSum=0
        this.incomescryptoSum=0
        this.sum=0
    }
}
export function getCopyBudget(budget){
        const newBudget=new Budget()
        newBudget.spendings=budget.spendings
        newBudget.spendingsSum=budget.spendingsSum
        newBudget.spendingscardSum=budget.spendingscardSum
        newBudget.spendingscashSum=budget.spendingscashSum
        newBudget.spendingscryptoSum=budget.spendingscryptoSum
        newBudget.incomes=budget.incomes
        newBudget.incomesSum=budget.incomesSum
        newBudget.incomescardSum=budget.incomescardSum
        newBudget.incomescashSum=budget.incomescashSum
        newBudget.incomescryptoSum=budget.incomescryptoSum
        newBudget.sum=budget.sum
        return newBudget
    }
export function addCategoryTo(budget, direction, categoryName){
        budget[direction].push(new Category(categoryName))
    }