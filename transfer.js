const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar,
    TransferTransaction,
  } = require("@hashgraph/sdk");
  
  require("dotenv").config();
  
  async function environmentSetup() {
    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;
  
    // If we weren't able to grab it, we should throw a new error
    if (!myAccountId || !myPrivateKey) {
      throw new Error(
        "Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present"
      );
    }
    
    //Create your Hedera Testnet client
    const client = Client.forTestnet();
  
    //Set your account as the client's operator
    client.setOperator(myAccountId, myPrivateKey);

    const newAccountId = "0.0.4501082";

    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000)) //Sending account
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000)) //Receiving account
        .execute(client);
    
     //Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log("The transfer transaction from my account to the new account was: " + transactionReceipt.status.toString());

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");

    client.close();
  }
  environmentSetup();