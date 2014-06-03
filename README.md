### 中國信託商業銀行非官方 POS Node.js API 元件

##### 本套件僅供參考，未實際用於正式環境

### 安裝

_本套件未上傳至 npm_

### 初始化

安裝完畢後，你可以使用 `require` 將元件載入到你的 node 程式：

```js
var posapi = require('ctcb-sdk')();
```

`host`、`port`: 交易主機之網域名稱及埠號可從官方系統使用手冊取得。(**必填**)

`servername`: CA 證書的 Common Name，因證書內網址與遠端主機網域不符，需此參數才可正常連線。(**必填**)

`ca`: PEM 格式的受信任證書的字串或緩衝區的陣列。(**必填**)

```js
posapi.init({
  host: 'TRANSACTION_SERVER_DOMAIN_NAME',
  port: 'TRANSACTION_SERVER_PORT',
  servername: 'COMMON_NAME_IN_CA',
  ca: fs.readFileSync('PATH_TO_CA_FILE')
});
```

### 支援功能

* 信用卡授權作業：[authTransac](#authTransac)(`auth`, `callback`)
* 信用卡分期付款授權作業：[authRecurTransac](#authRecurTransac)(`authRecur`, `callback`)
* 信用卡紅利付款授權作業：[redeemTransac](#redeemTransac)(`redeem`, `callback`)
* 取消信用卡授權作業：[authRevTransac](#authRevTransac)(`authRev`, `callback`)
* 信用卡請款作業：[capTransac](#capTransac)(`cap`, `callback`)
* 取消信用卡請款作業：[capRevTransac](#capRevTransac)(`capRev`, `callback`)
* 退款作業：[credTransac](#credTransac)(`cred`, `callback`)
* 取消退款作業：[credRevTransac](#credRevTransac)(`credRev`, `callback`)
* 單筆訂單狀態查詢：[inquiryTransac](#inquiryTransac)(`inquiry`, `callback`)

---

<a name="authTransac"></a>
#### 信用卡授權作業

```js
posapi.authTransac(auth, callback)
```

##### 請求
> `auth`: **必填**，JSON 格式物件，欄位如下：

| 屬性名稱 | 說明 |
|---------|------|
| MERID | 為此交易商店於網路收單系統中的商店編號設定值，須經由收單銀行給予。 |
| LID-M | 為電子商場的應用程式所給予此筆交易的訂單編號，資料型態為最長 19 個字元字串。訂單編號僅接受一般英文字母、數字及底線的組合，不可出現其餘符號字元。 |
| PAN | 為信用卡號及卡片背面末三碼值(CVV2/CVC2)，最大長度 19 位數字。 |
| ExpDate | 為信用卡之有效期限，格式固定為六碼 YYYYMM。 |
| currency | 交易幣值代號。長度為 3 個字元的字串。(如台幣"901") |
| purchAmt | 為消費者此筆交易所購買商品欲授權總金額。 |
| exponent | 為幣值指數，新台幣為 0。(如美金 1.23 元，purchAmt 給 123 而 exponent 則給 -2) |
| ECI | 為電子商務交易安全等級。一般 VISA 卡與 JCB 卡 SSL 交易 eci 值須設定為 7，MasterCard 卡 SSL 交易 eci 值須設定為 0，3D Secure 交易則是收單銀行的作業規範。 |
| BIRTHDAY | 持卡人之出生年月日(格式 MMDDYYYY)，8 個字元。(選填) |
| CAVV | 3D Secure 的 CAVV 欄位。最大長度為 28 個字元。(選填) |
| ORDER_DESC | 訂單描述說明，最大長度 18 位中文字。(選填) |
| PID | 持卡人之身分證字號，10 個字元。(選填) |
| TRV_DepartDay | 遞延撥款日，8 位數字日期代碼，僅於遞延特店代碼為空字串時，才可帶入空字串。(選填) |
| TRV_MerchantID | 下游商店代號，9 位文數字；若該特店有設定遞延特店代碼時，可帶入空字串。(選填) |
| TRV_Commission | 下游商店佣金，零或正整數，最多七位數。(選填) |

##### 回應
| 屬性名稱 | 說明 |
|---------|------|
| XID | 交易識別碼，最長為 40 個位元字串。 |
| AuthRRPID | SSL 授權交易之代碼，最長為 40 個位元字串。 |
| ResAmt | 授權金額。(已拆分成 currency、amount 及 exponent) |
| AuthCode | 交易授權碼，長度為 6 的字串。 |
| TermSeq | 調閱序號。 |
| RetrRef | 調閱編號。 |
| RespCode | 交易的執行狀態，為數字形態。(其中，0 表執行成功，其它各類狀態請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」) |
| ErrCode | 錯誤代碼，長度為 2 的字串，請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」。 |
| BatchClose | 此為保留欄位。 |
| Version | 取得訊息規格版本。 |
| SwRevision | 版本修訂日期。 |
| ErrorDesc | 錯誤訊息。 |


---

<a name="authRecurTransac"></a>
#### 信用卡分期付款授權作業(本服務視收單銀行是否提供)

```js
posapi.authRecurTransac(authRecur, callback)
```

##### 請求
> `authRecur`: **必填**，JSON 格式物件，欄位如下：

| 屬性名稱 | 說明 |
|---------|------|
| MERID | 為此交易商店於網路收單系統中的商店編號設定值，須經由收單銀行給予。 |
| LID-M | 為電子商場的應用程式所給予此筆交易的訂單編號，資料型態為最長 19 個字元字串。訂單編號僅接受一般英文字母、數字及底線的組合，不可出現其餘符號字元。 |
| PAN | 為信用卡號及卡片背面末三碼值(CVV2/CVC2)，最大長度 19 位數字。 |
| ExpDate | 為信用卡之有效期限，格式固定為六碼 YYYYMM。 |
| currency | 交易幣值代號。長度為 3 個字元的字串。(如台幣"901") |
| purchAmt | 為消費者此筆交易所購買商品欲授權總金額。 |
| exponent | 為幣值指數，新台幣為 0。(如美金 1.23 元，purchAmt 給 123 而 exponent 則給 -2) |
| ECI | 為電子商務交易安全等級。一般 VISA 卡與 JCB 卡 SSL 交易 eci 值須設定為 7，MasterCard 卡 SSL 交易 eci 值須設定為 0，3D Secure 交易則是收單銀行的作業規範。 |
| BIRTHDAY | 持卡人之出生年月日(格式 MMDDYYYY)，8 個字元。(選填) |
| CAVV | 3D Secure 的 CAVV 欄位。最大長度為 28 個字元。(選填) |
| ORDER_DESC | 訂單描述說明，最大長度 18 位中文字。(選填) |
| PID | 持卡人之身分證字號，10 個字元。(選填) |
| RECUR\_FREQ | 此為保留欄位，此欄位值必須設定為分期付款期數 recur_num。 |
| RECUR_END | 此為保留欄位，此欄位值必須設定為 20201231。 |
| RECUR_NUM | 分期付款交易使用，分期付款期數。此欄位的值需大於 0。 |
| TRV_DepartDay | 遞延撥款日，8 位數字日期代碼，僅於遞延特店代碼為空字串時，才可帶入空字串。(選填) |
| TRV_MerchantID | 下游商店代號，9 位文數字；若該特店有設定遞延特店代碼時，可帶入空字串。(選填) |
| TRV_Commission | 下游商店佣金，零或正整數，最多七位數。(選填) |

##### 回應
| 屬性名稱 | 說明 |
|---------|------|
| XID | 交易識別碼，最長為 40 個位元字串。 |
| AuthRRPID | SSL 授權交易之代碼，最長為 40 個位元字串。 |
| ResAmt | 授權金額。(已拆分成 currency、amount 及 exponent) |
| AuthCode | 交易授權碼，長度為 6 的字串。 |
| TermSeq | 調閱序號。 |
| RetrRef | 調閱編號。 |
| RespCode | 交易的執行狀態，為數字形態。(其中，0 表執行成功，其它各類狀態請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」) |
| ErrCode | 錯誤代碼，長度為 2 的字串，請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」。 |
| BatchClose | 此為保留欄位。 |
| Version | 取得訊息規格版本。 |
| SwRevision | 版本修訂日期。 |
| ErrorDesc | 錯誤訊息。 |


---

<a name="redeemTransac"></a>
#### 信用卡紅利付款授權作業(本服務視收單銀行是否提供)

```js
posapi.redeemTransac(redeem, callback)
```

##### 請求
> `redeem`: **必填**，JSON 格式物件，欄位如下：

| 屬性名稱 | 說明 |
|---------|------|
| MERID | 為此交易商店於網路收單系統中的商店編號設定值，須經由收單銀行給予。 |
| LID-M | 為電子商場的應用程式所給予此筆交易的訂單編號，資料型態為最長 19 個字元字串。訂單編號字串僅接受一般英文字母、數字及底線的組合，不可出現其餘符號字元。 |
| PAN | 為信用卡號及卡片背面末三碼值(CVV2/CVC2)，最大長度 19 位數字。 |
| ExpDate | 為信用卡之有效期限，格式固定為六碼 YYYYMM。 |
| currency | 交易幣值代號。長度為 3 個字元的字串。(如台幣"901") |
| purchAmt | 為消費者此筆交易所購買商品欲授權總金額。 |
| exponent | 為幣值指數，新台幣為 0。(如美金 1.23 元，purchAmt 給 123 而 exponent 則給 -2) |
| ECI | 為電子商務交易安全等級。一般 VISA 卡與 JCB 卡 SSL 交易 eci 值須設定為 7，MasterCard 卡 SSL 交易 eci 值須設定為 0，3D Secure 交易則是收單銀行的作業規範。 |
| BIRTHDAY | 持卡人之出生年月日(格式 MMDDYYYY)，8 個字元。(選填) |
| CAVV | 3D Secure 的 CAVV 欄欄位。最大長度為 28 個字元。(選填) |
| ORDER_DESC | 訂單描述說明，最大長度 18 位中文字。(選填) |
| PID | 持卡人之身分證字號，10 個字元。(選填) |
| PRODCODE | 產品碼。由銀行提供的兩位數字字串。 |
| TRV_DepartDay | 遞延撥款日，8 位數字日期代碼，僅於遞延特店代碼為空字串時，才可帶入空字串。(選填) |
| TRV_MerchantID | 下游商店代號，9 位文數字；若該特店有設定遞延特店代碼時，可帶入空字串。(選填) |
| TRV_Commission | 下游商店佣金，零或正整數，最多七位數。(選填) |

##### 回應
| 屬性名稱 | 說明 |
|---------|------|
| XID | 交易識別碼，最長為 40 個位元字串。 |
| AuthRRPID | SSL 授權交易之代碼，最長為 40 個位元字串。 |
| ResAmt | 授權金額。(已拆分成 currency、amount 及 exponent) |
| AuthCode | 交易授權碼，長度為 6 的字串。 |
| TermSeq | 調閱序號。 |
| RetrRef | 調閱編號。 |
| RespCode | 交易的執行狀態，為數字形態。(其中，0 表執行成功，其它各類狀態請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」) |
| ErrCode | 錯誤代碼，長度為 2 的字串，請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」。 |
| BatchID | 批次編號。 |
| BatchSeq | 批次序號。 |
| ProdCode | 產品代碼，格式為固定兩碼數字。 |
| OffsetAmt | 折抵金額。 |
| OriginalAmt | 原始訂單金額。 |
| UtilizedPoint | 本次兌換點數，格式為正整數。 |
| AwardedPoint | 本次賺取點數，格式為正整數。 |
| PointBalance | 目前點數餘額，格式為整數。 |
| BatchClose | 此為保留欄位。 |
| Version | 取得訊息規格版本。 |
| SwRevision | 版本修訂日期。 |
| ErrorDesc | 錯誤訊息。 |


---

<a name="authRevTransac"></a>
#### 取消信用卡授權作業(即取消訂單)

```js
posapi.authRevTransac(authRev, callback)
```

##### 請求
> `authRev`: **必填**，JSON 格式物件，欄位如下：

| 屬性名稱 | 說明 |
|---------|------|
| MERID | 為此交易商店於網路收單系統中的商店編號設定值，須經由收單銀行給予。 |
| XID | 交易識別碼，最長為 40 個位元字串。 |
| AuthRRPID | SSL 授權交易之代碼，最長為 40 個位元字串。 |
| currency | 交易幣值代號。長度為 3 個字元的字串。(如台幣"901") |
| orgAmt | 原授權金額。 |
| authnewAmt | 重新設定授權金額，0 表示取消此筆授權訂單，此為整數型態。 |
| exponent | 為幣值指數，新台幣為 0。(如美金 1.23 元，purchAmt 給 123 而 exponent 則給 -2) |
| AuthCode | 交易授權碼，長度為 6 的字串。 |
| TermSeq | 調閱序號。 |

##### 回應
| 屬性名稱 | 說明 |
|---------|------|
| RespCode | 交易的執行狀態，為數字形態。(其中，0 表執行成功，其它各類狀態請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」) |
| ErrCode | 錯誤代碼，長度為 2 的字串，請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」。 |
| ResAmt | 授權金額。(已拆分成 currency、amount 及 exponent) |
| TermSeq | 調閱序號。 |
| RetrRef | 調閱編號。 |
| BatchClose | 此為保留欄位。 |
| Version | 取得訊息規格版本。 |
| SwRevision | 版本修訂日期。 |
| ErrorDesc | 錯誤訊息。 |


---

<a name="capTransac"></a>
#### 信用卡請款作業

```js
posapi.capTransac(cap, callback)
```

##### 請求
> `cap`: **必填**，JSON 格式物件，欄位如下：

| 屬性名稱 | 說明 |
|---------|------|
| MERID | 為此交易商店於網路收單系統中的商店編號設定值，須經由收單銀行給予。 |
| XID | 交易識別碼，最長為 40 個位元字串。 |
| AuthRRPID | SSL 授權交易之代碼，最長為 40 個位元字串。 |
| currency | 交易幣值代號。長度為 3 個字元的字串。(如台幣"901") |
| orgAmt | 原授權金額。 |
| capAmt | 轉入請款金額。 |
| exponent | 為幣值指數，新台幣為 0。(如美金 1.23 元，purchAmt 給 123 而 exponent 則給 -2) |
| AuthCode | 交易授權碼，長度為 6 的字串。 |
| TermSeq | 調閱序號。 |
| TRV_DepartDay | 遞延撥款日，8 位數字日期代碼，僅於遞延特店代碼為空字串時，才可帶入空字串。(選填) |
| TRV_MerchantID | 下游商店代號，9 位文數字；若該特店有設定遞延特店代碼時，可帶入空字串。(選填) |
| TRV_Commission | 下游商店佣金，零或正整數，最多七位數。(選填) |

##### 回應
| 屬性名稱 | 說明 |
|---------|------|
| RespCode | 交易的執行狀態，為數字形態。(其中，0 表執行成功，其它各類狀態請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」) |
| ErrCode | 錯誤代碼，長度為 2 的字串，請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」。 |
| ResAmt | 授權金額。(已拆分成 currency、amount 及 exponent) |
| BatchID | 批次編號。 |
| RetrRef | 調閱編號。 |
| BatchSeq | 批次序號。 |
| BatchClose | 此為保留欄位。 |
| Version | 取得訊息規格版本。 |
| SwRevision | 版本修訂日期。 |
| ErrorDesc | 錯誤訊息。 |


---

<a name="capRevTransac"></a>
#### 取消信用卡請款作業

```js
posapi.capRevTransac(capRev, callback)
```

##### 請求
> `capRev`: **必填**，JSON 格式物件，欄位如下：

| 屬性名稱 | 說明 |
|---------|------|
| MERID | 為此交易商店於網路收單系統中的商店編號設定值，須經由收單銀行給予。 |
| XID | 交易識別碼，最長為 40 個位元字串。 |
| AuthRRPID | SSL 授權交易之代碼，最長為 40 個位元字串。 |
| currency | 交易幣值代號。長度為 3 個字元的字串。(如台幣"901") |
| orgAmt | 原授權金額。 |
| exponent | 為幣值指數，新台幣為 0。(如美金 1.23 元，purchAmt 給 123 而 exponent 則給 -2) |
| AuthCode | 交易授權碼，長度為 6 的字串。 |
| TermSeq | 調閱序號。 |
| BatchID | 請款之批次編號。 |
| BatchSeq | 請款之批次序號。 |

##### 回應
| 屬性名稱 | 說明 |
|---------|------|
| RespCode | 交易的執行狀態，為數字形態。(其中，0 表執行成功，其它各類狀態請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」) |
| ErrCode | 錯誤代碼，長度為 2 的字串，請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」。 |
| ResAmt | 授權金額。(已拆分成 currency、amount 及 exponent) |
| RetrRef | 調閱編號。 |
| BatchClose | 此為保留欄位。 |
| Version | 取得訊息規格版本。 |
| SwRevision | 版本修訂日期。 |
| ErrorDesc | 錯誤訊息。 |


---

<a name="credTransac"></a>
#### 退款作業

```js
posapi.credTransac(cred, callback)
```

##### 請求
> `cred`: **必填**，JSON 格式物件，欄位如下：

| 屬性名稱 | 說明 |
|---------|------|
| MERID | 為此交易商店於網路收單系統中的商店編號設定值，須經由收單銀行給予。 |
| XID | 交易識別碼，最長為 40 個位元字串。 |
| AuthRRPID | SSL 授權交易之代碼，最長為 40 個位元字串。 |
| currency | 交易幣值代號。長度為 3 個字元的字串。(如台幣"901") |
| orgAmt | 原授權金額。 |
| credAmt | 退款金額。 |
| exponent | 為幣值指數，新台幣為 0。(如美金 1.23 元，purchAmt 給 123 而 exponent 則給 -2) |
| AuthCode | 交易授權碼，長度為 6 的字串。 |
| CapBatchID | 請款交易批次編號。 |
| CapBatchSeq | 請款交易批次序號。 |
| TRV_DepartDay | 遞延撥款日，8 位數字日期代碼，僅於遞延特店代碼為空字串時，才可帶入空字串。(選填) |
| TRV_MerchantID | 下游商店代號，9 位文數字；若該特店有設定遞延特店代碼時，可帶入空字串。(選填) |
| TRV_Commission | 下游商店佣金，零或正整數，最多七位數。(選填) |

##### 回應
| 屬性名稱 | 說明 |
|---------|------|
| RespCode | 交易的執行狀態，為數字形態。(其中，0 表執行成功，其它各類狀態請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」) |
| ErrCode | 錯誤代碼，長度為 2 的字串，請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」。 |
| ResAmt | 授權金額。(已拆分成 currency、amount 及 exponent) |
| BatchID | 批次編號。 |
| RetrRef | 調閱編號。 |
| BatchSeq | 批次序號。 |
| BatchClose | 此為保留欄位。 |
| Version | 取得訊息規格版本。 |
| SwRevision | 版本修訂日期。 |
| ErrorDesc | 錯誤訊息。 |


---

<a name="credRevTransac"></a>
#### 取消退款作業

```js
posapi.credRevTransac(credRev, callback)
```

##### 請求
> `credRev`: **必填**，JSON 格式物件，欄位如下：

| 屬性名稱 | 說明 |
|---------|------|
| MERID | 為此交易商店於網路收單系統中的商店編號設定值，須經由收單銀行給予。 |
| XID | 交易識別碼，最長為 40 個位元字串。 |
| AuthRRPID | SSL 授權交易之代碼，最長為 40 個位元字串。 |
| currency | 交易幣值代號。長度為 3 個字元的字串。(如台幣"901") |
| orgAmt | 原授權金額。 |
| exponent | 為幣值指數，新台幣為 0。(如美金 1.23 元，purchAmt 給 123 而 exponent 則給 -2) |
| AuthCode | 交易授權碼，長度為 6 的字串。 |
| CredBatchID | 請款交易批次編號。 |
| CredBatchSeq | 請款交易批次序號。 |

##### 回應
| 屬性名稱 | 說明 |
|---------|------|
| RespCode | 交易的執行狀態，為數字形態。(其中，0 表執行成功，其它各類狀態請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」) |
| ErrCode | 錯誤代碼，長度為 2 的字串，請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」。 |
| ResAmt | 授權金額。(已拆分成 currency、amount 及 exponent) |
| RetrRef | 調閱編號。 |
| BatchClose | 此為保留欄位。 |
| Version | 取得訊息規格版本。 |
| SwRevision | 版本修訂日期。 |
| ErrorDesc | 錯誤訊息。 |


---

<a name="inquiryTransac"></a>
#### 單筆訂單狀態查詢

```js
posapi.inquiryTransac(inquiry, callback)
```

##### 請求
> `inquiry`: **必填**，JSON 格式物件，欄位如下：

| 屬性名稱 | 說明 |
|---------|------|
| TX_ATTRIBUTE | 交易型別：<br />"TX_AUTH" 表一次付清<br />"TX_INSTMT_AUTH" 表網路分期<br />"TX_REDEEM_AUTH" 表紅利交易 |
| MERID | 為此交易商店於網路收單系統中的商店編號設定值，須經由收單銀行給予。|
| LID-M | 為電子商場的應用程式所給予此筆交易的訂單編號，資料型態為最長 19 個字元字串。訂單編號字串僅接受一般英文字母、數字及底線的組合，不可出現其餘符號字元。|
| XID | 交易識別碼，最長為 40 個位元字串。|
| PAN | 為信用卡號及卡片背面末三碼值(CVV2/CVC2)，最大長度 19 位數字。|
| currency | 交易幣值代號。長度為 3 個字元的字串。(如台幣"901")|
| purchAmt | 為消費者此筆交易所購買商品欲授權總金額。|
| RECUR_NUM | 當 TX_ATTRIBUTE = "TX_INSTMT_AUTH" 時，必須設定此分期付款期數；其他交易型別則必須設定為 0。最長長度為 2。|
| PRODCODE | 當 TX_ATTRIBUTE = "TX_REDEEM_AUTH" 時，必須設定此產品代碼；其他交易型別則必須設定為空字串""。長度為 2。|


##### 回應
| 屬性名稱 | 說明 |
|---------|------|
| SSL-TYPE | SSL_INQUIRY。 |
| TX_ATTRIBUTE | 交易型別。<br />"TX_AUTH"：表一次付清<br />"TX_INSTMT_AUTH"：表網路分期<br />"TX_REDEEM_AUTH"：表紅利交易 |
| QueryCode | 訂單查詢的結果。<br />0：表找不到符合條件的訂單<br />1：表查詢成功(唯一一筆資料)<br />2：表查詢成功(多筆符合條件，僅顯示交易時間最後一筆的授權資料，建議採用 xid 查詢) |
| LID-M | 訂單編號。 |
| XID | 授權交易的識別碼。 |
| PAN | 信用卡卡號。 |
| ECI | 電子商務交易安全等級。 |
| AuthAmt | 訂單授權的金額。(已拆分成 currency、amount 及 exponent) |
| RespCode | 交易的執行狀態，為數字形態。(其中，0 表執行成功，其它各類狀態請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」) |
| ErrCode | 錯誤代碼，長度為 2 的字串，請參閱官方手冊附錄二「API 交易狀態的錯誤回傳值」。 |
| AuthCode | 交易授權碼，最大長度為 6 的字串。 |
| TermSeq | 調閱序號。 |
| RetrRef | 調閱編號。 |
| CurrentState | 在查詢時的交易狀態。<br />-1：授權失敗<br />0：訂單已取消<br />1：授權成功<br />10：已請款<br />11：已請款(請款結帳中)<br />12：已請款(請款成功)<br />13：已請款(請款失敗)<br />20：已退款<br />21：已退款(退款結帳中)<br />22：已退款(退款成功)<br />23：已退款(退款失敗) |
| BatchID | 交易批次編號。(TX_ATTRIBUTE = "TX_REDEEM_AUTH") |
| BatchSeq | 交易批次序號。(TX_ATTRIBUTE = "TX_REDEEM_AUTH") |
| OffsetAmt | 折抵金額。(TX_ATTRIBUTE = "TX_REDEEM_AUTH") |
| OriginalAmt | 原始消費金額。(TX_ATTRIBUTE = "TX_REDEEM_AUTH") |
| UtilizedPoint | 本次兌換點數。(TX_ATTRIBUTE = "TX_REDEEM_AUTH") |
| AwardedPoint | 本次賺取點數。(TX_ATTRIBUTE = "TX_REDEEM_AUTH") |
| PointBalance | 目前點數餘額。(TX_ATTRIBUTE = "TX_REDEEM_AUTH") |
| Version | 取得訊息規格版本。 |
| SwRevision | 版本修訂日期。 |
| ErrorDesc | 錯誤訊息。 |


---

#### Callback

所有 API 呼叫皆會回傳 2 個參數，請參考以下範例：

```js
function callback (err, response) {
    if (err) {
        console.dir(err);
    } else {
        console.dir(response);
    }
}
```

### License

Copyright © 2014 Calvert
