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
      "QmT1xz1kRVoMLRemwQpuTmHdzG1CJX8mhE8QUty2aM4kKd",
      "QmQTdwEVUokpiaaz83H8mm8e3NQTnZr5boW29R3QNHKenn",
      "QmQGKAA2NQwDEDUKmjzdcZJZz2iUW3W77dxUtP5meMDqdf",
      "Qmd35fog9p8Xh2B7oaDswdHSxwXJez7s5xpTiGq6EME1qg",
      "QmTarZWuVqUsqvatkCJsDdVVxiXV7YSMWk5kdJuDm4UhAg",
      "QmWbX3pZbmGW3AgHatMQLCd8SjNqSqPwjC2R4ZjBhxpgH7",
      "QmNPdFfJzetS1xFwQgtmoUAYv3HSvsHTX2FoV9uTtvFRBa",
      "QmdXFzzpUHoAnmm2nWGHH3wSKf4h11fevoXvZxLsRMvMaq",
      "Qmef3xqiWgRPvm6G4VveYUWs3HaMmNgwLtQNZnq5gP2Srk",
      "QmbFByP7Y3A5gX99URJQoHzZ5ohLhmmaudYD4QpQMNGdVP",
      "QmcBa9iE1q1Ykkat292CcUHCc7GAUGwk88oi1Hyv2LXQKA",
      "QmPK3p9BhGwBDp7xeR4PCGyf877LASCkdC6XH6Sq8QggYH",
      "QmbG3voNgRo8SUGuMudQHi4gSALo2BtvM55kYvQP4hQQGQ",
      "QmZGFr2Yeoarxwsk1w8jg7JAGVFkgeE6qPDbNihzGPQeiF",
      "QmcCjfZNE3NeHpDPvfZgCcoE9dKbpBnYFKF46bA4nyfNis",
      "QmZb3AsyTyhgPzR27SajuadHprTtKyEo5wvp2uQFniYwYJ",
      "QmfH9dbVEvNRxxwZZ6CDGaMwEtXas3CnFTq4zUsKMi974M",
      "QmXP33MB47L6yWDtGdiMypbPgjdivmx3ZKRCj2ukuLqFmZ",
      "QmZPcxj8A32wYCANXpyd4xNpBH8ADksbMSkophFKQdALKr",
      "QmYUQ2WE5Ni3BzSuZK3v4PzzeaguxKzS7Vns4hnEMbgiCF",
      "Qmc2uh5Tm9F3NYBGZFZocKo9HdWneExgFmBiLCpPTrZAC9",
      "QmZmM9UzrFvF4nJmzmg7EjrrUMBa7vaQyjZaDeezzdaBhW",
      "QmXszXN5jNW7WPEYsaFQrH63FL1CVf3gdkQ3kPw7PrJ3Tu",
      "Qmc5u25shAppRf2r26Q6H8DN7A1Pn6AJ8DZWvjzfnYoBXr",
      "QmSTew3bhRoumKLoUBTXfQbvs46MpEyRCiUrZU4rKqgkSX",
      "QmXP33MB47L6yWDtGdiMypbPgjdivmx3ZKRCj2ukuLqFmZ",
      "Qmc5u25shAppRf2r26Q6H8DN7A1Pn6AJ8DZWvjzfnYoBXr",
      "QmYUQ2WE5Ni3BzSuZK3v4PzzeaguxKzS7Vns4hnEMbgiCF",
      "QmSTew3bhRoumKLoUBTXfQbvs46MpEyRCiUrZU4rKqgkSX",
      "QmW5t2XZtRW6miyLnHWVaFe4wYi2vCborDJAbipr9f6bHL",
      "QmdPzXre1Zo33aAZWfmZ1d2BSEuQ315uKytJgoUCStj5ng",
      "QmXHwDq1fWb5QCgDkPTgKrh9hUWPwYyyEwJFbV87QedBuW",
      "Qmacmtbd1ZXftYZLDL7DzNctVTPKGurwaAP41Lnb82P9nM",
      "QmaigRhLcHNhNL8MXeCVJiva7rCogtt3M9sgm5jMJ8WViP",
      "QmePtF33rA6UyrH6R9rQbsMQGrwGYBfsbbBp6yAAsJadf2",
      "QmaqY6qgEEck4o9EACLKcEPTfbTo2DLyNJ9Ge8r9G1z716",
      "QmRFM8eEHQZEdXLyKuLgDXq8nd24SKNbhPqZsRm4GnxFi4",
      "QmWpbtDzU1W7MW9fjMxohnuxqZvvxDSZAxqGgvkP2Pyheu",
      "Qma76kjfavzsLB7gUmscf1scA76vdgBrZdKrAvELZ5GL5B",
      "QmUjH8XaGgFDK6jXp8wXkQuoS8ZF2F1eahQ1J6dbZekwQy",
      "QmdEPhycFCkrKVxUMj95r2Qn5m1fvwMxaFaFHqiTMuxAJQ",
      "Qmck7KMzXjaXETxe1gjg2bZZur6SwYiSYQ8MiRWfQsdjze",
      "QmarFmY6UJM7sjLPeGH3dcQx8JKsuvTWqnpva1wXVWUuTM",
      "Qmd5TtETbrkghyoU2rHdPqtUemceHaBaSjvQhgKSb9PMgx",
      "QmRwbkh4povwcqsMSEoYbKoN96pZPaxM8x5aBbThqxHbxG",
      "QmYo6sRzrwipcmHNeRA4nJFuY1dFVysFWtFTkikjP3ZaFK",
      "QmdgVBtYQKjxmW4Moi4KvkxsGY7QhwL9QjNH3LcsqnJTaZ",
      "QmWqdzVBVuGZbQU6ucQT7G8ZqT3n4APcRojzii6keQWtn6",
      "QmYZ9ehys9gaD3zcs7EACe7hbixv5EUGCtRN25NjLmHoDB",
      "QmZgt4HpDn7q5oe8PcSPJUEKQSb423Rg8TYHKJQjQwuDQf",
      "QmYK1nGGRgMj6w4SgeuheWo9snacXMwwKACmvvKNaqrbzQ",
      "QmTgF4rr9sbHdVxETm9EXWGPgf6ZZHevwxtTEXLTvqpv4M",         
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
