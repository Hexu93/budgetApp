class UI //Luokan kanssa on helpompi työskennellä
{
    constructor() 
    {
      this.budgetFeedback = document.querySelector(".budget-feedback");
      this.expenseFeedback = document.querySelector(".expense-feedback");
      this.budgetForm = document.getElementById("budget-form");
      this.budgetInput = document.getElementById("budget-input");
      this.budgetAmount = document.getElementById("budget-amount");
      this.expenseAmount = document.getElementById("expense-amount");
      this.balance = document.getElementById("balance");
      this.balanceAmount = document.getElementById("balance-amount");
      this.expenseForm = document.getElementById("expense-form");
      this.expenseInput = document.getElementById("expense-input");
      this.amountInput = document.getElementById("amount-input");
      this.expenseList = document.getElementById("expense-list");
      this.itemList = [];
      this.itemID = 0;
    }

    //Submit budget
    submitBudgetForm()
    {
        const value = this.budgetInput.value;
        if(value === '' || value < 0)
        {
            this.budgetFeedback.classList.add('showItem');
            this.budgetFeedback.innerHTML = `<p>Value cannot be empty or negative </p>`;

            //This lets the timeout timer to use 'this' argument from the constructor
            const self = this;
            setTimeout(() =>
            {
                self.budgetFeedback.classList.remove('showItem');
            }, 4000);
        }
        else
        {
            this.budgetAmount.textContent = value;
            this.budgetInput.value = '';
            this.showBalance();
        }
    }

    //Show balance
    showBalance()
    {
        const expense = this.totalExpense();
        const total = parseInt(this.budgetAmount.textContent) - expense;
        this.balanceAmount.textContent = total;
        if(total < 0)
        {
            this.balance.classList.remove('showGreen', 'showBlack');
            this.balance.classList.add('showRed');
        }

        else if (total > 0)
        {
            this.balance.classList.remove('showRed', 'showBlack');
            this.balance.classList.add('showGreen');
        }

        else if (total === 0)
        {
            this.balance.classList.remove('showRed', 'showGreen');
            this.balance.classList.add('showBlack');
        }
    }

    //Submit expenses
    submitExpenseForm()
    {
        const expenseValue = this.expenseInput.value;
        const amountValue  = this.amountInput.value;

        if (expenseValue === '' || amountValue === '' || amountValue < 0)
        {
            this.expenseFeedback.classList.add('showItem');
            this.expenseFeedback.innerHTML = `<p>Values cannot be empty or negative</p>`;
            const self = this;
            setTimeout(() => {
                self.expenseFeedback.classList.remove('showItem');
            },4000);
        }

        else
        {
            let amount = parseInt(amountValue);
            this.expenseInput.value = '';
            this.amountInput.value = '';

            let expense = {
                id: this.itemID,
                title: this.expenseValue,
                amount,
            }
            this.itemID++;
            this.itemList.push(expense);

            this.addExpense(expense);
            this.showBalance();
            
        }
    }

    //Add expense
    addExpense(expense)
    {
        const div = document.createElement('div');
        div.classList.add('expense');
        div.innerHTML = `
        <div class="expense-item d-flex justify-content-between align-items-baseline">

        <h6 class="expense-title mb-0 text-uppercase list-item">${expense.title}</h6>
        <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

        <div class="expense-icons list-item">

         <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
          <i class="fas fa-edit"></i>
         </a>
         <a href="#" class="delete-icon" data-id="${expense.id}">
          <i class="fas fa-trash"></i>
         </a>
        </div>
       </div>`;

       this.expenseList.appendChild(div);
    }


    //Total expense
    totalExpense()
    {
        const total = 0;

        if(this.itemList.length > 0)
        {
            const total = this.itemList.reduce((acc,expense) => acc += expense.amount, 0);
            return total;
        }
        this.expenseAmount.textContent = total;
        return total;
    }

    editExpense(element)
    {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement.parentElement;

        //Remove from DOM
        this.expenseList.removeChild(parent);

        let expense = this.itemList.filter((item) =>
        {
            return item.id === id;
        });

        this.expenseInput.value = expense[0].title;
        this.amountInput.value = expense[0].amount;

        let templist = this.itemList.filter(function(item)
        {
            return item.id !== id;
        });

        this.itemList = templist;
        this.showBalance();
    }

    deleteExpense(element)
    {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement.parentElement;

        //Remove from DOM
        this.expenseList.removeChild(parent);

        let templist = this.itemList.filter(function(item)
        {
            return item.id !== id;
        });

        this.itemList = templist;
        this.showBalance();

    }
}

function eventListners()
{
    const budgetForm = document.getElementById('budget-form');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');

    //Päivitetään UI
    const ui = new UI();
    
    budgetForm.addEventListener('submit', function(event)
    {
       event.preventDefault();
       ui.submitBudgetForm();
    });
    
    //submit list
    expenseForm.addEventListener('submit', function(event)
    {
        event.preventDefault()
        ui.submitExpenseForm();
    });

    //click list
    expenseList.addEventListener('click', function(event)
    {
        if(event.target.parentElement.classList.contains('edit-icon'))
        {
            ui.editExpense(event.target.parentElement);
        }
        else if(event.target.parentElement.classList.contains('delete-icon'))
        {
            ui.deleteExpense(event.target.parentElement);   
        }
    });

}

document.addEventListener('DOMContentLoaded', function()
{
    eventListners();
})
  