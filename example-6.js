//BCD

//See example2.js, numbers are the same but with 7 decimals instead of 8

node tx.js BCD create prevtx=d5a80b216e5966790617dd3828bc13152bad82f121b16208496e9d718664e206 prevaddr=GSjwHAAYmFfQ4WPArc2ErtjQGr3Q2nkjvo prevamount=0.0998277 previndex=31 privkey=<privkey> addr=GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB fees=0.0001001 amount=0.05

//output same as example2.js

node index.js BCD testamount prevamount=0.0998277 fees=0.0001001 amount=0.05

/*
Version BCD
testamount
--- Previous amount is: 0.0998277
--- Amount to spend is: 0.0500000
--- Network fees are: 0.0001001
--- Dev fees are: 0.0008500
--- Refunded amount to spending address is: 0.0488776
*/