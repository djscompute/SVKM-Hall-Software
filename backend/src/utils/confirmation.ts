const puppeteer = require("puppeteer");
import admin from "firebase-admin";
import config from "config";
import fs from "fs";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.get<string>("FIREBASE_PROJECT_ID"),
      clientEmail: config.get<string>("FIREBASE_CLIENT_EMAIL"),
      privateKey: config
        .get<string>("FIREBASE_PRIVATE_KEY")
        .replace(/\\n/g, "\n"), // Replace escaped newline characters
    }),
    storageBucket: config.get<string>("FIREBASE_STORAGE_BUCKET"),
  });
}
const bucket = admin.storage().bucket();

type confirmationType = {
  date: string;
  customerName: string;
  contactPerson: string;
  contactNo: string;
  enquiryNumber: string;
  gstNo: string;
  pan: string;
  modeOfPayment: string;
  additionalPaymentDetails: string;
  hallName: string;
  hallLocation: string;
  hallRestrictions: string;
  dateOfEvent: string;
  slotTime: string;
  sessionType: string;
  purposeOfBooking: string;
  additionalInfo?: string;
  hallCharges: number;
  additionalFacilities: number;
  discountPercent: number;
  sgst: number;
  cgst: number;
  hallDeposit: number;
  depositDiscount: number;
  totalPayable: number;
  email: string;
  managerEmail: string;
  managerName: string;
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

const confirmationHtmlTemplate = (props: confirmationType) => `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hall Booking Confirmation Cum Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 13px; }
        .header { text-align: center; }
        .content { margin: 20px; }
        .nogap {line-height: 5px; margin: 20px 0px}
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { border: 1px solid black; padding: 5px; font-size: 14px; }
        .terms-conditions { font-size: 16px; }
        .page-break { page-break-before: always; }
    </style>
</head>
<body>
    <div class="header">
        <img src="https://static.wixstatic.com/media/2d8aca_ab298473c57c4d32b13b1544c84d5ac9~mv2.png/v1/fill/w_196,h_236,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/svkm%20logo.png" alt="SVKM Logo" width="100">
        <h1>SHRI VILE PARLE KELVANI MANDAL</h1>
        <h2>Hall Booking Confirmation Cum Receipt</h2>
    </div>
    <div class="content">
        <div class="nogap">
          <p><strong>Date:</strong> ${props.date}</p>
          <p><strong>Customer Name:</strong> ${props.customerName}</p>
          <p><strong>Contact Person:</strong> ${props.contactPerson}</p>
          <p><strong>Contact No:</strong> ${props.contactNo}</p>
          <p><strong>Enquiry Number:</strong> ${props.enquiryNumber}</p>
          <p><strong>GST No:</strong> ${props.gstNo}</p>
          <p><strong>PAN:</strong> ${props.pan}</p>
        </div>
        
        <div class="nogap">
          <p><strong>Mode of payment:</strong> ${props.modeOfPayment}</p>
        </div>

  <div class="nogap">
    <p><strong>Additional payment details:</strong> ${props.additionalPaymentDetails}</p>
    <p><strong>Hall Name:</strong> ${props.hallName} &nbsp <strong>Restrictions:</strong>${props.hallRestrictions}</p>
    <p style="margin:-3px 0px;"><strong>Hall Address:</strong> <span style="line-height: 12px;">${props.hallLocation}</span></p>
    <p><strong>Date of Event:</strong> ${props.dateOfEvent}</p>
    <p><strong>Slot Time:</strong> ${props.sessionType} ${props.slotTime}</p>
    <p><strong>Purpose of Booking:</strong> ${props.purposeOfBooking}</p>
    <p><strong>Additional Information</strong> ${props.additionalInfo}</p>
  </div>

        <table>
            <tr>
                <th>Description</th>
                <th>Amt (INR)</th>
            </tr>
            <tr>
                <td>Hall Charges (SAC:997212)</td>
                <td>${formatIndianCurrency(props.hallCharges)}</td>
            </tr>
            <tr>
                <td>Additional Facilities</td>
                <td>${formatIndianCurrency(props.additionalFacilities)}</td>
            </tr>
            <tr>
                <td><strong>Sub Total</strong></td>
                <td><strong>${formatIndianCurrency(props.hallCharges + props.additionalFacilities)}</strong></td>
            </tr>
            <tr>
                <td>(-) Discount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${props.discountPercent}%</td>
                <td>(${formatIndianCurrency((props.hallCharges + props.additionalFacilities) * (props.discountPercent / 100))})</td>
            </tr>
            <tr>
                <td><strong>Total Hall Charges</strong></td>
                <td><strong>${formatIndianCurrency((props.hallCharges + props.additionalFacilities) * (1 - props.discountPercent / 100))}</strong></td>
            </tr>
            <tr>
                <td>SGST - 9 %</td>
                <td>${formatIndianCurrency(props.sgst)}</td>
            </tr>
            <tr>
                <td>CGST - 9 %</td>
                <td>${formatIndianCurrency(props.cgst)}</td>
            </tr>
            <tr>
                <td><strong>Total</strong></td>
                <td><strong>${formatIndianCurrency((props.hallCharges + props.additionalFacilities) * (1 - props.discountPercent / 100) + props.sgst + props.cgst)}</strong></td>
            </tr>
            <tr>
                <td>Hall Deposit &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Applicable:${formatIndianCurrency(props.hallDeposit)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Discount:${props.depositDiscount}%</td>
                <td>${formatIndianCurrency((props.hallDeposit)*(1-props.depositDiscount/100))}</td>
            </tr>
            <tr>
                <td><strong>Total Payable</strong></td>
                <td><strong>${formatIndianCurrency(props.totalPayable)}</strong></td>
            </tr>
        </table>
        
        <p>Rupees ${numberToWordsIndian(props.totalPayable)} Only</p>

        
        <p>Demand Draft / Account Payee Cheque to be drawn in favour of <strong>"SVKM HALL"</strong></p>
        
       <div style="display: flex; justify-content: space-between; align-items: flex-end; margin: -30px 0px;">
            <div class="nogap">
                <h4>For Online payment, details as under</h4>
                <p>Account Name: SVKM HALL</p>
                <p>Bank name: ICICI BANK</p>
                <p>Branch: Juhu Vile Parle</p>
                <p>NEFT/ IFSC code: ICIC0000366</p>
                <p>Account No. : 036601009123</p>
                <p>Account Type: Saving</p>
            </div>
            <div style="text-align: right; margin-right:30px">
                <p><strong>For SVKM Halls</strong></p>
                <br><br>
                <p>____________________</p>
                <p>Authorised Signatory</p>
            </div>
        </div>

        <div class="nogap">
            <p><strong>SVKM PAN: AABTS8228H</strong></p>
            <p><strong>SVKM GSTIN: 27AABTS8228H1Z8</strong></p>
        </div>

        <p><strong>For GST invoice with IRN please contact ${props.managerName} at ${props.managerEmail} within one month.</strong></p>
         </div>
    <div class="page-break"></div>
<div class="content terms-conditions">
        <h4>Terms & Conditions:</h4>
        <p><strong>General -</strong></p>
        <ol>
            <li>Extra hour charges are applicable for BJ Hall and Mukesh Patel Auditorium.</li>
            <li>Extra payment for electrical service charges (as per meter reading) will have to be paid by customer for booking the B.J. Hall.</li>
            <li>GST will be applicable on Total Payable amount excluding security deposit, if any.</li>
            <li>Difference in GST amount due to change in the rate, applicable on the date of the event, will have to be paid by customer.</li>
            <li>Security Deposit will have to be paid along with Hall charges.</li>
            <li>Security Deposit shall be claimed by customer on production of the original official receipt within one month after the function is over.</li>
            <li>Hall charges are subject to change without any prior notice and the concerned customer has to bear the upward revision in charges, if applicable.</li>
            <li>In case of cancellation of booking, deductions shall be made at the following:
                <ul>
                    <li>50% of the charges provided, the hall is rebooked by some other party.</li>
                    <li>10% of the charges if the function is cancelled due to death in the family.</li>
                </ul>
                In any other cases no refund will be allowed.
            </li>
            <li>Serving of non-vegetarian food and/or hard drink is strictly prohibited.</li>
            <li>Use of Band within the premises is strictly prohibited.</li>
            <li>Bursting of crackers will be allowed beyond 100 metres of the periphery of the premises. Deposit shall be forfeited if the above rule is violated.</li>
            <li>Photo Studio/Umbrella and halogen stand are not allowed inside the hall.</li>
            <li>Flowers are not allowed in Hall Carpet Area.</li>
        </ol>
        
        <p><strong>For Mukesh Patel Auditorium -</strong></p>
        <ol>
            <li>Each session is for a period not exceeding 3 hours</li>
            <li>Full day is for a period not exceeding 6 hours and shall, in any case not last beyond 6 PM on the day.</li>
            <li>Service of Ushers: The services of Ushers shall be provided by the auditorium and the party booking the auditorium will have to pay Rs.4000/- (Rupees Four Thousand only) per session (three hours and for ten persons) for the services rendered before the commencement of the show and the cheque should be drawn in favour of "THE FORT AND COLABA WELFARE SOCIETY".</li>
            <li>Police Bandobast: Police Bandobast is compulsory on the day of performance and will be made by the party booking the auditorium. For this purpose, the party should contact well in advance with an application, the Inspector of Police, Juhu Police Station, Vile Parle (West), Mumbai - 400 056, pay the necessary charges and obtain receipt of the same. This should be shown to the Auditorium Manager at the time of the programme.</li>
            <li>Police Permission & Licenses: Permission from the police for the following must be obtained before the sale of tickets and the necessary certificate must be shown to the Auditorium Manager.
                The contents of the performance or the drama to be performed must be got approved by the Commissioner of Police, Theatre Branch, Mumbai - 400 001. It is necessary to obtain the permission of the author before staging performance.</li>
        </ol>
        <h4>Rules for MPSTME Seminar Halls Booking:</h4>
        <ol>
            <li>MPSTME Big Seminar Hall requires a minimum crowd of 300.</li>
            <li>Requests for booking should be made at least one week in advance.</li>
            <li>Food & Beverages are not allowed inside the halls.</li>
            <li>Sound system is available in halls, no DJ sets or other related equipment to be connected.</li>
            <li>All arrangements like table booking(Form Popular Decorator), standee arrangement, printing, stationary, coordination with canteen manager needs to be taken care by the organizer.</li>
            <li>The college authorities (user) of the event booking team is responsible for maintaining decorum and cleanliness in the halls.</li>
            <li>Any damage caused to the halls/property will be the responsibility of the user.</li>
            <li>Booking of canteen space is not possible during college academics times due to rush.</li>
        </ol>
    </div>
</body>
</html>
`;

export async function generateConfirmation(props: confirmationType): Promise<string> {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const confirmation = await confirmationHtmlTemplate(props);
    const sanitizedCustomerName = props.customerName.replace(/\s+/g, '_');
    const pdfPath = `./src/files/Customer_${sanitizedCustomerName}_${props.enquiryNumber}_confirmation.pdf`;

    await page.setContent(confirmation);
    await page.pdf({ path: pdfPath, format: "A4" });

    console.log(`PDF generated for customer ${props.customerName}: ${pdfPath}`);
    // Upload to Firebase Storage
    const storageFile = bucket.file(
      `Customer_${sanitizedCustomerName}_${props.enquiryNumber}_confirmation.pdf`
    );
    await storageFile.save(await fs.promises.readFile(pdfPath), {
      metadata: { contentType: "application/pdf" },
    });

    // Make the file public and get the public URL
    await storageFile.makePublic();
    const publicUrl = storageFile.publicUrl();
    console.log(publicUrl);

    await browser.close();
    return publicUrl;
  } catch (error) {
    console.log(error);
    throw error;
  }
}