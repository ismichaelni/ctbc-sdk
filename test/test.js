var POSAPI = require('../lib/POSAPI')();
var fs = require('fs');

var options = {
  host: 'testepos.chinatrust.com.tw',
  port: 2011,
  servername: 'hy3ds.hyweb.com.tw',
  ca: fs.readFileSync('./server.cer')
};

POSAPI.init(options);

// 信用卡授權交易
var data = {
  'MERID': '2522',
  'LID-M': 'TS20140411000001',
  'PAN': '4444444444444444123',
  'ExpDate': '201901',
  'currency': '901',
  'purchAmt': '100',
  'exponent': '0',
  'ECI': '7',
  // 'BIRTHDAY': '',
  // 'CAVV': '12345',
  'ORDER_DESC': '刷卡測試'
  // 'PID': '',
  // 'TRV_DepartDay': '',
  // 'TRV_MerchantID': '',
  // 'TRV_Commission': ''
};

POSAPI.authTransac(data, function (err, res) {
  if (err) {
    console.log(JSON.stringify(err, null, 2));
  } else {
    console.log(JSON.stringify(res, null, 2));
  }
});

// 信用卡分期授權交易
// var data = {
//   'MERID': '2522',
//   'LID-M': 'TS20140411000001',
//   'PAN': '4123450131003312123',
//   'ExpDate': '201901',
//   'currency': '901',
//   'purchAmt': '100',
//   'exponent': '0',
//   'ECI': '6',
//   // 'BIRTHDAY': '',
//   'CAVV': '12345',
//   'ORDER_DESC': '分期刷卡測試',
//   // 'PID': '',
//   'RECUR_FREQ': '6',
//   'RECUR_END': '20201231',
//   'RECUR_NUM': '6'
//   // 'TRV_DepartDay': '',
//   // 'TRV_MerchantID': '',
//   // 'TRV_Commission': ''
// };

// POSAPI.authRecurTransac(data, function (err, res) {
//   if (err) {
//     console.log(JSON.stringify(err, null, 2));
//   } else {
//     console.log(JSON.stringify(res, null, 2));
//   }
// });

// 紅利折抵授權交易
// var data = {
//   'MERID': '2522',
//   'LID-M': 'TS20140414000001',
//   'PAN': '4123450131003312123',
//   'ExpDate': '201901',
//   'currency': '901',
//   'purchAmt': '100',
//   'exponent': '0',
//   'ECI': '6',
//   // 'BIRTHDAY': '',
//   'CAVV': '12345',
//   'ORDER_DESC': '紅利折抵授權交易測試',
//   // 'PID': '',
//   'PRODCODE': '01'
//   // 'TRV_DepartDay': '',
//   // 'TRV_MerchantID': '',
//   // 'TRV_Commission': ''
// };

// POSAPI.redeemTransac(data, function (err, res) {
//   if (err) {
//     console.log(JSON.stringify(err, null, 2));
//   } else {
//     console.log(JSON.stringify(res, null, 2));
//   }
// });

// 取消授權交易(一般、分期和紅利的授權交易皆適用)
// var data = {
//   'MERID': '2522',
//   'XID': '13F8455300006332800_TS20140410000003',
//   'AuthRRPID': '13F8455300006332800_TS20140410000003',
//   'currency': '901',
//   'orgAmt': '100',
//   'authnewAmt': '0',
//   'exponent': '0',
//   'AuthCode': '001145',
//   'TermSeq': '43'
// };

// POSAPI.authRevTransac(data, function (err, res) {
//   if (err) {
//     console.log(JSON.stringify(err, null, 2));
//   } else {
//     console.log(JSON.stringify(res, null, 2));
//   }
// });

// 交易易進入請款動作
// var data = {
//   'MERID': '2522',
//   'XID': 'ABFA455300006404220_TS20140410000005',
//   'AuthRRPID': 'ABFA455300006404220_TS20140410000005',
//   'currency': '901',
//   'orgAmt': '100',
//   'capAmt': '100',
//   'exponent': '0',
//   'AuthCode': '003313',
//   'TermSeq': '49'
//   // 'TRV_DepartDay': '',
//   // 'TRV_MerchantID': '',
//   // 'TRV_Commission': ''
// };

// POSAPI.capTransac(data, function (err, res) {
//   if (err) {
//     console.log(JSON.stringify(err, null, 2));
//   } else {
//     console.log(JSON.stringify(res, null, 2));
//   }
// });

// 取消轉入請款的動作
// var data = {
//   'MERID': '2522',
//   'XID': 'ABFA455300006404220_TS20140410000005',
//   'AuthRRPID': 'ABFA455300006404220_TS20140410000005',
//   'currency': '901',
//   'orgAmt': '100',
//   'exponent': '0',
//   'AuthCode': '003313',
//   'TermSeq': '49',
//   'BatchID': '2',
//   'BatchSeq': '4'
// };

// POSAPI.capRevTransac(data, function (err, res) {
//   if (err) {
//     console.log(JSON.stringify(err, null, 2));
//   } else {
//     console.log(JSON.stringify(res, null, 2));
//   }
// });

// 進行退款動作
// var data = {
//   'MERID': '2522',
//   'XID': 'ABFA455300006404220_TS20140410000005',
//   'AuthRRPID': 'ABFA455300006404220_TS20140410000005',
//   'currency': '901',
//   'orgAmt': '100',
//   'credAmt': '100',
//   'exponent': '0',
//   'AuthCode': '003313',
//   'CapBatchID': '2',
//   'CapBatchSeq': '6'
//   // 'TRV_DepartDay': '',
//   // 'TRV_MerchantID': '',
//   // 'TRV_Commission': ''
// };

// POSAPI.credTransac(data, function (err, res) {
//   if (err) {
//     console.log(JSON.stringify(err, null, 2));
//   } else {
//     console.log(JSON.stringify(res, null, 2));
//   }
// });

// 進行取消退款動作
// var data = {
//   'MERID': '2522',
//   'XID': 'ABFA455300006404220_TS20140410000005',
//   'AuthRRPID': 'ABFA455300006404220_TS20140410000005',
//   'currency': '901',
//   'orgAmt': '100',
//   'exponent': '0',
//   'AuthCode': '003313',
//   'CredBatchID': '3',
//   'CredBatchSeq': '1'
// };

// POSAPI.credRevTransac(data, function (err, res) {
//   if (err) {
//     console.log(JSON.stringify(err, null, 2));
//   } else {
//     console.log(JSON.stringify(res, null, 2));
//   }
// });

// 訂單資料查詢
// var data = {
//   'TX_ATTRIBUTE': 'TX_AUTH',
//   'MERID': '2522',
//   'LID-M': 'TS20140410000005',
//   'XID': 'ABFA455300006404220_TS20140410000005',
//   'PAN': '',
//   'currency': '901',
//   'purchAmt': '100',
//   'RECUR_NUM': '0',
//   'PRODCODE': ''
// };

// POSAPI.inquiryTransac(data, function (err, res) {
//   if (err) {
//     console.log(JSON.stringify(err, null, 2));
//   } else {
//     console.log(JSON.stringify(res, null, 2));
//   }
// });

// 日期區間查詢訂單資料
// var data = {
//   'MERID': '2522',
//   'StartDate': '20140401',
//   'EndDate': '20140410'
// };

// POSAPI.orderQueryTransac(data, function (err, res) {
//   if (err) {
//     console.log(JSON.stringify(err, null, 2));
//   } else {
//     console.log(JSON.stringify(res, null, 2));
//   }
// });
