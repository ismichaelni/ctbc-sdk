/**
 * @author Calvert Yang
 */
(function() {
  var Utility = function() {
    var API_VERSION                      = '1.0';
    var API_SwRevision                   = 'PosApi for nodeJS date:2014/04/10';
    var SSL_NO_ERROR                     = 0;
    var SSL_CONFIG_FILE_ERROR            = 1;
    var SSL_CONFIG_FILE_NOT_EXIST        = 2;
    var SSL_MEMORY_ERROR                 = 3;
    var SSL_CONNECT_HYPOS_ERROR          = 4;
    var SSL_MERCHANT_DB_DIR_WRITE_ERROR  = 5;
    var SSL_STOP                         = 6;
    var SSL_LOCK_ERROR                   = 7;
    var SSL_LOCK_BUSY                    = 8;
    var SSL_OTHER_ERROR                  = 9;
    var SSL_PARAMETER_MERID_ERROR        = 10;
    var SSL_PARAMETER_AMOUNT_ERROR       = 11;
    var SSL_PARAMETER_CURRENCY_ERROR     = 12;
    var SSL_PARAMETER_LIDM_ERROR         = 13;
    var SSL_PARAMETER_PAN_ERROR          = 14;
    var SSL_PARAMETER_EXPIRY_ERROR       = 15;
    var SSL_PARAMETER_XID_ERROR          = 16;
    var SSL_PARAMETER_AUTHRRPID_ERROR    = 17;
    var SSL_PARAMETER_CREDRRPID_ERROR    = 18;
    var SSL_PARAMETER_UPLOADFILE_ERROR   = 19;
    var SSL_PARAMETER_CAVV_ERROR         = 20;
    var SSL_KEYSTORE_FILE_NOT_EXIST      = 21;
    var SSL_PARAMETER_AUTHCODE_ERROR     = 22;
    var SSL_PARAMETER_TERMSEQ_ERROR      = 23;
    var SSL_PARAMETER_ORGAMT_ERROR       = 24;
    var SSL_PARAMETER_EXPONENT_ERROR     = 25;
    var SSL_PARAMETER_SALENEWAMT_ERROR   = 26;
    var SSL_PARAMETER_CAPBATCHID_ERROR   = 27;
    var SSL_PARAMETER_CAPBATCHSEQ_ERROR  = 28;
    var MAX_LIDM_LEN                     = 19;
    var MAX_XID_LEN                      = 40;
    var MAX_AUTHRRPID_LEN                = 40;
    var MAX_CREDRRPID_LEN                = 40;
    var MAX_PAN_LEN                      = 19;
    var MAX_EXPDATE_LEN                  = 6;
    var MAX_CURRENCY_LEN                 = 3;
    var MAX_INPUTDATE_LEN                = 14;
    var MAX_USERID_LEN                   = 32;
    var MAX_USERNAME_LEN                 = 32;
    var MAX_AUTHCODE_LEN                 = 6;
    var MAX_CAVV_LEN                     = 28;
    var MAX_RETRREF_LEN                  = 12;
    var MAX_AMT                          = 10000000;
    var EXPDATE_LEN                      = 6;
    var CURRENCY_LEN                     = 3;
    var AUTHCODE_LEN                     = 6;
    var ERR_CODE_LEN                     = 2;
    var MAX_ORDER_DESC_LEN               = 125;
    var END_RECUR_LEN                    = 8;
    var MAX_PID_LEN                      = 20;
    var BIRTHDAY_LEN                     = 8;
    var PRODCODE_LEN                     = 2;
    var MAX_TRAV_MERID_LEN               = 9;
    var MAX_TRAV_COMMISSION              = 7;
    var TYPE_NULL                        = 0x00000000;
    var TYPE_3DS_ERROR                   = 0x01000000;
    var TYPE_3DS_IREQ                    = 0x02000000;
    var TYPE_OPENSSL                     = 0x03000000;
    var TYPE_XML                         = 0x04000000;
    var TYPE_ZLIB                        = 0x05000000;
    var TYPE_XMLSEC                      = 0x06000000;
    var TYPE_ACS                         = 0x07000000;
    var TYPE_DB                          = 0x09000000;
    var TYPE_HTTP                        = 0x08000000;
    var TYPE_HYPOS                       = 0x10000000;
    var HY_SUCCESS                       = (TYPE_NULL | 0x00000000);
    var HY_R_FAILURE                     = (TYPE_NULL | 0x00000001);
    var HY_R_NOT_ENOUGH_MEMORY           = (TYPE_NULL | 0x00000002);
    var HY_R_INVALID_PARAMETER           = (TYPE_NULL | 0x00000004);
    var HY_R_INVALID_DATA                = (TYPE_NULL | 0x00000005);
    var HY_R_OPEN_FILE                   = (TYPE_NULL | 0x00000006);
    var HY_R_BASE64_DECODE               = (TYPE_NULL | 0x00000007);
    var HY_R_BASE64_ENCODE               = (TYPE_NULL | 0x00000008);
    var HY_R_UNCOMPRESS                  = (TYPE_NULL | 0x00000009);
    var HY_R_COMPRESS                    = (TYPE_NULL | 0x0000000A);
    var HY_R_INVALID_INI                 = (TYPE_NULL | 0x0000000B);
    var HY_R_SOCKET_CONNECT              = (TYPE_NULL | 0x0000000C);
    var HY_R_SOCKET_RECEIVE              = (TYPE_NULL | 0x0000000D);
    var HY_R_SOCKET_SEND                 = (TYPE_NULL | 0x0000000E);
    var HY_R_SOCKET_RECEIVE_TIMEOUT      = (TYPE_NULL | 0x0000000F);
    var HY_R_KEYSTORE_FILE               = (TYPE_NULL | 0x00000010);
    var HY_R_HTTP_REQUEST_LINE           = (TYPE_HTTP | 0x0A000001);
    var HY_R_HTTP_STATUS_LINE            = (TYPE_HTTP | 0x0A000001);
    var HY_R_HTTP_HEADER                 = (TYPE_HTTP | 0x0A000002);
    var HY_R_HTTP_TOO_MANY_HEADERS       = (TYPE_HTTP | 0x0A000003);
    var HY_R_HTTP_HEADER_NOT_FOUND       = (TYPE_HTTP | 0x0A000004);
    var HY_R_HTTP_BODY_TOO_LONG          = (TYPE_HTTP | 0x0A000005);
    var HY_R_HTTP_HEADER_TOO_LONG        = (TYPE_HTTP | 0x0A000006);
    var HY_R_HTTP_STATUS_CODE            = (TYPE_HTTP | 0x0A000007);
    var HY_R_HTTP_FORM_PARSE             = (TYPE_HTTP | 0x00000001);
    var HY_R_INIT_OPENSSL                = 0x09000001;
    var HY_R_XML_PARSE                   = (TYPE_XML | 0x00000001);
    var HY_R_XML_GET_ROOT                = (TYPE_XML | 0x00000001);
    var HY_R_XML_NEW_DOC                 = (TYPE_XML | 0x00000002);
    var HY_R_XML_NEW_NODE                = (TYPE_XML | 0x00000001);
    var HY_R_XML_NEW_TEXT_CHILD          = (TYPE_XML | 0x00000001);
    var HY_R_XML_NEW_PROP                = (TYPE_XML | 0x00000001);
    var HY_R_XML_ADD_CHILD               = (TYPE_XML | 0x00000001);
    var HY_R_XML_COPY_NODE_LIST          = (TYPE_XML | 0x00000001);
    var HY_R_DB_NO_MORE_ITEMS            = (TYPE_DB | 0x00000001);
    var HY_R_DB_EXEC                     = (TYPE_DB | 0x00000002);
    var HY_R_DB_FETCH                    = (TYPE_DB | 0x00000003);
    var IRC_ACQUIRER_NOT_PARTICIPATING   = (TYPE_3DS_IREQ | 50);
    var IRC_MERCHANT_NOT_PARTICIPATING   = (TYPE_3DS_IREQ | 51);
    var IRC_PASSWORD_REQUIRED            = (TYPE_3DS_IREQ | 52);
    var IRC_INVALID_PASSWORD             = (TYPE_3DS_IREQ | 53);
    var IRC_INVALID_ISO_CODE             = (TYPE_3DS_IREQ | 54);
    var IRC_INVALID_DATA                 = (TYPE_3DS_IREQ | 55);
    var IRC_PAREQ_WAS_INCORRECTLY_ROUTED = (TYPE_3DS_IREQ | 56);
    var IRC_SN_CANNOT_BE_LOCATED         = (TYPE_3DS_IREQ | 57);
    var IRC_TRANSIENT_SYS_FAILURE        = (TYPE_3DS_IREQ | 98);
    var IRC_PERMANENT_SYS_FAILURE        = (TYPE_3DS_IREQ | 99);
    var EC_INVALID_ROOT                  = (TYPE_3DS_ERROR | 1);
    var EC_INVALID_MESSAGE               = (TYPE_3DS_ERROR | 2);
    var EC_MISSING_ELEMENT               = (TYPE_3DS_ERROR | 3);
    var EC_NOT_RECOGNIZED                = (TYPE_3DS_ERROR | 4);
    var EC_INVALID_FORMAT                = (TYPE_3DS_ERROR | 5);
    var EC_VERSION_TOO_OLD               = (TYPE_3DS_ERROR | 6);
    var EC_TRANSIENT_SYS_FAILURE         = (TYPE_3DS_ERROR | 98);
    var EC_PERMANENT_SYS_FAILURE         = (TYPE_3DS_ERROR | 99);
    var HY_R_HYPOS_LIDM                  = (TYPE_HYPOS | 1);
    var HY_R_HYPOS_PAN                   = (TYPE_HYPOS | 2);
    var HY_R_HYPOS_EXPDATE               = (TYPE_HYPOS | 3);
    var HY_R_HYPOS_PURCHAMT              = (TYPE_HYPOS | 4);
    var HY_R_HYPOS_CURRENCY              = (TYPE_HYPOS | 5);
    var HY_R_HYPOS_CAVV                  = (TYPE_HYPOS | 6);
    var HY_R_HYPOS_RESPONSE              = (TYPE_HYPOS | 7);
    var HY_R_HYPOS_XID                   = (TYPE_HYPOS | 8);
    var HY_R_HYPOS_AUTHRRPID             = (TYPE_HYPOS | 9);
    var HY_R_HYPOS_ORDER_DESC            = (TYPE_HYPOS | 10);
    var HY_R_HYPOS_RECUR                 = (TYPE_HYPOS | 11);
    var HY_R_HYPOS_BIRTHDAY              = (TYPE_HYPOS | 12);
    var HY_R_HYPOS_PID                   = (TYPE_HYPOS | 13);
    var HY_R_HYPOS_PRODCODE              = (TYPE_HYPOS | 14);
    var HY_R_HYPOS_AMT_LIMIT             = (TYPE_HYPOS | 15);
    var HY_R_HYPOS_AUTHCODE              = (TYPE_HYPOS | 16);
    var HY_R_HYPOS_ORGAMT                = (TYPE_HYPOS | 17);
    var HY_R_HYPOS_TERMSEQ               = (TYPE_HYPOS | 18);
    var HY_R_HYPOS_EXPONENT              = (TYPE_HYPOS | 19);
    var HY_R_HYPOS_BATCHID               = (TYPE_HYPOS | 20);
    var HY_R_HYPOS_BATCHSEQ              = (TYPE_HYPOS | 21);
    var HY_R_HYPOS_MERID                 = (TYPE_HYPOS | 22);
    var HY_R_HYPOS_ECI                   = (TYPE_HYPOS | 23);
    var HY_R_HYPOS_RECURDATA             = (TYPE_HYPOS | 24);
    var HY_R_HYPOS_INQUIRY_TXTYPE        = (TYPE_HYPOS | 25);
    var HY_R_HYPOS_REENTRY_txType        = HY_R_HYPOS_INQUIRY_TXTYPE;
    var HY_R_HYPOS_REENTRY_inputWay      = (TYPE_HYPOS | 26);
    var HY_R_HYPOS_REENTRY_userInfo      = (TYPE_HYPOS | 27);
    var HY_R_HYPOS_REENTRY_OriginalAmt   = (TYPE_HYPOS | 28);
    var HY_R_HYPOS_PG_STATUS             = (TYPE_HYPOS | 30);
    var HY_R_HYPOS_PG_ERRCODE            = (TYPE_HYPOS | 31);
    var HY_R_HYPOS_PG_AUTHCODE           = (TYPE_HYPOS | 32);
    var HY_R_HYPOS_PG_RES_AMT            = (TYPE_HYPOS | 33);
    var HY_R_HYPOS_PG_UNKNOWN            = (TYPE_HYPOS | 34);
    var HY_R_HYPOS_TRAV_DEPARTDAY        = (TYPE_HYPOS | 41);
    var HY_R_HYPOS_TRAV_MERID            = (TYPE_HYPOS | 42);
    var HY_R_HYPOS_TRAV_COMMISSION       = (TYPE_HYPOS | 43);
    var HY_R_HYPOS_QUERY_DATE            = (TYPE_HYPOS | 55);
    var HY_R_HYPOS_DATE_ORDER            = (TYPE_HYPOS | 56);

    /**
     * Check invalid symbol in the string(Return true if there is invalid symbol in the string)
     *
     * @param {string} chkstr
     */
    var checkInvalidSymbol = function checkInvalidSymbol (chkstr) {
      var pattern = /^[a-zA-Z0-9_]+$/;

      return !pattern.test(chkstr);
    };

    var transformTxType = function transformTxType (txType) {
      var retVal = -1;

      if (/^TX_AUTH/i.test(txType)) {
        retVal = '0';
      } else if (/^TX_INSTMT/i.test(txType)) {
        retVal = '1';
      } else if (/^TX_REDEEM_AUTH/i.test(txType)) {
        $retVal = '2';
      } else if (/^TX_REDEEM_INSTMT_AUTH/i.test(txType)) {
        $retVal = '4';
      } else {
        return HY_R_HYPOS_INQUIRY_TXTYPE;
      }

      return retVal;
    };

    var inverseTxType = function inverseTxType (txType) {
      var retVal = '';

      if (/^0/.test(txType)) {
        retVal = 'TX_AUTH';
      } else if (/^1/.test(txType)) {
        retVal = 'TX_INSTMT';
      } else if (/^2/.test(txType)) {
        retVal = 'TX_REDEEM_AUTH';
      }

      return retVal;
    };

    var isDigitStr = function isDigitStr (chkstr) {
      var pattern = /^[0-9]+$/;

      return pattern.test(chkstr);
    };

    var checkInvalidAuthCode = function checkInvalidAuthCode (chkstr) {
      var pattern = /^[a-zA-Z0-9]+$/;

      return !pattern.test(chkstr);
    };

    var checkMerID = function checkMerID (chkstr) {
      if (!Number(chkstr)) {
        return $HY_R_HYPOS_MERID;
      } else {
        return true;
      }
    };

    var checkLidm = function checkLidm (chkstr) {
      if (chkstr === '' || chkstr.length <= 0 || chkstr.length > MAX_LIDM_LEN) {
        return HY_R_HYPOS_LIDM;
      }

      if (checkInvalidSymbol(chkstr)) {
        return HY_R_HYPOS_LIDM;
      }

      return true;
    };

    var checkPan = function checkPan (chkstr) {
      if (chkstr === '' || chkstr.length <= 0 || !isDigitStr(chkstr) || chkstr.length > MAX_PAN_LEN) {
        return HY_R_HYPOS_PAN;
      }

      return true;
    };

    var checkExpDate = function checkExpDate (chkstr) {
      if (chkstr === '' || chkstr.length !== MAX_EXPDATE_LEN || !isDigitStr(chkstr)) {
        return HY_R_HYPOS_EXPDATE;
      }

      return true;
    };

    var checkCurrency = function checkCurrency (chkstr) {
      if (chkstr === '' || chkstr.length <= 0 || chkstr.length > MAX_CURRENCY_LEN || !isDigitStr(chkstr)) {
        return HY_R_HYPOS_CURRENCY;
      }

      return true;
    };

    var checkPurchAmt = function checkPurchAmt (chkstr) {
      if (chkstr < 0) {
        return HY_R_HYPOS_PURCHAMT;
      }

      if (chkstr > MAX_AMT) {
        return HY_R_HYPOS_AMT_LIMIT;
      }

      return true;
    };

    var checkExponent = function checkExponent (chkstr) {
      if (!isDigitStr(chkstr)) {
        return HY_R_HYPOS_EXPONENT;
      }

      return true;
    };

    var checkECI = function checkECI (chkstr) {
      if (chkstr < 0 || !isDigitStr(chkstr)) {
        return HY_R_HYPOS_ECI;
      }

      return true;
    };

    var checkCAVV = function checkCAVV (chkstr) {
      if (chkstr !== '' && chkstr.length > MAX_CAVV_LEN) {
        return HY_R_HYPOS_CAVV;
      }

      return true;
    };

    var checkBirthday = function checkBirthday (chkstr) {
      if (chkstr !== '') {
        if (chkstr.length !== BIRTHDAY_LEN || !isDigitStr(chkstr)) {
          return HY_R_HYPOS_BIRTHDAY;
        }
      }

      return true;
    };

    var checkOrderDesc = function checkOrderDesc (chkstr) {
      if (chkstr !== '') {
        if (chkstr.length > MAX_ORDER_DESC_LEN) {
          return HY_R_HYPOS_ORDER_DESC;
        }
      }

      return true;
    };

    var checkPID = function checkPID (chkstr) {
      if (chkstr !== '') {
        if (chkstr.length > MAX_PID_LEN || checkInvalidSymbol(chkstr)) {
          return HY_R_HYPOS_PID;
        }
      }

      return true;
    };

    var checkTimeout = function checkTimeout (chkstr) {
      if (chkstr !== '') {
        if (chkstr <= 0) {
          return '30';
        }
      }

      return true;
    };

    var checkTravDD = function checkTravDD (chkstr) {
      if (chkstr === '' || chkstr.length !== 8) {
        return HY_R_HYPOS_TRAV_DEPARTDAY;
      }

      var pattern = /^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
      if (!pattern.test(chkstr)) {
        return HY_R_HYPOS_TRAV_DEPARTDAY;
      }

      return true;
    };

    var checkTravMID = function checkTravMID (chkstr) {
      if (chkstr !== '') {
        if (chkstr.length !== MAX_TRAV_MERID_LEN || checkInvalidSymbol(chkstr)) {
          return HY_R_HYPOS_TRAV_MERID;
        }
      }

      return true;
    };

    var checkTravCom = function checkTravCom (chkstr, dependstr) {
      if ((dependstr !== '') && (chkstr === '')) {
        return HY_R_HYPOS_TRAV_COMMISSION;
      }

      if (chkstr.length > MAX_TRAV_COMMISSION || !isDigitStr(chkstr)) {
        return HY_R_HYPOS_TRAV_COMMISSION;
      }

      return true;
    };

    var checkRecurNum = function checkRecurNum (chkstr) {
      if (!isDigitStr(chkstr)) {
        return HY_R_HYPOS_RECUR;
      }

      return true;
    };

    var checkRecurFreq = function checkRecurFreq (chkstr) {
      if (!isDigitStr(chkstr)) {
        return HY_R_HYPOS_RECURDATA;
      }

      return true;
    };

    var checkRecurEnd = function checkRecurEnd (chkstr) {
      if (!isDigitStr(chkstr)) {
        return HY_R_HYPOS_RECURDATA;
      }

      return true;
    };

    var checkProdCode = function checkProdCode (chkstr) {
      if (chkstr === '' || chkstr.length !== PRODCODE_LEN || !isDigitStr(chkstr)) {
        return HY_R_HYPOS_PRODCODE;
      }

      return true;
    };

    var checkXID = function checkXID (chkstr) {
      if (chkstr === '' || chkstr.length <= 0 || chkstr.length > MAX_XID_LEN) {
        return HY_R_HYPOS_XID;
      }

      return true;
    };

    var checkOrgAmt = function checkOrgAmt (chkstr) {
      if (!isDigitStr(chkstr)) {
        return HY_R_HYPOS_ORGAMT;
      }

      return true;
    };

    var checkAuthCode = function checkAuthCode (chkstr) {
      if (chkstr === '' || chkstr.length !== 6 || checkInvalidAuthCode(chkstr)) {
        return HY_R_HYPOS_AUTHCODE;
      }

      return true;
    };

    var checkAuthRRPID = function checkAuthRRPID (chkstr) {
      if (chkstr === '' || chkstr <= 0 || chkstr > MAX_AUTHRRPID_LEN) {
        return HY_R_HYPOS_AUTHRRPID;
      }

      return true;
    };

    var checkTermSeq = function checkTermSeq (chkstr) {
      if (chkstr === '') {
        return HY_R_HYPOS_TERMSEQ;
      }

      return true;
    };

    var checkBatchID = function checkBatchID (chkstr) {
      if (!isDigitStr(chkstr)) {
        return HY_R_HYPOS_BATCHID;
      }

      return true;
    };

    var checkBatchSeq = function checkBatchSeq (chkstr) {
      if (!isDigitStr(chkstr)) {
        return HY_R_HYPOS_BATCHSEQ;
      }

      return true;
    };

    var checkOQDate = function checkOQDate (chkstr, chkstr1) {
      var pattern = /^(\d{4})(\d{2})(\d{2})$/;

      if (!pattern.test(chkstr) || !pattern.test(chkstr1)) {
        return HY_R_HYPOS_QUERY_DATE;
      }

      var sd = new Date(chkstr.match(pattern).slice(1,4).join('/')).getTime();
      var ed = new Date(chkstr1.match(pattern).slice(1,4).join('/')).getTime();
      if (!sd || !ed) {
        return HY_R_HYPOS_QUERY_DATE;
      }

      if (sd > ed) {
        return HY_R_HYPOS_DATE_ORDER;
      }

      return true;
    };

    var checkStDate = function checkStDate (chkstr) {
      var pattern = /^(\d{4})(\d{2})(\d{2})$/;

      if (!pattern.test(chkstr)) {
        return HY_R_HYPOS_QUERY_DATE;
      }

      var sd = new Date(chkstr.match(pattern).slice(1,4).join('/')).getTime();
      if (!sd) {
        return HY_R_HYPOS_QUERY_DATE;
      }

      return true;
    };

    var checkInputWay = function checkInputWay (chkstr) {
      if (chkstr === '' || chkstr !== '5' || chkstr !== '6') {
        return HY_R_HYPOS_REENTRY_inputWay;
      }

      return true;
    };

    var checkUserID = function checkUserID (chkstr) {
      if (chkstr !== '' && chkstr.length > MAX_USERID_LEN) {
        return HY_R_HYPOS_REENTRY_userInfo;
      }

      return true;
    };

    var checkUserName = function checkUserName (chkstr) {
      if (chkstr !== '' && chkstr.length > MAX_USERNAME_LEN) {
        return HY_R_HYPOS_REENTRY_userInfo;
      }

      return true;
    };

    var checkOriginalAmt = function checkOriginalAmt (chkstr, chkstr1) {
      if (!isDigitStr(chkstr) || chkstr <= 0) {
        return HY_R_HYPOS_REENTRY_OriginalAmt;
      }

      if (chkstr !== chkstr1) {
        return HY_R_HYPOS_PURCHAMT;
      }

      return true;
    };

    return {
      ApiVersion: API_VERSION,
      ApiSwRevision: API_SwRevision,
      // checkInvalidSymbol: checkInvalidSymbol,
      transformTxType: transformTxType,
      // inverseTxType: inverseTxType,
      // isDigitStr: isDigitStr,
      // checkInvalidAuthCode: checkInvalidAuthCode,
      checkMerID: checkMerID,
      checkLidm: checkLidm,
      checkPan: checkPan,
      checkExpDate: checkExpDate,
      checkCurrency: checkCurrency,
      checkPurchAmt: checkPurchAmt,
      checkExponent: checkExponent,
      checkECI: checkECI,
      checkCAVV: checkCAVV,
      checkBirthday: checkBirthday,
      checkOrderDesc: checkOrderDesc,
      checkPID: checkPID,
      checkTimeout: checkTimeout,
      checkTravDD: checkTravDD,
      checkTravMID: checkTravMID,
      checkTravCom: checkTravCom,
      checkRecurNum: checkRecurNum,
      checkRecurFreq: checkRecurFreq,
      checkRecurEnd: checkRecurEnd,
      checkProdCode: checkProdCode,
      checkXID: checkXID,
      checkOrgAmt: checkOrgAmt,
      checkAuthCode: checkAuthCode,
      checkAuthRRPID: checkAuthRRPID,
      checkTermSeq: checkTermSeq,
      checkBatchID: checkBatchID,
      checkBatchSeq: checkBatchSeq,
      checkOQDate: checkOQDate,
      checkStDate: checkStDate,
      // checkInputWay: checkInputWay,
      // checkUserID: checkUserID,
      // checkUserName: checkUserName,
      // checkOriginalAmt: checkOriginalAmt
    };
  };

  /**
   * Module exports.
   */
  module.exports = Utility;
})();
