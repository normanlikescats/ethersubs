import React from "react";

export default function About(){
  return(
      <div className="z-20 px-8 md:px-16 xl:px-28 mx-8 md:mx-20 lg:mx-32 mb-20 flex flex-col justify-start text-left py-12 rounded-2xl bg-panel-blue/40 shadow-xl">
        <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl">About Us</h1>
        <h2 className="pt-6 font-lilita text-xl 2xl:text-3xl xl:text-2xl">What is EtherSubs?</h2>
        <p className="pt-3 font-raleway text-m 2xl:text-xl xl:text-l">
          Here at EtherSubs, we believe in the right to transact. This means that anyone, yes, anyone, should have the right to financial services.
          <br/><br/>
          Sadly, for many in the world, their reality could not be further. Be it due to corruption, discrimination or systematic failure, there are many people around the world who simply are denied financial services. These are the <a className="transition duration-150 ease-out hover:underline" href="https://www.investopedia.com/terms/u/unbanked.asp" target="blank">unbanked.</a>
          <br/><br/>
          With the onset of COVID-19 pandemic and the resulting lockdowns, the world has seen an incredible rise of freelancing and content creators. This especially impacts many of these unbanked individuals who have found a new revenue stream or career path through the internet. But without the right financial infrastructure, these creators struggle to get paid.
          <br/><br/>
          Enter EtherSubs.
          <br/><br/>
          EtherSubs leverages the power of the Ethereum blockchain to bring financial services to quite literally anyone in the world. With an internet connection and just a mobile phone, content creators can receive contributions from their most die-hard fans and, at the same time, reward these fans with exclusive content.
        </p>
        <h2 className="pt-12 font-lilita text-xl 2xl:text-3xl xl:text-2xl">How Does EtherSubs Work?</h2>
        <p className="pt-3 font-raleway text-m 2xl:text-xl xl:text-l">
          EtherSubs is built on the Ethereum blockchain, which is one of the leading blockchains today in the crypto space. A blockchain is similar to a digital ledger that keeps track of transactions and interactions. It's similar to a spreadsheet that multiple people can access and update, but with a couple of unique features.
          <br/><br/>
          Firstly, the Ethereum blockchain is public. This means that anyone and everyone can see and track every transaction on the blockchain. With such transparency, it’s always clear that money being paid is directed to the places they are advertised. If you pay $100 to your favourite content creator today, you can track that $100 to their wallet to be sure they received it!
          <br/><br/>
          The public nature of the Ethereum blockchain allows it to be decentralised. Instead of relying on a central authority, such as a bank or government, Ethereum operates on a network of computers called nodes. These nodes work together to validate and record transactions and maintain the integrity of the blockchain. Due to the number and distribution of nodes, no one needs permission to transact or operate on Ethereum. In fact, one does not even require permission to set up a node on Ethereum to participate in securing the blockchain!
          <br/><br/>
          Finally, Ethereum is immutable. This means that once a transaction has been confirmed and included on the chain, it cannot be reversed, modified or deleted. This also means that payments made cannot be suddenly reversed through some loophole or refund mechanism, which could put the recipient in a tough spot.
          <br/><br/>
          These special properties of Ethereum makes it perfect for the use case which EtherSubs targets, especially due to its uncensorability and the accessibility of the blockchain. This means that no one can stop a user from receiving their payment nor can anyone prevent a user from setting up a wallet on Ethereum.
        </p>
        <h2 className="pt-12 font-lilita text-xl 2xl:text-3xl xl:text-2xl">How Do I Use EtherSubs?</h2>
        <p className="z-10 pt-3 pb-8 font-raleway text-m 2xl:text-xl xl:text-l">
          To use EtherSubs, you will only need a couple of things:
          <br/><br/>
          1. A wallet: Your wallet allows you to transact and send donations to your favourite creators. If you’re a creator, a wallet allows you to receive funds from your fans!
          <br/><br/>
          2. Some funds: Of course you’ll need funds to support your creators! As a creator, funds are not necessarily required, unless you’re looking to support another creator, which is very wholesome too.
          <br/><br/>
          First, start by connecting your wallet in our app. Connecting your wallet does not allow us to touch your funds, but it allows you to interact with the app to send funds yourself!
          <br/><br/>
          Once connected, navigate to the page of the creator you wish to support. Select one of their payment tiers or simply donate a custom amount using the custom option.
          <br/><br/>
          A confirmation should pop-up in your wallet, prompting you to confirm the transaction. After confirming, the transaction will take some time to be processed, but we will notify you once it is completed. And that’s it!
        </p>
      </div>
  )
}