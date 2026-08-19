const isLocal =
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1';


const url = isLocal
    ? 'http://localhost/indo-pacific-api/public/'
    : 'https://indo-pacific-api.doitcebutech.com/public/';

const baseurl = isLocal
    ? 'http://localhost/indo-web/'
    : 'https://indopacificlending.doitcebutech.com/';

const version = 'Version 1.0.2';

const loginApi                            = `${url}login`;
const logoutApi                            = `${url}logout`;
const validateOTPApi                      = `${url}validateOTP`;
// Borrowrs
const borrowerApi                         = `${url}borrower`;
const borrowerAllApi                         = `${url}borrower/all`;
const borrowerSummaryApi                  = `${url}borrower/summary`;
const borrowerLoanContractApi             = `${url}loan/contract`;
const borrowerLoanAddendumApi             = `${url}loan/addendum`;
const borrowerGetSettlementDeficitApi     = `${url}borrower/settlement-deficit`;
// Loan
const loanApi                             = `${url}loan`;
const paymentApi                          = `${url}loan/payment`;
const payBonusCollectionApi               = `${url}loan/bonus-collection/pay`;
const settlementApi                       = `${url}loan/settlement`;
const get_payment_report                  = `${url}loan/get/payment/report`;
const paymentReportPayApi                 = `${url}loan/payment-report/pay`;
const getBonusPaymentDetailsApi           = `${url}loan/bonus-collection/details`;
const addYearlySettlementApi              = `${url}loan/add-yearly-settlement`;
const addBonusSettlementApi               = `${url}loan/bonus-settlement`;
const getSettlementDetailsApi             = `${url}loan/get-bonus-settlement`;
const releaseLoanApi                      = `${url}loan/release`;
const approveLoanApi                      = `${url}loan/approve`;
const rejectLoanApi                       = `${url}loan/reject`;
const updateScheduleApi                   = `${url}loan/update-schedule`;
const sendLoanOtpApi                      = `${url}loan/send-otp`;
const validateLoanOtpApi                  = `${url}loan/validate-otp`;


const managerVaultTransactionsApi       = `${url}loan/reject`;


// LoanProducts
const loanproductsApi                   = `${url}loanproducts`;


const managerVaultApi                   = `${url}managervault`;
const userApi                           = `${url}user/get/cashier`;
const userSendOTPApi                    = `${url}user/otp/change-password`;
const userChangePasswordApi             = `${url}user/change-password`;
const userGetProfileApi                 = `${url}user/get/profile`;
const updateUserProfileApi              = `${url}user/update/profile`;
const updateUserProfileImageApi         = `${url}user/update/profile-image`;
const userGetLogsApi                    = `${url}user/get/logs`;
const managerTransanferToCashierApi     = `${url}managervault/transfer/cashier`;


const managerVaultCashInApi             = `${url}managervault`;;
const managerVaultSummaryApi            = `${url}managervault/summary`;
const managerVaultTransactionDetailsApi = `${url}managervault/transaction/details`;

const cashierVaultApi                   = `${url}cashiervault`;
const cashierVaultTransactionApi        = `${url}cashiervault/transaction-details`;
const cashierVaultSummaryApi            = `${url}cashiervault/transaction-summary`;
const cashierVaultReturnApi             = `${url}cashiervault/return-vault`;
const cashierVaultExportExcelApi        = `${url}cashiervault/export`;

const dailyCloseApi                     = `${url}cashierdailyclose`;
const dailyCloseSummaryApi              = `${url}cashierdailyclose/summary`;
const dailyCloseApproveApi              = `${url}cashiervault/approve-return-vault`;
const dailyClosRejectApi                = `${url}cashiervault/reject-return-vault`;


const borrowerSalaryApi                 = `${url}borrower/salary/get`;
const borrowerSalaryDetailsApi          = `${url}borrower/salary/details`;
const saveBorrowerSalaryApi             = `${url}borrower/salary/save`;
const deleteBorrowerSalaryApi           = `${url}borrower/salary/delete`;
const saveBulkSalaryApi                 = `${url}borrower/salary/bulk-save`;
const borrowerSalarySummaryApi          = `${url}borrower/salary/summary`;
const borrowerCashierTransactionApi     = `${url}borrower/cashier-transaction`;

const bankApi                           = `${url}bank`;
const banksApi                          = `${url}bank/banks`;
const bankDetailsApi                    = `${url}bankaccounts/details`;
const bankSummaryApi                    = `${url}bankaccounts/summary`;

const bankTransactionsApi               = `${url}bankaccounts/transactions`;
const bankAccountAllApi                 = `${url}bankaccounts/all`;

const bankTranactionDetailsApi          = `${url}bankaccounts/transactions`;
const bankTranactionDetailsDashboardApi = `${url}bankaccounts/transactions/dashboard`;
const closeBankAccountApi               = `${url}bankaccounts/close`;
const voidBankAccountTransactionApi     = `${url}bankaccounts/transactions/void`;

const employeeApi                       = `${url}employee`;
const employeeAddApi                    = `${url}employee/add`;
const employeeUpdateApi                 = `${url}employee/update`;


/*
|--------------------------------------------------------------------------
| Employee Schedule API
|--------------------------------------------------------------------------
*/

const employeeSchedulePage               = `${url}employee-schedule`;

const employeeScheduleApi                = `${url}employee-schedule/get`;

const employeeScheduleDeleteApi          = `${url}employee-schedule/delete`;

const employeeScheduleDaysApi            = `${url}employee-schedule/days`;

const employeeScheduleSaveDaysApi        = `${url}employee-schedule/save-days`;

const employeeCurrentScheduleApi         = `${url}employee-schedule/current`;

const employeeScheduleSaveApi           = `${url}employee-schedule/save`;

const employeeScheduleDatesApi          =`${url}employee-schedule/dates`;




const employeeSalaryApi              = `${url}employee-salary/get`;

const employeeSalarySaveApi          = `${url}employee-salary/save`;

const employeeSalaryDeleteApi        = `${url}employee-salary/delete`;

const employeeSalaryDatesApi         = `${url}employee-salary/dates`;



const employeeGovernmentApi             = `${url}employee-government/get`;

const employeeGovernmentSaveApi         = `${url}employee-government/save`;

const employeeGovernmentDeleteApi       = `${url}employee-government/delete`;

$(".version-badge").text(version);

$(".logout").click(function (e) {

    e.preventDefault();

    jsAddon.display.showLogoutConfirmMessage({

        icon: "question",

        title: "Logout",

        text: "Are you sure you want to logout?",

        showCancelButton: true,

        confirmButtonText: "Yes, Logout",

        cancelButtonText: "Cancel",

        confirmButtonColor: "#dc3545"

    }).then(function (result) {

        if (result.isConfirmed) {

            jsAddon.display.logout();

        }

    });

});

