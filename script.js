const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")

//Captura eveento de input para formartar valor
amount.oninput = () => {
    //Obtem o valor atual do input e remove os caracteres nao numericos
    let value = amount.value.replace(/\D/g, "")

    //Transformando o valor em centavo
    value = Number(value)/100

    //Atualiza o valor do input
    amount.value =  formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    return value
}

// Captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
    // Previne o comportamento padrao de recarregar a pagina
    event.preventDefault()
// Cria um objeto com os detalhes na nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense)

}
// Adiciona um novo item a lista
function expenseAdd(newExpense){
    try{
        // Cria o elemento de li para adicionar na lista (ul).
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Cria o icone da categoria.
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //cria  a info da despesa
        const expenseInfo = document.createElement ("div")
        expenseInfo.classList.add("expense-info")

        // Cria o nome da despesa.
        const expenseName = document.createElement("strrong")
        expenseName.textContent = newExpense.expense

        // Cria a categotia da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // Adiciona name e categoria na div das infomacoes das despesas
        expenseInfo.append(expenseName, expenseCategory)

        //Valor das despesas
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

        // Cria o icone de remover 
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        // adiciona as informacoes no item.
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // adiciona o item na lista
        expenseList.append(expenseItem)

        // Limpa o formulario para adicionar um novo item
        formClear()

        // atualiza os totais
        updateTotals()

    } catch (error){
        alert("Nao foi possivel atualizar a lista de despesas.")
        console.log(error)

    }
}

// Atualiza o total da lista
function updateTotals(){
    try {
        //Recupera todo os itens (li) da lista (ul).
        const items = expenseList.children

        // Atualiza a quantidade de itens da lista
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas": "despesa"}`

        // Variavel para incrementar o total.
        let total = 0

        // Percorrer cada item (li) da Lista (ul)
        for (let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")
            
            //Remover caracteres nao numericos e substitui a virgula pelo ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

            //Converte o valor para float
            value = parseFloat (value)

            // Verifica se e m numero valido
            if(isNaN(value)){
                return alert("Nao foi possivel calcular o total. Verifique se existem apenas numeros")
            }

            //Incrementar o valor total
            total += Number(value)
        }

        // Cria a span para adicionar o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        total = formatCurrencyBRL (total).toUpperCase().replace("R$", "")
        
        // Limpa o conteudo do elemento
        expensesTotal.innerHTML = ""

            // Adiciona  simbolo da moeda formartado
            expensesTotal.append(symbolBRL, total)
    } catch (error) {
        console.log(error)
        alert("Nao foi possivel atualizar os totais.")
    }
}


// Evento que captura o clique nos itens da lista.
expenseList.addEventListener("click", function(event){
    // Verifica se o elemento clicado e o icone de remover
    if (event.target.classList.contains("remove-icon")){
        // Obtem a li pai do elemento clicado.
        const item = event.target.closest(".expense")

        // Remove o item da lista
        item.remove()
    }
    // atualiza os totais.
    updateTotals()
})

function formClear(){
    //Limpa os inputs
    expense.value = ""
    category.value = ""
    amount.value = ""

    // Coloca o foco nos input dos amount 
    expense.focus()

}