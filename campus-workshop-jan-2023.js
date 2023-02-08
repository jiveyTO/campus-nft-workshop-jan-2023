let net = 'wss://s.altnet.rippletest.net:51233';
let faucetHost = null;
console.log(net);

let my_wallet;

async function xrplConnect() {
  const client = new xrpl.Client(net);
  const connectResult = await client.connect();

  return client;
}

async function getCampusAccount() {    
  const client = await xrplConnect();

  // Start button spinner
  buttonSpin('account-create', 'on'); 

  // Fund wallet  
  let my_options = {    
    amount: "81522"
  };
  my_wallet = (await client.fundWallet(null, my_options)).wallet;
  console.log('wallet = ' + JSON.stringify(my_wallet));

  // Stop button spinner
  buttonSpin('account-create', 'off');   
  // Reveal the hidden fields
  revealFields('collapseCreate');      

  document.getElementById('classicAddress').value = my_wallet.classicAddress;
  document.getElementById('publicKey').value = my_wallet.publicKey;
  document.getElementById('privateKey').value = my_wallet.privateKey;
  document.getElementById('seed').value = my_wallet.seed;

  client.disconnect();
}

async function mintNFT() {
  const client = await xrplConnect();

  // Start button spinner
  buttonSpin('mint-nft', 'on');   

  let nftURIField = document.getElementById('nftTokenURL');
  if ( nftURIField.value.length == 0 ) {
    // Use my image stored on Pinata as the default
    nftURIField.value = 'ipfs://QmXSidVfGe24KazE9nWQHm3Y51g82jXnKajcEYdFLCpaCS';
  }        

  let transferFeeField = document.getElementById('transferFee');    
  if ( transferFeeField.value.length == 0 ) {
    transferFeeField.value = 0;
  }

  const transactionBlob = {
    "TransactionType": "NFTokenMint",
    "Account": my_wallet.classicAddress,
    "URI": xrpl.convertStringToHex(nftURIField.value),
    "Flags": 8,
    "TransferFee": parseInt(transferFeeField.value),
    "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
  };
  
  const tx = await client.submitAndWait(transactionBlob, { wallet: my_wallet });
  const nfts = await client.request({
    method: "account_nfts",        
    account: my_wallet.classicAddress
  });
   
  // Stop button spinner
  buttonSpin('mint-nft', 'off');    
  // Reveal the hidden fields
  revealFields('collapseNFTokenID');    

  let results = '\n\nnfts: ' + JSON.stringify(nfts, null, 2);
  console.log(results);      

  nfts.result.account_nfts.forEach(nft => {
    if ( nft.URI == xrpl.convertStringToHex(nftURIField.value) ) {
      document.getElementById('nftTokenID').value = nft.NFTokenID;
      document.getElementById('sellNFTokenID').value = nft.NFTokenID;
    }
  });
  
  client.disconnect();
}        

async function createSellOffer() {
  const client = await xrplConnect();        
  let tokenID = document.getElementById('sellNFTokenID').value;
  
  // Start button spinner
  buttonSpin('create-sell-offer', 'on');     
  
  let offerAmountField = document.getElementById('offerAmount');    
  if ( offerAmountField.value.length == 0 ) {
    offerAmountField.value = 50000000;
  }                

  let transactionBlob = {
    "TransactionType": "NFTokenCreateOffer",
    "Account": my_wallet.classicAddress,
    "NFTokenID": tokenID,
    "Amount": offerAmountField.value,
    "Flags": 1,
  }

  const tx = await client.submitAndWait(transactionBlob,{wallet: my_wallet});

  // Stop button spinner
  buttonSpin('create-sell-offer', 'off');    
  // Reveal the hidden fields
  revealFields('collapseNFTOfferIndex');       

  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: tokenID })
  } catch (err) {
    nftSellOffers = "No sell offers."
  }
  let results = '\n\n***Sell Offers***\n';
  results += JSON.stringify(nftSellOffers,null,2);
  console.log(results);

  nftSellOffers.result.offers.forEach( offer => {
    if ( offer.flags == 1 ) {
      document.getElementById('nftOfferIndex').value = offer.nft_offer_index;
    }
  });           

  client.disconnect();
}

async function acceptSellOffer() {
  const client = await xrplConnect();    

  // Start button spinner
  buttonSpin('accept-sell-offer', 'on'); 
  
  let acceptIndex = document.getElementById('acceptIndex');    
  if ( acceptIndex.value.length == 0 ) {
    alert("You must enter an NFT Offer Index");
    buttonSpin('accept-sell-offer', 'off');
    return;
  }                

  const transactionBlob = {
    "TransactionType": "NFTokenAcceptOffer",
    "Account": my_wallet.classicAddress,
    "NFTokenSellOffer": acceptIndex.value,
  }
  
  const tx = await client.submitAndWait(transactionBlob,{wallet: my_wallet}) 
  const nfts = await client.request({
    method: "account_nfts",
    account: my_wallet.classicAddress })  
  
  // Stop button spinner  
  buttonSpin('accept-sell-offer', 'off');           
    
  let results = 'Transaction result:\n'
  results +=  JSON.stringify(tx.result.meta.AffectedNodes[0], null, 2);
  results +=  JSON.stringify(tx.result.meta.TransactionResult, null, 2);
  results += '\nBalance changes:'
  results +=  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2);
  results += JSON.stringify(nfts, null, 2);
  console.log(results);

  client.disconnect();
}

function buttonSpin(button, flag) {
  // Start spinner
  if ( flag == 'on' ) {          
    document.getElementById(button + '-button-text').style.display = 'none';
    document.getElementById(button + '-spinner').style.display = 'inline';
    document.getElementById(button + '-button').disabled = true;  
  }

  // Stop spinner
  if ( flag == 'off' ) {
    document.getElementById(button + '-spinner').style.display = 'none';
    document.getElementById(button + '-button-text').style.display = 'inline'; 
    document.getElementById(button + '-button').disabled = false;            
  }  
}

function revealFields(collapseID) {
  // Show the fileds that will be populated
  let myCollapse = document.getElementById(collapseID);
  let bsCollapse = new bootstrap.Collapse(myCollapse, {
    toggle: false
  });
  bsCollapse.show();      
}