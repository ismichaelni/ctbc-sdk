/**
 * @author Calvert Yang
 */
(function() {
  var POSAPI = function() {
    var utility = require('./Utility')();
    var tls = require('tls');
    var iconv = require('iconv-lite');

    /**
     * 交易伺服器參數
     *
     * @private
     */
    var _options = {};
    var _initialized = false;

    /**
     * 初始化連線參數
     *
     * @param {Object} options - 欲連接之交易伺服器參數
     */
    var initialize = function initialize (options) {
      if (!options.host || !options.port || !options.servername || !options.ca) {
        throw 'Required parameter missing.';
      }

      _options = {
        host:options.host,
        port: options.port,
        rejectUnauthorized: false,
        servername: options.servername,
        ca: options.ca
      };
      _initialized = true;
    };

    /**
     * 檢查模組是否已初始化
     */
    var isInitialized = function isInitialized () {
      if (!_initialized) {
        throw 'Please init before calling any POS API';
      }
    };

    /**
     * 信用卡授權交易
     *
     * @param {Object} auth - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var authTransac = function authTransac (auth, callback) {
      var isTravel = false;

      // Check required parameter
      if (!auth['MERID'] || !auth['LID-M'] || !auth['PAN'] || !auth['ExpDate'] || !auth['currency'] || !auth['purchAmt'] || !auth['exponent'] || !auth['ECI']) {
        return callback({ code: '', msg: 'Required parameter missing.' }, null);
      }

      // Handle optional parameter
      if (!auth['BIRTHDAY']) auth['BIRTHDAY'] = '';
      if (!auth['CAVV']) auth['CAVV'] = '';
      if (!auth['ORDER_DESC']) auth['ORDER_DESC'] = '';
      if (!auth['PID']) auth['PID'] = '';
      if (!auth['TRV_DepartDay']) auth['TRV_DepartDay'] = '';
      if (!auth['TRV_MerchantID']) auth['TRV_MerchantID'] = '';
      if (!auth['TRV_Commission']) auth['TRV_Commission'] = '';

      if ((auth.TRV_DepartDay !== '') || (auth.TRV_MerchantID !== '') || (auth.TRV_Commission !== '')) {
        isTravel = true;
      }

      var chkres = utility.checkMerID(auth['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkLidm(auth['LID-M']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPan(auth['PAN']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExpDate(auth['ExpDate']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCurrency(auth['currency']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPurchAmt(auth['purchAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExponent(auth['exponent']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkECI(auth['ECI']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCAVV(auth['CAVV']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkBirthday(auth['BIRTHDAY']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkOrderDesc(auth['ORDER_DESC']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPID(auth['PID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      if (isTravel) {
        chkres = utility.checkTravDD(auth['TRV_DepartDay']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravMID(auth['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravCom(auth['TRV_Commission'], auth['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }
      }

      var data = 'SSL-TYPE: SSL_AUTH\r\n' +
                 'MERID: ' + auth['MERID'] + '\r\n' +
                 'LID-M: ' + auth['LID-M'] + '\r\n' +
                 'PAN: ' + auth['PAN'] + '\r\n' +
                 'ExpDate: ' + auth['ExpDate'] + '\r\n' +
                 'AuthAmt: ' + auth['currency'] + ' ' + auth['purchAmt'] + ' ' + auth['exponent'] + '\r\n' +
                 'PurchAmt: ' + auth['currency'] + ' ' + auth['purchAmt'] + ' ' + auth['exponent'] + '\r\n' +
                 'ECI: ' + auth['ECI'] + '\r\n' +
                 'CAVV: ' + auth['CAVV'] + '\r\n' +
                 'PID: ' + auth['PID'] + '\r\n' +
                 'ORDER_DESC: ' + auth['ORDER_DESC'] + '\r\n' +
                 'RECUR_FREQ: ' + '0\r\n' +
                 'RECUR_END: ' + ' \r\n' +
                 'RECUR_NUM: ' + '0\r\n' +
                 'BIRTHDAY: ' + auth['BIRTHDAY'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';

      if (isTravel) {
        data += 'TRV_DepartDay: ' + auth['TRV_DepartDay'] + '\r\n' +
                'TRV_MerchantID: ' + auth['TRV_MerchantID'] + '\r\n' +
                'TRV_Commission: ' + auth['TRV_Commission'] + '\r\n';
      }

      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 信用卡分期授權交易
     *
     * @param {Object} authRecur - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var authRecurTransac = function authRecurTransac (authRecur, callback) {
      var isTravel = false;

      // Check required parameter
      if (!authRecur['MERID'] || !authRecur['LID-M'] || !authRecur['PAN'] || !authRecur['ExpDate'] || !authRecur['currency'] || !authRecur['purchAmt'] || !authRecur['exponent'] || !authRecur['ECI'] || !authRecur['RECUR_FREQ'] || !authRecur['RECUR_END'] || !authRecur['RECUR_NUM']) {
        return callback({ code: '', msg: 'Required parameter missing.' }, null);
      }

      // Handle optional parameter
      if (!authRecur['BIRTHDAY']) authRecur['BIRTHDAY'] = '';
      if (!authRecur['CAVV']) authRecur['CAVV'] = '';
      if (!authRecur['ORDER_DESC']) authRecur['ORDER_DESC'] = '';
      if (!authRecur['PID']) authRecur['PID'] = '';
      if (!authRecur['TRV_DepartDay']) authRecur['TRV_DepartDay'] = '';
      if (!authRecur['TRV_MerchantID']) authRecur['TRV_MerchantID'] = '';
      if (!authRecur['TRV_Commission']) authRecur['TRV_Commission'] = '';

      if ((authRecur['TRV_DepartDay'] !== '') || (authRecur['TRV_MerchantID'] !== '') || (authRecur['TRV_Commission'] !== '')) {
        isTravel = true;
      }

      var chkres = utility.checkMerID(authRecur['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkLidm(authRecur['LID-M']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPan(authRecur['PAN']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExpDate(authRecur['ExpDate']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCurrency(authRecur['currency']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPurchAmt(authRecur['purchAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExponent(authRecur['exponent']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkECI(authRecur['ECI']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCAVV(authRecur['CAVV']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkRecurNum(authRecur['RECUR_NUM']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkRecurFreq(authRecur['RECUR_FREQ']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkRecurEnd(authRecur['RECUR_END']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkBirthday(authRecur['BIRTHDAY']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkOrderDesc(authRecur['ORDER_DESC']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPID(authRecur['PID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      if (isTravel) {
        chkres = utility.checkTravDD(authRecur['TRV_DepartDay']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravMID(authRecur['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravCom(authRecur['TRV_Commission'], authRecur['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }
      }

      var data = 'SSL-TYPE: SSL_AUTH\r\n' +
                 'MERID: ' + authRecur['MERID'] + '\r\n' +
                 'LID-M: ' + authRecur['LID-M'] + '\r\n' +
                 'PAN: ' + authRecur['PAN'] + '\r\n' +
                 'ExpDate: ' + authRecur['ExpDate'] + '\r\n' +
                 'AuthAmt: ' + authRecur['currency'] + ' ' + authRecur['purchAmt'] + ' ' + authRecur['exponent'] + '\r\n' +
                 'PurchAmt: ' + authRecur['currency'] + ' ' + authRecur['purchAmt'] + ' ' + authRecur['exponent'] + '\r\n' +
                 'ECI: ' + authRecur['ECI'] + '\r\n' +
                 'CAVV: ' + authRecur['CAVV'] + '\r\n' +
                 'PID: ' + authRecur['PID'] + '\r\n' +
                 'ORDER_DESC: ' + authRecur['ORDER_DESC'] + '\r\n' +
                 'RECUR_FREQ: ' + authRecur['RECUR_FREQ'] + '\r\n' +
                 'RECUR_END: ' + authRecur['RECUR_END'] + '\r\n' +
                 'RECUR_NUM: ' + authRecur['RECUR_NUM'] + '\r\n' +
                 'BIRTHDAY: ' + authRecur['BIRTHDAY'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';

      if (isTravel) {
        data += 'TRV_DepartDay: ' + authRecur['TRV_DepartDay'] + '\r\n' +
                'TRV_MerchantID: ' + authRecur['TRV_MerchantID'] + '\r\n' +
                'TRV_Commission: ' + authRecur['TRV_Commission'] + '\r\n';
      }

      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 信用卡紅利折抵授權交易
     *
     * @param {Object} redeem - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var redeemTransac = function redeemTransac (redeem, callback) {
      var isTravel = false;

      // Check required parameter
      if (!redeem['MERID'] || !redeem['LID-M'] || !redeem['PAN'] || !redeem['ExpDate'] || !redeem['currency'] || !redeem['purchAmt'] || !redeem['exponent'] || !redeem['ECI'] || !redeem['PRODCODE']) {
        return callback({ code: '', msg: 'Required parameter missing.' }, null);
      }

      // Handle optional parameter
      if (!redeem['BIRTHDAY']) redeem['BIRTHDAY'] = '';
      if (!redeem['CAVV']) redeem['CAVV'] = '';
      if (!redeem['ORDER_DESC']) redeem['ORDER_DESC'] = '';
      if (!redeem['PID']) redeem['PID'] = '';
      if (!redeem['TRV_DepartDay']) redeem['TRV_DepartDay'] = '';
      if (!redeem['TRV_MerchantID']) redeem['TRV_MerchantID'] = '';
      if (!redeem['TRV_Commission']) redeem['TRV_Commission'] = '';

      if ((redeem['TRV_DepartDay'] !== '') || (redeem['TRV_MerchantID'] !== '') || (redeem['TRV_Commission'] !== '')) {
        isTravel = true;
      }

      var chkres = utility.checkMerID(redeem['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkLidm(redeem['LID-M']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPan(redeem['PAN']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExpDate(redeem['ExpDate']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCurrency(redeem['currency']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPurchAmt(redeem['purchAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExponent(redeem['exponent']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkECI(redeem['ECI']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCAVV(redeem['CAVV']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkProdCode(redeem['PRODCODE']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkBirthday(redeem['BIRTHDAY']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkOrderDesc(redeem['ORDER_DESC']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPID(redeem['PID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      if (isTravel) {
        chkres = utility.checkTravDD(redeem['TRV_DepartDay']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravMID(redeem['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravCom(redeem['TRV_Commission'], redeem['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }
      }

      var data = 'SSL-TYPE: SSL_REDEEM\r\n' +
                 'MERID: ' + redeem['MERID'] + '\r\n' +
                 'LID-M: ' + redeem['LID-M'] + '\r\n' +
                 'PAN: ' + redeem['PAN'] + '\r\n' +
                 'ExpDate: ' + redeem['ExpDate'] + '\r\n' +
                 'AuthAmt: ' + redeem['currency'] + ' ' + redeem['purchAmt'] + ' ' + redeem['exponent'] + '\r\n' +
                 'PurchAmt: ' + redeem['currency'] + ' ' + redeem['purchAmt'] + ' ' + redeem['exponent'] + '\r\n' +
                 'ECI: ' + redeem['ECI'] + '\r\n' +
                 'CAVV: ' + redeem['CAVV'] + '\r\n' +
                 'PID: ' + redeem['PID'] + '\r\n' +
                 'ORDER_DESC: ' + redeem['ORDER_DESC'] + '\r\n' +
                 'BIRTHDAY: ' + redeem['BIRTHDAY'] + '\r\n' +
                 'PRODCODE: ' + redeem['PRODCODE'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';
      if (isTravel) {
        data += 'TRV_DepartDay: ' + redeem['TRV_DepartDay'] + '\r\n' +
                'TRV_MerchantID: ' + redeem['TRV_MerchantID'] + '\r\n' +
                'TRV_Commission: ' + redeem['TRV_Commission'] + '\r\n';
      }
      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 取消授權交易(一般、分期和紅利的授權交易皆適用)
     *
     * @param {Object} authRev - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var authRevTransac = function authRevTransac (authRev, callback) {
      // Check required parameter
      if (!authRev['MERID'] || !authRev['XID'] || !authRev['AuthRRPID'] || !authRev['currency'] || !authRev['orgAmt'] || !authRev['authnewAmt'] || !authRev['exponent'] || !authRev['AuthCode'] || !authRev['TermSeq']) {
        return callback({ code: '', msg: 'Required parameter missing.' }, null);
      }

      var chkres = utility.checkMerID(authRev['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkXID(authRev['XID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCurrency(authRev['currency']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkOrgAmt(authRev['orgAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExponent(authRev['exponent']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkAuthCode(authRev['AuthCode']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkAuthRRPID(authRev['AuthRRPID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkTermSeq(authRev['TermSeq']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      var data = 'SSL-TYPE: SSL_AUTHREV\r\n' +
                 'MERID: ' + authRev['MERID'] + '\r\n' +
                 'XID: ' + authRev['XID'] + '\r\n' +
                 'AuthRRPID: ' + authRev['AuthRRPID'] + '\r\n' +
                 'OrgAmt: ' + authRev['currency'] + ' ' + authRev['orgAmt'] + ' ' + authRev['exponent'] + '\r\n' +
                 'AuthNewAmt: ' + authRev['currency'] + ' ' + authRev['authnewAmt'] + ' ' + authRev['exponent'] + '\r\n' +
                 'AuthCode: ' + authRev['AuthCode'] + '\r\n' +
                 'TermSeq: ' + authRev['TermSeq'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';
      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 隱藏功能，用途不明
     *
     * @param {Object} batchClose - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var batchCloseTransac = function batchCloseTransac (batchClose, callback) {
      // Check required parameter
      if (!batchClose['MERID']) {
        return callback({ code: '', msg: 'Required parameter missing.' }, null);
      }

      var chkres = utility.checkMerID(batchClose['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      var data = 'SSL-TYPE: SSL_BATCHCLOSE\r\n' +
                 'MERID: ' + batchClose['MERID'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';
      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 交易進入請款動作
     *
     * @param {Object} cap - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var capTransac = function capTransac (cap, callback) {
      var isTravel = false;

      // Check required parameter
      if (!cap['MERID'] || !cap['XID'] || !cap['AuthRRPID'] || !cap['currency'] || !cap['orgAmt'] || !cap['capAmt'] || !cap['exponent'] || !cap['AuthCode'] || !cap['TermSeq']) {
        return callback({ code: '', msg: 'Required parameter missing.' }, null);
      }

      // Handle optional parameter
      if (!cap['TRV_DepartDay']) cap['TRV_DepartDay'] = '';
      if (!cap['TRV_MerchantID']) cap['TRV_MerchantID'] = '';
      if (!cap['TRV_Commission']) cap['TRV_Commission'] = '';

      if ((cap['TRV_DepartDay'] !== '') || (cap['TRV_MerchantID'] !== '') || (cap['TRV_Commission'] !== '')) {
        isTravel = true;
      }

      chkres = utility.checkMerID(cap['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkXID(cap['XID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkAuthRRPID(cap['AuthRRPID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkAuthCode(cap['AuthCode']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkTermSeq(cap['TermSeq']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCurrency(cap['currency']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExponent(cap['exponent']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPurchAmt(cap['capAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkOrgAmt(cap['orgAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      if (isTravel) {
        chkres = utility.checkTravDD(cap['TRV_DepartDay']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravMID(cap['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravCom(cap['TRV_Commission'], cap['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }
      }

      var data = 'SSL-TYPE: SSL_CAP\r\n' +
                 'MERID: ' + cap['MERID'] + '\r\n' +
                 'XID: ' + cap['XID'] + '\r\n' +
                 'AuthRRPID: ' + cap['AuthRRPID'] + '\r\n' +
                 'OrgAmt: ' + cap['currency'] + ' ' + cap['orgAmt'] + ' ' + cap['exponent'] + '\r\n' +
                 'CapAmt: ' + cap['currency'] + ' ' + cap['capAmt'] + ' ' + cap['exponent'] + '\r\n' +
                 'TermSeq: ' + cap['TermSeq'] + '\r\n' +
                 'AuthCode: ' + cap['AuthCode'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';

      if (isTravel) {
        data += 'TRV_DepartDay: ' + cap['TRV_DepartDay'] + '\r\n' +
                'TRV_MerchantID: ' + cap['TRV_MerchantID'] + '\r\n' +
                'TRV_Commission: ' + cap['TRV_Commission'] + '\r\n';
      }

      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 取消轉入請款的動作
     *
     * @param {Object} capRev - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var capRevTransac = function capRevTransac (capRev, callback) {
      // Check required parameter
      if (!capRev['MERID'] || !capRev['XID'] || !capRev['AuthRRPID'] || !capRev['currency'] || !capRev['orgAmt'] || !capRev['exponent'] || !capRev['AuthCode'] || !capRev['TermSeq'] || !capRev['BatchID'] || !capRev['BatchSeq']) {
        return callback({ code: '', msg: 'Required parameter missing.' }, null);
      }

      var chkres = utility.checkMerID(capRev['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkXID(capRev['XID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkAuthRRPID(capRev['AuthRRPID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkAuthCode(capRev['AuthCode']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkTermSeq(capRev['TermSeq']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCurrency(capRev['currency']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExponent(capRev['exponent']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkOrgAmt(capRev['orgAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkBatchID(capRev['BatchID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkBatchSeq(capRev['BatchSeq']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      var data = 'SSL-TYPE: SSL_CAPREV\r\n' +
                 'MERID: ' + capRev['MERID'] + '\r\n' +
                 'XID: ' + capRev['XID'] + '\r\n' +
                 'AuthRRPID: ' + capRev['AuthRRPID'] + '\r\n' +
                 'OrgAmt: ' + capRev['currency'] + ' ' + capRev['orgAmt'] + ' ' + capRev['exponent'] + '\r\n' +
                 'CapRevAmt: ' + capRev['currency'] + ' ' + '0' + ' ' + capRev['exponent'] + '\r\n' +
                 'TermSeq: ' + capRev['TermSeq'] + '\r\n' +
                 'BatchID: ' + capRev['BatchID'] + '\r\n' +
                 'BatchSeq: ' + capRev['BatchSeq'] + '\r\n' +
                 'AuthCode: ' + capRev['AuthCode'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';
      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 進行退款動作
     *
     * @param {Object} capRev - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var credTransac = function credTransac (cred, callback) {
      var isTravel = false;

      // Check required parameter
      if (!cred['MERID'] || !cred['XID'] || !cred['AuthRRPID'] || !cred['currency'] || !cred['orgAmt'] || !cred['credAmt'] || !cred['exponent'] || !cred['AuthCode'] || !cred['CapBatchID'] || !cred['CapBatchSeq']) {
        return callback({ code: '', msg: 'Required parameter missing.' }, null);
      }

      // Handle optional parameter
      if (!cred['TRV_DepartDay']) cred['TRV_DepartDay'] = '';
      if (!cred['TRV_MerchantID']) cred['TRV_MerchantID'] = '';
      if (!cred['TRV_Commission']) cred['TRV_Commission'] = '';

      if ((cred['TRV_DepartDay'] !== '') || (cred['TRV_MerchantID'] !== '') || (cred['TRV_Commission'] !== '')) {
        isTravel = true;
      }

      chkres = utility.checkMerID(cred['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkXID(cred['XID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkAuthRRPID(cred['AuthRRPID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkAuthCode(cred['AuthCode']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCurrency(cred['currency']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExponent(cred['exponent']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPurchAmt(cred['credAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkOrgAmt(cred['orgAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkBatchID(cred['CapBatchID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkBatchSeq(cred['CapBatchSeq']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      if (isTravel) {
        chkres = utility.checkTravDD(cred['TRV_DepartDay']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravMID(cred['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravCom(cred['TRV_Commission'], cred['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }
      }

      var data = 'SSL-TYPE: SSL_CRED\r\n' +
                 'MERID: ' + cred['MERID'] + '\r\n' +
                 'XID: ' + cred['XID'] + '\r\n' +
                 'AuthRRPID: ' + cred['AuthRRPID'] + '\r\n' +
                 'OrgAmt: ' + cred['currency'] + ' ' + cred['orgAmt'] + ' ' + cred['exponent'] + '\r\n' +
                 'CredAmt: ' + cred['currency'] + ' ' + cred['credAmt'] + ' ' + cred['exponent'] + '\r\n' +
                 'CapBatchID: ' + cred['CapBatchID'] + '\r\n' +
                 'CapBatchSeq: ' + cred['CapBatchSeq'] + '\r\n' +
                 'AuthCode: ' + cred['AuthCode'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';

      if (isTravel) {
        data += 'TRV_DepartDay: ' + cred['TRV_DepartDay'] + '\r\n' +
                'TRV_MerchantID: ' + cred['TRV_MerchantID'] + '\r\n' +
                'TRV_Commission: ' + cred['TRV_Commission'] + '\r\n';
      }

      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 進行取消退款動作
     *
     * @param {Object} capRev - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var credRevTransac = function credRevTransac (credRev, callback) {
      // Check required parameter
      if (!credRev['MERID'] || !credRev['XID'] || !credRev['AuthRRPID'] || !credRev['currency'] || !credRev['orgAmt'] || !credRev['exponent'] || !credRev['AuthCode'] || !credRev['CredBatchID'] || !credRev['CredBatchSeq']) {
        return callback({ code: '', msg: 'Required parameter missing.' }, null);
      }

      var chkres = utility.checkMerID(credRev['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkXID(credRev['XID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkAuthRRPID(credRev['AuthRRPID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkAuthCode(credRev['AuthCode']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCurrency(credRev['currency']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExponent(credRev['exponent']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkOrgAmt(credRev['orgAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkBatchID(credRev['CredBatchID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkBatchSeq(credRev['CredBatchSeq']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      var data = 'SSL-TYPE: SSL_CREDREV\r\n' +
                 'MERID: ' + credRev['MERID'] + '\r\n' +
                 'XID: ' + credRev['XID'] + '\r\n' +
                 'AuthRRPID: ' + credRev['AuthRRPID'] + '\r\n' +
                 'OrgAmt: ' + credRev['currency'] + ' ' + credRev['orgAmt'] + ' ' + credRev['exponent'] + '\r\n' +
                 'CredRevAmt: ' + credRev['currency'] + ' ' + '0' + ' ' + credRev['exponent'] + '\r\n' +
                 'AuthCode: ' + credRev['AuthCode'] + '\r\n' +
                 'CredBatchID: ' + credRev['CredBatchID'] + '\r\n' +
                 'CredBatchSeq: ' + credRev['CredBatchSeq'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';
      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 訂單資料查詢
     *
     * @param {Object} inquery - 查詢內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var inquiryTransac = function inquiryTransac (inquiry, callback) {
      // Check required parameter
      // if (!inquiry['TX_ATTRIBUTE'] || !inquiry['MERID'] || !inquiry['LID-M'] || !inquiry['XID'] || !inquiry['currency'] || !inquiry['purchAmt'] || !inquiry['RECUR_NUM'] || (inquiry['PRODCODE'] === undefined)   ) {
      //   return callback({ code: '', msg: 'Required parameter missing.' }, null);
      // }

      var chkres = utility.checkMerID(inquiry['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkLidm(inquiry['LID-M']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPurchAmt(inquiry['purchAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCurrency(inquiry['currency']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkRecurNum(inquiry['RECUR_NUM']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.transformTxType(inquiry['TX_ATTRIBUTE']);
      if (chkres < 0 || chkres > 4) {
        return callback(chkres, null);
      } else {
        inquiry['TX_ATTRIBUTE'] = chkres;
      }

      if (inquiry['PRODCODE'] !== '') {
        chkres = utility.checkProdCode(inquiry['PRODCODE']);
      }

      if (chkres > 1) {
        return callback(chkres, null);
      }

      var data = 'SSL-TYPE: SSL_INQUIRY\r\n' +
                 'TX_ATTRIBUTE: ' + inquiry['TX_ATTRIBUTE'] + '\r\n' +
                 'MERID: ' + inquiry['MERID'] + '\r\n' +
                 'LID-M: ' + inquiry['LID-M'] + '\r\n' +
                 'XID: ' + inquiry['XID'] + '\r\n' +
                 'PAN: ' + inquiry['PAN'] + '\r\n' +
                 'PurchAmt: ' + inquiry['currency'] + ' ' + inquiry['purchAmt'] + ' ' + '0' + '\r\n' +
                 'RECUR_NUM: ' + inquiry['RECUR_NUM'] + '\r\n' +
                 'PRODCODE: ' + inquiry['PRODCODE'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';
      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 隱藏功能，用途不明
     *
     * @param {Object} orderQuery - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var orderQueryTransac = function orderQueryTransac (orderQuery, callback) {
      var chkres = utility.checkMerID(orderQuery['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkOQDate(orderQuery['StartDate'], orderQuery['EndDate']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      var data = 'SSL-TYPE: SSL_ORDERQUERY\r\n' +
                 'TX_ATTRIBUTE: 9\r\n' +
                 'MERID: ' + orderQuery['MERID'] + '\r\n' +
                 'StartDate: ' + orderQuery['StartDate'] + '\r\n' +
                 'EndDate: ' + orderQuery['EndDate'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';
      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 隱藏功能，用途不明
     *
     * @param {Object} settleQuery - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var settleQueryTransac = function settleQueryTransac (settleQuery, callback) {
      var chkres = utility.checkMerID(settleQuery['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkStDate(settleQuery['SettleDate']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      var data = 'SSL-TYPE: SSL_SETTLEQUERY\r\n' +
                 'TX_ATTRIBUTE: 9\r\n' +
                 'MERID: ' + settleQuery['MERID'] + '\r\n' +
                 'SettleDate: ' + settleQuery['SettleDate'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';
      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 隱藏功能，用途不明
     *
     * @param {Object} reentry - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var reentryTransac = function reentryTransac (reentry, callback) {
      var chkres = utility.checkMerID(reentry['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkXID(reentry['XID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkLidm(reentry['LID-M']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPan(reentry['PAN']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExpDate(reentry['ExpDate']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCurrency(reentry['currency']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPurchAmt(reentry['purchAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExponent(reentry['exponent']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkInputWay(reentry['InputWay']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExpDate(reentry['InputDate']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkUserID(reentry['UserId']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkUserName(reentry['UserName']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkAuthCode(reentry['ReentryCode']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.transformTxType(reentry['TX_ATTRIBUTE']);
      if (chkres < 0 || chkres > 2) {
        return callback(chkres, null);
      } else {
        reentry['TX_ATTRIBUTE'] = chkres;
      }

      if (reentry['TX_ATTRIBUTE'] === '1') {
        chkres = utility.checkRecurNum(reentry['RECUR_NUM']);
        if (chkres > 1) {
          return callback(chkres, null);
        }
      }

      if (reentry['TX_ATTRIBUTE'] === '3') {
        chkres = utility.checkProdCode(reentry['PRODCODE']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkOriginalAmt(reentry['OriginalAmt'], reentry['purchAmt']);
        if (chkres > 1) {
          return callback(chkres, null);
        }
      }

      var data = 'SSL-TYPE: SSL_REENTRY\r\n' +
                 'MERID: ' + reentry['MERID'] + '\r\n' +
                 'TermSeq: ' + reentry['TermSeq'] + '\r\n' +
                 'XID: ' + reentry['XID'] + '\r\n' +
                 'LID-M: ' + reentry['LID-M'] + '\r\n' +
                 'PAN: ' + reentry['PAN'] + '\r\n' +
                 'ExpDate: ' + reentry['ExpDate'] + '\r\n' +
                 'AuthAmt: ' + reentry['currency'] + ' ' + reentry['purchAmt'] + ' ' + reentry['exponent'] + '\r\n' +
                 'PurchAmt: ' + reentry['currency'] + ' ' + reentry['purchAmt'] + ' ' + reentry['exponent'] + '\r\n' +
                 'InputWay: ' + reentry['InputWay'] + '\r\n' +
                 'InputDate: ' + reentry['InputDate'] + '\r\n' +
                 'UserId: ' + reentry['UserId'] + '\r\n' +
                 'UserName: ' + reentry['UserName'] + '\r\n' +
                 'AuthCode: ' + reentry['AuthCode'] + '\r\n' +
                 'TX_ATTRIBUTE: ' + reentry['TX_ATTRIBUTE'] + '\r\n' +
                 'RECUR_NUM: ' + reentry['RECUR_NUM'] + '\r\n' +
                 'PRODCODE: ' + reentry['PRODCODE'] + '\r\n' +
                 'OffsetAmt: ' + reentry['OffsetAmt'] + '\r\n' +
                 'OriginalAmt: ' + reentry['OriginalAmt'] + '\r\n' +
                 'UtilizedPoint: ' + reentry['UtilizedPoint'] + '\r\n' +
                 'AwardedPoint: ' + reentry['AwardedPoint'] + '\r\n' +
                 'PointBalance: ' + reentry['PointBalance'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n';
      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 隱藏功能，用途不明
     *
     * @param {Object} redeem - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var redeemInstmtTransac = function redeemInstmtTransac (redeem, callback) {
      var isTravel = false;

      if ((redeem['TRV_DepartDay'] !== '') || (redeem['TRV_MerchantID'] !== '') || (redeem['TRV_Commission'] !== '')) {
        isTravel = true;
      }

      chkres = utility.checkMerID(redeem['MERID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkLidm(redeem['LID-M']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPan(redeem['PAN']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExpDate(redeem['ExpDate']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCurrency(redeem['currency']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPurchAmt(redeem['purchAmt']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkExponent(redeem['exponent']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkECI(redeem['ECI']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkCAVV(redeem['CAVV']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkProdCode(redeem['PRODCODE']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkRecurNum(redeem['RECUR_NUM']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkBirthday(redeem['BIRTHDAY']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkOrderDesc(redeem['ORDER_DESC']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      chkres = utility.checkPID(redeem['PID']);
      if (chkres > 1) {
        return callback(chkres, null);
      }

      if (isTravel) {
        chkres = utility.checkTravDD(redeem['TRV_DepartDay']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravMID(redeem['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }

        chkres = utility.checkTravCom(redeem['TRV_Commission'], redeem['TRV_MerchantID']);
        if (chkres > 1) {
          return callback(chkres, null);
        }
      }

      var data = 'SSL-TYPE: SSL_REDEEM\r\n' +
                 'MERID: ' + redeem['MERID'] + '\r\n' +
                 'LID-M: ' + redeem['LID-M'] + '\r\n' +
                 'PAN: ' + redeem['PAN'] + '\r\n' +
                 'ExpDate: ' + redeem['ExpDate'] + '\r\n' +
                 'AuthAmt: ' + redeem['currency'] + ' ' + redeem['purchAmt'] + ' ' + redeem['exponent'] + '\r\n' +
                 'PurchAmt: ' + redeem['currency'] + ' ' + redeem['purchAmt'] + ' ' + redeem['exponent'] + '\r\n' +
                 'ECI: ' + redeem['ECI'] + '\r\n' +
                 'CAVV: ' + redeem['CAVV'] + '\r\n' +
                 'PID: ' + redeem['PID'] + '\r\n' +
                 'ORDER_DESC: ' + redeem['ORDER_DESC'] + '\r\n' +
                 'BIRTHDAY: ' + redeem['BIRTHDAY'] + '\r\n' +
                 'PRODCODE: ' + redeem['PRODCODE'] + '\r\n' +
                 'RECUR_NUM: ' + redeem['RECUR_NUM'] + '\r\n' +
                 'VERSION: ' + utility.ApiVersion + '\r\n' +
                 'SwRevision: ' + utility.ApiSwRevision + '\r\n' +
                 'TX_ATTRIBUTE: 4 \r\n';

      if (isTravel) {
        data += 'TRV_DepartDay: ' + redeem['TRV_DepartDay'] + '\r\n' +
                'TRV_MerchantID: ' + redeem['TRV_MerchantID'] + '\r\n' +
                'TRV_Commission: ' + redeem['TRV_Commission'] + '\r\n';
      }

      data += '\r\n';

      sendRequest(data, callback);
    };

    /**
     * 發送交易內容至伺服器
     *
     * @param {Object} data - 交易內容
     * @param {requestCallback} callback - 處理該響應的回呼
     */
    var sendRequest = function sendRequest (data, callback) {
      // Check module initialized
      isInitialized();

      // Check callback exist
      if (typeof(callback) !== 'function') {
        throw 'Callback is not function.';
      }

      var client = tls.connect(_options, function() {
        if (client.authorized) {
          // Encode data to big5 encoding, otherwise ORDER_DESC will not readable at CTCB epos system
          client.write(iconv.encode(data, 'big5'));
        } else {
          var err = 'connection not authorized: ' + client.authorizationError;
          return callback(err, null);
        }
      });

      // client.setEncoding('utf8');
      client.on('data', function(buffer) {

        var data = iconv.decode(new Buffer(buffer), 'big5').trim().split('\r\n');
        var dataObj = {};

        // Parse data to json object
        var key = '';
        var value = '';
        var pattern = /([^:]+):(.*)/;
        for (var i = 0, len = data.length; i < len; i++) {
          key = data[i].match(pattern)[1].trim();
          value = data[i].match(pattern)[2].trim();
          dataObj[key] = value;
        }

        // Parse amount field
        if (dataObj['RespCode'] === '00') {
          var amount = '';
          if (dataObj['AuthAmt'] && dataObj['AuthAmt'].length >= 5) {
            amount = dataObj['AuthAmt'];
          } else if (dataObj['ResAmt'] && dataObj['ResAmt'].length >= 5) {
            amount = dataObj['ResAmt'];
          }

          if (amount) {
            dataObj['currency'] = amount.split(' ')[0];
            dataObj['amount'] = amount.split(' ')[1];
            dataObj['exponent'] = amount.split(' ')[2];
          }
        }

        return callback(null, dataObj);
      });

      client.on('error', function(err) {
        return callback(err, null);
      });
    }

    return {
      init: initialize,
      authTransac: authTransac,
      authRecurTransac: authRecurTransac,
      redeemTransac: redeemTransac,
      authRevTransac: authRevTransac,
      // batchCloseTransac: batchCloseTransac,
      capTransac: capTransac,
      capRevTransac: capRevTransac,
      credTransac: credTransac,
      credRevTransac: credRevTransac,
      inquiryTransac: inquiryTransac,
      // orderQueryTransac: orderQueryTransac,
      // settleQueryTransac: settleQueryTransac,
      // reentryTransac: reentryTransac,
      // redeemInstmtTransac: redeemInstmtTransac
    };
  };

  /**
   * Module exports.
   */
  module.exports = POSAPI;
})();
