const puppeteer = require("puppeteer");

type inquiryType = {
  date: string;
  customerName: string;
  contactPerson: string;
  contactNo: string;
  enquiryNumber: string;
  hallName: string;
  dateOfEvent: string;
  slotTime: string;
  purposeOfBooking: string;
  hallCharges: number;
  additionalFacilities: number;
  hallDeposit: number;
  totalPayable: number;
  hallContact: string;
};

function formatIndianCurrency(num: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
  return formatted;
}

function numberToWordsIndian(price: number): string {
    const sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
    const handle_tens = (dgt: number, prevDgt: number): string => {
      return dgt === 0 ? "" : " " + (dgt === 1 ? dblDigit[prevDgt] : tensPlace[dgt]);
    };
  
    const handle_utlc = (dgt: number, nxtDgt: number, denom: string): string => {
      return (dgt !== 0 && nxtDgt !== 1 ? " " + sglDigit[dgt] : "") + (nxtDgt !== 0 || dgt > 0 ? " " + denom : "");
    };
  
    let str = "";
    let digitIdx = 0;
    let digit = 0;
    let nxtDigit = 0;
    let words: string[] = [];
  
    const priceStr = Math.floor(price).toString(); // Handle only the integer part
  
    if (parseInt(priceStr) > 0 && priceStr.length <= 10) {
      for (digitIdx = priceStr.length - 1; digitIdx >= 0; digitIdx--) {
        digit = parseInt(priceStr[digitIdx]);
        nxtDigit = digitIdx > 0 ? parseInt(priceStr[digitIdx - 1]) : 0;
        switch (priceStr.length - digitIdx - 1) {
          case 0:
            words.push(handle_utlc(digit, nxtDigit, ""));
            break;
          case 1:
            words.push(handle_tens(digit, parseInt(priceStr[digitIdx + 1])));
            break;
          case 2:
            words.push(digit !== 0 ? " " + sglDigit[digit] + " Hundred" + (parseInt(priceStr[digitIdx + 1]) !== 0 || parseInt(priceStr[digitIdx + 2]) !== 0 ? " and" : "") : "");
            break;
          case 3:
            words.push(handle_utlc(digit, nxtDigit, "Thousand"));
            break;
          case 4:
            words.push(handle_tens(digit, parseInt(priceStr[digitIdx + 1])));
            break;
          case 5:
            words.push(handle_utlc(digit, nxtDigit, "Lakh"));
            break;
          case 6:
            words.push(handle_tens(digit, parseInt(priceStr[digitIdx + 1])));
            break;
          case 7:
            words.push(handle_utlc(digit, nxtDigit, "Crore"));
            break;
          case 8:
            words.push(handle_tens(digit, parseInt(priceStr[digitIdx + 1])));
            break;
          case 9:
            words.push(digit !== 0 ? " " + sglDigit[digit] + " Hundred" + (parseInt(priceStr[digitIdx + 1]) !== 0 || parseInt(priceStr[digitIdx + 2]) !== 0 ? " and" : " Crore") : "");
            break;
        }
      }
      str = words.reverse().join("");
    }
  
    // Handle decimal part
    const [integerPart, decimalPart] = price.toFixed(2).split('.');
    const decimalWords = parseInt(decimalPart) > 0 ? `and ${parseInt(decimalPart)} Paise` : '';
  
    return `${str.trim()} Rupees ${decimalWords}`.trim();
  }

const inquiryHtmlTemplate = (props: inquiryType) => `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inquiry Estimate for Hall Booking</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .header { text-align: center; }
        .content { margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 5px; }
        .terms-conditions { font-size: 16px; }
        .page-break { page-break-before: always; }
    </style>
</head>
<body>
    <div class="header">
        <img src="path_to_svkm_logo.png" alt="SVKM Logo" width="100">
        <h2>SHRI VILE PARLE KELAVANI MANDAL</h2>
        <h3>INQUIRY ESTIMATE FOR HALL BOOKING</h3>
    </div>
    <div class="content">
        <p><strong>Date:</strong> ${props.date}</p>
        
        <p><strong>Customer Name:</strong> ${props.customerName}</p>
        <p><strong>Contact Person:</strong> ${props.contactPerson}</p>
        <p><strong>Contact No:</strong> ${props.contactNo}</p>
        <p><strong>Inquiry Number:</strong> ${props.enquiryNumber}</p>
        
        <p><strong>Hall Name:</strong> ${props.hallName}</p>
        <p><strong>Date of Event:</strong> ${props.dateOfEvent}</p>
        <p><strong>Slot Time:</strong> ${props.slotTime}</p>
        <p><strong>Purpose of Booking:</strong> ${props.purposeOfBooking}</p>
        
        <table>
            <tr>
                <th>Description</th>
                <th>Amt (INR)</th>
            </tr>
            <tr>
                <td>Hall Charges</td>
                <td>${formatIndianCurrency(props.hallCharges)}</td>
            </tr>
            <tr>
                <td>Additional Facilities</td>
                <td>${formatIndianCurrency(props.additionalFacilities)}</td>
            </tr>
            <tr>
                <td><strong>Sub Total *</strong></td>
                <td><strong>${formatIndianCurrency(props.hallCharges + props.additionalFacilities)}</strong></td>
            </tr>
            <tr>
                <td>Security Deposit</td>
                <td>${formatIndianCurrency(props.hallDeposit)}</td>
            </tr>
            <tr>
                <td><strong>Total</strong></td>
                <td><strong>${formatIndianCurrency(props.totalPayable)}</strong></td>
            </tr>
        </table>
        
        <p>Rupees ${numberToWordsIndian(props.totalPayable)} Only</p>
        <p>* GST is applicable as per prevailing rates.</p>
        
        <p>Demand Draft / Account Payee Cheque to be drawn in favour of <strong>"SVKM HALL."</strong></p>
        
        <h4>For Online payment, details as under</h4>
        <p>Account Name: SVKM HALL</p>
        <p>Bank name: ICICI BANK</p>
        <p>Branch: Juhu Vile Parle</p>
        <p>NEFT/ IFSC code: ICIC0000366</p>
        <p>Account No. : 036601009123</p>
        <p>Account Type: Savings</p>
        
        <p>SVKM PAN: AABTS8228H</p>
        <p>SVKM GSTIN: 27AABTS8228H1Z8</p>
        
        <p>For booking confirmation and payment, please contact ${props.hallContact} at ${props.hallName}.</p>
    </div>
    <div class="page-break"></div>
    <div class="content terms-conditions">
        <h4>Terms & Conditions:</h4>
        <!-- ... (Terms & Conditions content remains the same) ... -->
    </div>
</body>
</html>
`;

export async function generateInquiry(props: inquiryType) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const inquiry = inquiryHtmlTemplate(props);
    const sanitizedCustomerName = props.customerName.replace(/\s+/g, '_');
    const pdfPath = `./src/files/Customer_${sanitizedCustomerName}_${props.enquiryNumber}_inquiry.pdf`;

    await page.setContent(inquiry);
    await page.pdf({ path: `${pdfPath}`, format: "A4" });

    console.log(`PDF generated for customer ${props.customerName}: ${pdfPath}`);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}