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
type inquiryType = {
  date: string;
  customerName: string;
  contactPerson: string;
  contactNo: string;
  enquiryNumber: string;
  hallName: string;
  hallLocation: string;
  hallRestrictions: string;
  dateOfEvent: string;
  slotTime: string;
  sessionName: string;
  purposeOfBooking: string;
  additionalInfo?: string;
  hallCharges: number;
  additionalFacilities: number;
  hallDeposit: number;
  totalPayable: number;
  managerEmail: string;
  managerName: string;
};

function formatIndianCurrency(num: number): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
  return formatted;
}

function numberToWordsIndian(price: number): string {
  const sglDigit = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const dblDigit = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tensPlace = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const handle_tens = (dgt: number, prevDgt: number): string => {
    return dgt === 0
      ? ""
      : " " + (dgt === 1 ? dblDigit[prevDgt] : tensPlace[dgt]);
  };

  const handle_utlc = (dgt: number, nxtDgt: number, denom: string): string => {
    return (
      (dgt !== 0 && nxtDgt !== 1 ? " " + sglDigit[dgt] : "") +
      (nxtDgt !== 0 || dgt > 0 ? " " + denom : "")
    );
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
          words.push(
            digit !== 0
              ? " " +
                  sglDigit[digit] +
                  " Hundred" +
                  (parseInt(priceStr[digitIdx + 1]) !== 0 ||
                  parseInt(priceStr[digitIdx + 2]) !== 0
                    ? " and"
                    : "")
              : ""
          );
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
          words.push(
            digit !== 0
              ? " " +
                  sglDigit[digit] +
                  " Hundred" +
                  (parseInt(priceStr[digitIdx + 1]) !== 0 ||
                  parseInt(priceStr[digitIdx + 2]) !== 0
                    ? " and"
                    : " Crore")
              : ""
          );
          break;
      }
    }
    str = words.reverse().join("");
  }

  // Handle decimal part
  const [integerPart, decimalPart] = price.toFixed(2).split(".");
  const decimalWords =
    parseInt(decimalPart) > 0 ? `and ${parseInt(decimalPart)} Paise` : "";

  return `${str.trim()} Rupees ${decimalWords}`.trim();
}

const inquiryHtmlTemplate = (props: inquiryType) => `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inquiry Estimate for Hall Booking and Event Form</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 14px; }
        .header { text-align: center; }
        .content { margin: 20px; }
        .nogap {line-height: 5px; margin: 30px 0px}
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        table input[type="text"] {width: 80%}
        th, td { border: 1px solid black; padding: 5px; }
        .terms-conditions { font-size: 16px; }
        .page-break { page-break-before: always; }
        .right-align { text-align: right; }
        .flex-container { display: flex; justify-content: space-between; align-items: flex-start; }
        .event-form { font-size: 12px; }
        .event-form p{ font-size: 12px; }
        .event-form h2 { text-align: center; }
        .event-form table { width: 100%; border-collapse: collapse; font-size: 12px;}
        .event-form th,td { border: 1px solid black; padding: 5px; }
        .event-form input[type="text"] { width: 100%; border: none; border-bottom: 1px solid black; }
        .no-border { border: none; }
        .no-border td{ border: none; }
        .underline { border-bottom: 1px solid black; }
        .signature-line { border-top: 1px solid black; margin-top: 40px; width: 50%; }
    </style>
</head>
<body>
    <div class="header">
        <img src="https://static.wixstatic.com/media/2d8aca_ab298473c57c4d32b13b1544c84d5ac9~mv2.png/v1/fill/w_196,h_236,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/svkm%20logo.png" alt="SVKM Logo" width="100">
        <h2>SHRI VILE PARLE KELAVANI MANDAL</h2>
        <h3>INQUIRY ESTIMATE FOR HALL BOOKING</h3>
    </div>
    <div class="content">
        
        <div class="nogap">
        <p><strong>Date:</strong> ${props.date}</p>
        <p><strong>Customer Name:</strong> ${props.customerName}</p>
        <p><strong>Contact Person:</strong> ${props.contactPerson}</p>
        <p><strong>Contact No:</strong> ${props.contactNo}</p>
        </div>

        <div class="nogap">
        <p><strong>Inquiry Number:</strong> ${props.enquiryNumber}</p>
        </div>

        <div class="nogap" style="margin-top:-15px;">
        <div class="flex-container">
            <div style="width: 70%">
              <p><strong>Hall Name:</strong> ${props.hallName} &nbsp <strong>Restrictions:</strong>${props.hallRestrictions}</p>
                <p style="margin:-3px 0px;"><strong>Hall Address:</strong> <span style="line-height: 16px;">${props.hallLocation}</span></p>
                <p><strong>Date of Event:</strong> ${props.dateOfEvent}</p>
                <p><strong>Session:</strong> ${props.sessionName} &nbsp&nbsp<strong>Slot Time: </strong>${props.slotTime}</p>
                <p><strong>Purpose of Booking:</strong> ${props.purposeOfBooking}</p>
            </div>
        </div>
        </div>

        <table>
            <tr>
                <th>Description</th>
                <th>Amt (INR)</th>
            </tr>
            <tr>
                <td>Hall Rent (SAC : 997212)</td>
                <td>${formatIndianCurrency(props.hallCharges)}</td>
            </tr>
            <tr>
                <td>Additional Facilities</td>
                <td>${formatIndianCurrency(props.additionalFacilities)}</td>
            </tr>
            <tr>
                <td><strong>Sub Total *</strong></td>
                <td><strong>${formatIndianCurrency(
                  props.hallCharges + props.additionalFacilities
                )}</strong></td>
            </tr>
            <tr>
                <td>Security Deposit</td>
                <td>${formatIndianCurrency(props.hallDeposit)}</td>
            </tr>
            <tr>
                <td><strong>Total</strong></td>
                <td><strong>${formatIndianCurrency(
                  props.totalPayable
                )}</strong></td>
            </tr>
        </table>
        
        <p>Rupees ${numberToWordsIndian(props.totalPayable)} Only</p>
        <p>* GST is applicable as per prevailing rates.</p>
        
        <p>Demand Draft / Account Payee Cheque to be drawn in favour of <strong>"SVKM HALL"</strong></p>
        
        <div class="nogap">        
        <h4>For Online payment, details as under (Pay only after confirmation with Manager)</h4>
        <p>Account Name: SVKM HALL</p>
        <p>Bank name: ICICI BANK</p>
        <p>Branch: Juhu Vile Parle</p>
        <p>NEFT/ IFSC code: ICIC0000366</p>
        <p>Account No. : 036601009123</p>
        <p>Account Type: Savings</p>
        </div>

        <div class="nogap">
        <p>SVKM PAN: AABTS8228H</p>
        <p>SVKM GSTIN: 27AABTS8228H1Z8</p>
        </div>

        <ul>
          <li>For booking confirmation and payment, please contact ${props.managerName} at ${props.managerEmail}.</li>
          <li>Hall availability is based on “First come, First served basis” against payment.</li>
          <li>For booking by SVKM institutes, please contact with duly filled in "Event form" (available below).</li>
        </ul>
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
    <div class="page-break"></div>
    <div class="event-form">
        <h2>EVENT FORM</h2>
        <table class="no-border">
            <tr>
                <td>To:</td>
                <td><input type="text"></td>
                <td style="text-align: right;">Date:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td><strong>Sub: Event/Meeting Name:</strong></td>
                <td colspan="3"><input type="text"></td>
            </tr>
            <tr>
                <td><strong>Name of the organizing school & section/committee:</strong></td>
                <td colspan="3"><input type="text"></td>
            </tr>
            <tr>
                <td colspan="4">Please book/provide hall/facilities as per the details given as under:</td>
            </tr>
            <tr>
                <td>Name of the Hall:</td>
                <td colspan="3"><input type="text"></td>
            </tr>
            <tr>
                <td>Event Date:</td>
                <td colspan="3"><input type="text"></td>
            </tr>
            <tr>
                <td>No. of participants:</td>
                <td colspan="3"><input type="text"></td>
            </tr>
            <tr>
                <td>Slot Time:</td>
                <td colspan="3"><input type="text"></td>
            </tr>
        </table>

        <p><strong>Facilities to be provided: (Please fill or tick the item):</strong></p>
        <p><strong><u>For playing sound system, NOC from Juhu police stn. is required to be obtained</u></strong></p>

        <table class="no-border">
            <tr>
                <td>1. Dias required for persons:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>2. No. of blank name plates required:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>3. No. of mike/speaker (small or big) req.:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>4. No. of screen required:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>5. No. of OHP/LCD/Laptop required:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>6. No. of Mementos Required:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>7. Podium:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td style="width:30%">8. Photographer/Video (for no. of photos):</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>9. Distribution of Handout etc.:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>10. Registration table for person:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>11. Lamp/candle/matchbox:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>12. Size & Layout of the stage:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>13. No. of Plastic Chairs/Cushion Chairs:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>14. IT/Tech Requirement:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>15. Any other (Pl. specify):</td>
                <td><input type="text"></td>
            </tr>
        </table>

        <p><strong>Catering services:</strong></p>
        <p>Name of the Caterer: <input type="text" style="width: 70%;"></p>

                <table>
            <tr>
                <th>Services</th>
                <th>Qty.</th>
                <th>Rate</th>
                <th>T. Amt.</th>
                <th>Time of Serving</th>
                <th>Menu negotiated with caterer</th>
            </tr>
            <tr>
                <td>a) Tea/Coffee with Biscuits</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>b) High Tea</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>c) Breakfast/snacks</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>d) Lunch</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>e) Water Bottles</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>

        <table class="no-border">
            <tr>
                <td class="no-border" style="width: 30%;">
                    <div class="signature-line">
                        <p><strong>Requisition signed by faculty in charge with name</strong></p>
                    </div>
                </td>
                <td class="no-border" style="width: 30%;">
                    <div class="signature-line">
                        <p><strong>HOD/Dean</strong></p>
                    </div>
                </td>
                <td class="no-border" style="width: 30%;">
                    <div class="signature-line">
                        <p><strong>Director (Admin.) / Registrar/ Principal</strong></p>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
`;

export async function generateInquiry(props: inquiryType) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const inquiry = inquiryHtmlTemplate(props);
    const sanitizedCustomerName = props.customerName.replace(/\s+/g, "_");
    const pdfPath = `./src/files/Customer_${sanitizedCustomerName}_${props.enquiryNumber}_inquiry.pdf`;

    await page.setContent(inquiry);
    await page.pdf({ path: `${pdfPath}`, format: "A4" });

    console.log(`PDF generated for customer ${props.customerName}: ${pdfPath}`);

    // Upload to Firebase Storage
    const storageFile = bucket.file(
      `Customer_${sanitizedCustomerName}_${props.enquiryNumber}_inquiry.pdf`
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
  }
}
