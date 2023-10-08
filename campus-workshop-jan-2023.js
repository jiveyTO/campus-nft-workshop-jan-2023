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
  
  function getRandomCID() {
    const cids = [
      "QmT1xz1kRVoMLRemwQpuTmHdzG1CJX8mhE8QUty2aM4kK",
      "QmQTdwEVUokpiaaz83H8mm8e3NQTnZr5boW29R3QNHKen",
      "QmQGKAA2NQwDEDUKmjzdcZJZz2iUW3W77dxUtP5meMDqd",
      "Qmd35fog9p8Xh2B7oaDswdHSxwXJez7s5xpTiGq6EME1q",
      "QmTarZWuVqUsqvatkCJsDdVVxiXV7YSMWk5kdJuDm4UhA",
      "QmWbX3pZbmGW3AgHatMQLCd8SjNqSqPwjC2R4ZjBhxpgH",
      "QmNPdFfJzetS1xFwQgtmoUAYv3HSvsHTX2FoV9uTtvFRB",
      "QmdXFzzpUHoAnmm2nWGHH3wSKf4h11fevoXvZxLsRMvMa",
      "Qmef3xqiWgRPvm6G4VveYUWs3HaMmNgwLtQNZnq5gP2Sr",
      "QmbFByP7Y3A5gX99URJQoHzZ5ohLhmmaudYD4QpQMNGdV",
      "QmcBa9iE1q1Ykkat292CcUHCc7GAUGwk88oi1Hyv2LXQK",
      "QmPK3p9BhGwBDp7xeR4PCGyf877LASCkdC6XH6Sq8QggY",
      "QmbG3voNgRo8SUGuMudQHi4gSALo2BtvM55kYvQP4hQQG",
      "QmZGFr2Yeoarxwsk1w8jg7JAGVFkgeE6qPDbNihzGPQei",
      "QmcCjfZNE3NeHpDPvfZgCcoE9dKbpBnYFKF46bA4nyfNi",
      "QmZb3AsyTyhgPzR27SajuadHprTtKyEo5wvp2uQFniYwY",
      "QmfH9dbVEvNRxxwZZ6CDGaMwEtXas3CnFTq4zUsKMi974",
      "QmXP33MB47L6yWDtGdiMypbPgjdivmx3ZKRCj2ukuLqFm",
      "QmZPcxj8A32wYCANXpyd4xNpBH8ADksbMSkophFKQdALK",
      "QmYUQ2WE5Ni3BzSuZK3v4PzzeaguxKzS7Vns4hnEMbgiC",
      "Qmc2uh5Tm9F3NYBGZFZocKo9HdWneExgFmBiLCpPTrZAC",
      "QmZmM9UzrFvF4nJmzmg7EjrrUMBa7vaQyjZaDeezzdaBh",
      "QmXszXN5jNW7WPEYsaFQrH63FL1CVf3gdkQ3kPw7PrJ3T",
      "Qmc5u25shAppRf2r26Q6H8DN7A1Pn6AJ8DZWvjzfnYoBX",
      "QmSTew3bhRoumKLoUBTXfQbvs46MpEyRCiUrZU4rKqgkS",
      "QmXP33MB47L6yWDtGdiMypbPgjdivmx3ZKRCj2ukuLqFm",
      "Qmc5u25shAppRf2r26Q6H8DN7A1Pn6AJ8DZWvjzfnYoBX",
      "QmYUQ2WE5Ni3BzSuZK3v4PzzeaguxKzS7Vns4hnEMbgiC",
      "QmSTew3bhRoumKLoUBTXfQbvs46MpEyRCiUrZU4rKqgkS",
      "QmW5t2XZtRW6miyLnHWVaFe4wYi2vCborDJAbipr9f6bH",
      "QmdPzXre1Zo33aAZWfmZ1d2BSEuQ315uKytJgoUCStj5n",
      "QmXHwDq1fWb5QCgDkPTgKrh9hUWPwYyyEwJFbV87QedBu",
      "Qmacmtbd1ZXftYZLDL7DzNctVTPKGurwaAP41Lnb82P9n",
      "QmaigRhLcHNhNL8MXeCVJiva7rCogtt3M9sgm5jMJ8WVi",
      "QmePtF33rA6UyrH6R9rQbsMQGrwGYBfsbbBp6yAAsJadf",
      "QmaqY6qgEEck4o9EACLKcEPTfbTo2DLyNJ9Ge8r9G1z71",
      "QmRFM8eEHQZEdXLyKuLgDXq8nd24SKNbhPqZsRm4GnxFi",
      "QmWpbtDzU1W7MW9fjMxohnuxqZvvxDSZAxqGgvkP2Pyhe",
      "Qma76kjfavzsLB7gUmscf1scA76vdgBrZdKrAvELZ5GL5",
      "QmUjH8XaGgFDK6jXp8wXkQuoS8ZF2F1eahQ1J6dbZekwQ",
      "QmdEPhycFCkrKVxUMj95r2Qn5m1fvwMxaFaFHqiTMuxAJ",
      "Qmck7KMzXjaXETxe1gjg2bZZur6SwYiSYQ8MiRWfQsdjz",
      "QmarFmY6UJM7sjLPeGH3dcQx8JKsuvTWqnpva1wXVWUuT",
      "Qmd5TtETbrkghyoU2rHdPqtUemceHaBaSjvQhgKSb9PMg",
      "QmRwbkh4povwcqsMSEoYbKoN96pZPaxM8x5aBbThqxHbx",
      "QmYo6sRzrwipcmHNeRA4nJFuY1dFVysFWtFTkikjP3ZaF",
      "QmdgVBtYQKjxmW4Moi4KvkxsGY7QhwL9QjNH3LcsqnJTa",
      "QmWqdzVBVuGZbQU6ucQT7G8ZqT3n4APcRojzii6keQWtn",
      "QmYZ9ehys9gaD3zcs7EACe7hbixv5EUGCtRN25NjLmHoD",
      "QmZgt4HpDn7q5oe8PcSPJUEKQSb423Rg8TYHKJQjQwuDQ",
      "QmYK1nGGRgMj6w4SgeuheWo9snacXMwwKACmvvKNaqrbz",
      "QmTgF4rr9sbHdVxETm9EXWGPgf6ZZHevwxtTEXLTvqpv4"      
    ];
    const randomIndex = Math.floor(Math.random() * cids.length);
    return cids[randomIndex];
  }

  let nftURIField = document.getElementById('nftTokenURL');
  if ( nftURIField.value.length == 0 ) {
    // Use my image stored on Pinata as the default
    // nftURIField.value = 'ipfs://QmXSidVfGe24KazE9nWQHm3Y51g82jXnKajcEYdFLCpaCS';
    const randomCID = getRandomCID();
    nftURIField.value = randomCID;
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
      document.getElementById('offerIndexInput').value = offer.nft_offer_index;
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
