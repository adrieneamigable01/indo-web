var isLocal = false;
var url = 'https://indo-pacific-api.doitcebutech.com/public/'
var baseurl = 'https://indopacificlending.doitcebutech.com/'
var version = 'Version 1.0.2';


if(isLocal){
    //local url
    var url = 'http://localhost/indo-pacific-api/public/'
    var baseurl = 'http://localhost/indo-web/'

}

var loginApi        = `${url}login`;
var validateOTPApi  = `${url}validateOTP`;
// Borrowrs
var borrowerApi  = `${url}borrower`;
var borrowerSummaryApi  = `${url}borrower/summary`;
var borrowerLoanContractApi  = `${url}loan/contract`;
var borrowerLoanAddendumApi  = `${url}loan/addendum`;
var borrowerGetSettlementDeficitApi  = `${url}borrower/settlement-deficit`;
// Loan
var loanApi  = `${url}loan`;
var paymentApi  = `${url}loan/payment`;
var payBonusCollectionApi  = `${url}loan/bonus-collection/pay`;
var settlementApi  = `${url}loan/settlement`;
var get_payment_report  = `${url}loan/get/payment/report`;
var paymentReportPayApi  = `${url}loan/payment-report/pay`;
var getBonusPaymentDetailsApi  = `${url}loan/bonus-collection/details`;
var addYearlySettlementApi  = `${url}loan/add-yearly-settlement`;
var addBonusSettlementApi  = `${url}loan/bonus-settlement`;
var getSettlementDetailsApi  = `${url}loan/get-bonus-settlement`;
var releaseLoanApi   = `${url}loan/release`;
var approveLoanApi   = `${url}loan/approve`;
var rejectLoanApi   = `${url}loan/reject`;
var updateScheduleApi   = `${url}loan/update-schedule`;
var sendLoanOtpApi   = `${url}loan/send-otp`;
var validateLoanOtpApi   = `${url}loan/validate-otp`;


var managerVaultTransactionsApi     = `${url}loan/reject`;


// LoanProducts
var loanproductsApi  = `${url}loanproducts`;


const managerVaultApi = url + "managervault";
const userApi = url + "user/get/cashier";
const userGetProfileApi = url + "user/get/profile";
const updateUserProfileApi = url + "user/update/profile";
const updateUserProfileImageApi = url + "user/update/profile-image";
const userGetLogsApi = url + "user/get/logs";
const managerTransanferToCashierApi = url + "managervault/transfer/cashier";


const managerVaultCashInApi = `${url}managervault`;;
const managerVaultSummaryApi     = `${url}managervault/summary`;
const managerVaultTransactionDetailsApi     = `${url}managervault/transaction/details`;

const cashierVaultApi     = `${url}cashiervault`;
const cashierVaultTransactionApi     = `${url}cashiervault/transaction-details`;
const cashierVaultSummaryApi     = `${url}cashiervault/transaction-summary`;
const cashierVaultReturnApi     = `${url}cashiervault/return-vault`;

const dailyCloseApi     = `${url}cashierdailyclose`;
const dailyCloseSummaryApi     = `${url}cashierdailyclose/summary`;
const dailyCloseApproveApi     = `${url}cashiervault/approve-return-vault`;
const dailyClosRejectApi     = `${url}cashiervault/reject-return-vault`;

$(".version-badge").text(version);