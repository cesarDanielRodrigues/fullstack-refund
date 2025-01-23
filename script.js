// Interligando formulário principal
const form = document.querySelector("form")

// Interligando campos do HTML com o JavaScript
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Interligando ul(único)
const ul = document.querySelector("ul")

//Interligando section aside header p span
const expensesCount = document.querySelector("section aside header p span")

//Interligando section aside header h2
const expensesTotal = document.querySelector("section aside header h2")

// Verificação de inserção para não aceitar dígitos e formatando Number para Real Brasileiro
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "")

  value = Number(value) / 100

  // Passando valor convertido para o amount
  amount.value = formatCurrencyBRL(value)
}

// Função para converter valores para moeda BRL(Real Brasileiro)
function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return value
}

// Adicionando um evento no formulário
form.onsubmit = (event) => {
  //Evitar carregamento da página
  event.preventDefault()

  //Objeto de abstração de nova despesa
  const newExpense = {
    // id do objeto
    id: new Date().getTime(),
    // Nome dado a despesa
    expense: expense.value,
    // id da despesa
    category_id: category.value,
    // descrição da despesa
    category_name: category.options[category.selectedIndex].text,
    // valor da despesa
    amount: amount.value,
    // quando o objeto foi criado
    created_at: new Date(),
  }

  // Chamando função e passando o objeto(newExpense)
  expenseAdd(newExpense)
}

// Função para acionar ao HTML elementos do Objeto(Despesa)
function expenseAdd(newExpense) {
  try {
    // Criando elemento expenseItem(li) e adicionando uma class(expense)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Criando elemento expenseIcon(img) e adicionando atributos(src, alt)
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Criando elemento expenseInfo(div) e adicionando uma class(expense-info)
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Criando elementos expenseName(strong) e expenseDescription(span)
    const expenseName = document.createElement("strong")
    const expenseDescription = document.createElement("span")

    //Adicionando aos elementos (expenseName, expenseDescription) informações do objeto(newExpense)
    expenseName.textContent = newExpense.expense
    expenseDescription.textContent = newExpense.category_name

    //Adicionando ao elemento (expenseInfo) os elementos (expenseName, expenseDescription)
    expenseInfo.append(expenseName, expenseDescription)

    // Criando elemento expenseAmount(span), adicionando uma class(estilização) e adicionando um elemento(small) para adicionar valor do objeto newExpense(amount)
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    // Criando expenseClose, passando uma class(estilização), e passando atributos src e alt
    const expenseClose = document.createElement("img")
    expenseClose.classList.add("remove-icon")
    expenseClose.setAttribute("src", `img/remove.svg`)
    expenseClose.setAttribute("alt", "remover")

    // Inserção dos elementos no HTML
    //Adicionando ao elemento (expenseItem) os elementos (expenseIcon, expenseInfo)
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseClose)

    //Adicionando ao elemento (ul) o elemento expenseItem
    ul.append(expenseItem)

    //Limpando formulário e focando no campo de despesa
    clearForm()

    // Atualizando a quantidade e os valores da tabela
    updateTotals()
  } catch (error) {
    // Tratamento de erro padrão
    alert("Não foi possível atualizar a lista de despesas")
    console.log(error)
  }
}
//Função para calcular a quantidade de elementos e valor
function updateTotals() {
  try {
    // Verificando a quantidade de items
    const ulCount = ul.children

    //Passando a quantidade de items para o HTML, e alterando conforme a quantidade
    expensesCount.textContent = `${ulCount.length} ${ulCount.length > 1 ? "despesas" : "despesa"}`

    //Inicializando variável total
    let total = 0

    for (let item = 0; item < ulCount.length; item++) {
      // Colocando cada item do ulCount em uma variável
      const countItems = ulCount[item].querySelector(".expense-amount")

      // Modificando o textContent apenas para números e convertendo esse números para Float
      let value = parseFloat(countItems.textContent.replace(/[^\d,]/g, "").replace(",", "."))

      // Verificando se value é NaN
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total. O valor não é um número")
      }

      // Passando value para Total
      total += Number(value)
    }

    // Criando symbolBRL(small)
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Passando para o total o valor convertido para BRL sem o "R$"
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpando o expensesTotal para receber o symbolBRL e total
    expensesTotal.innerHTML = ""

    // Passando o symbolBRL e total para expensesTotal
    expensesTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error)
    alert("Não foi possível contar as despesas")
  }
}

ul.onclick = (event) => {
  //Ao clicar para excluir entra dentro do IF
  if (event.target.classList.contains("remove-icon")) {
    //Seleciona o ancestral que tem contém class expense
    const item = event.target.closest(".expense")

    // Remove o ancestral selecionado no const item
    item.remove()

    //Atualiza o valor e quantidade
    updateTotals()
  }
}

function clearForm() {
  // Limpa os campos
 amount.value = ""
 expense.value = ""
 category.value = ""

 //Mudar o foco para o campo de despesa
 expense.focus()
}
