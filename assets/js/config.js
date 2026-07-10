var isLocal = false;
var url = 'http://localhost/indo-api/public/'


if(!isLocal){

}

var loginApi        = `${url}login`;
var validateOTPApi  = `${url}validateOTP`;
// Borrowrs
var borrowerApi  = `${url}borrower`;
var borrowerLoanContractApi  = `${url}loan/contract`;
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


var managerVaultTransactionsApi     = `${url}loan/reject`;


// LoanProducts
var loanproductsApi  = `${url}loanproducts`;


const managerVaultApi = url + "managervault";
const userApi = url + "user/get/cashier";
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
