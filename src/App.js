App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const pesGrid = await $.getJSON('PesGrid.json')
    App.contracts.PesGrid = TruffleContract(pesGrid)
    App.contracts.PesGrid.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.pesGrid = await App.contracts.PesGrid.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)
	
	// Render Values
    await App.rendervalues()


    // Render Account
    $('#account').html(App.account)

    // Update loading state
    App.setLoading(false)
  },

	rendervalues: async () => {
		const consumed = await App.pesGrid.consumed();
        const total = await App.pesGrid.total();
        const sold = await App.pesGrid.sold();
                
        $("#soldvalue").html(sold + " kw");
        $("#totalvalue").html(total + " kw");
        $("#consumedvalue").html(consumed + " kw");
	},
		

addBuyer: async () => {
  App.setLoading(true)
  const content = $('#newbuyer').val()
  const pow = $('#newpow').val()
  const av = await App.pesGrid.available();
  if(pow>av)
  {
	alert("POWER LIMIT EXCEEDED") 
  }
  else
  {
	await App.pesGrid.addbuyer(content, pow)
  }
  window.location.reload()
},


addconsumption: async () => {
  App.setLoading(true)
  const powc = $('#consume').val()
  const av = await App.pesGrid.available();
  if(powc>av)
  {
	alert("POWER LIMIT EXCEEDED") 
  }
  else
  {
	await App.pesGrid.addconsumption(powc)
  }
  window.location.reload()
},

addpanels: async () => {
  App.setLoading(true)
  const powa = $('#add').val()
  await App.pesGrid.addpanels(powa)
  window.location.reload()
},


  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})

