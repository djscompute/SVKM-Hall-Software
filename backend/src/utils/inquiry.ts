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
};

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
                <td>${props.hallCharges}</td>
            </tr>
            <tr>
                <td>Additional Facilities</td>
                <td>${props.additionalFacilities}</td>
            </tr>
            <tr>
                <td>Sub Total *</td>
                <td>${props.hallCharges + props.additionalFacilities}</td>
            </tr>
            <tr>
                <td>Security Deposit</td>
                <td>${props.hallDeposit}</td>
            </tr>
            <tr>
                <td>Total</td>
                <td>${props.totalPayable}</td>
            </tr>
        </table>
        
        <p>Rupees ${props.totalPayable} only</p>
        <p>* GST is applicable as per prevailing rates.</p>
        
        <p>Demand Draft / Account Payee Cheque to be drawn in favour of "SVKM HALL."</p>
        
        <h4>For Online payment, details as under</h4>
        <p>Account Name: SVKM HALL</p>
        <p>Bank name: ICICI BANK</p>
        <p>Branch: Juhu Vile Parle</p>
        <p>NEFT/ IFSC code: ICIC0000366</p>
        <p>Account No. : 036601009123</p>
        <p>Account Type: Savings</p>
        
        <p>SVKM PAN: AABTS8228H</p>
        <p>SVKM GSTIN: 27AABTS8228H1Z8</p>
        
        <p>For booking confirmation and payment, please contact XXXXXXX at XXXXXX.</p>
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
            <li>Each session if for a period not exceeding 3 hours</li>
            <li>Full day is for a period not exceeding 6 hours and shall, in any case not last beyond 6 PM on the day.</li>
            <li>Service of Ushers: The services of Ushers shall be provided by the auditorium and the party booking the auditorium will have to pay Rs.4000/- (Rupees Four Thousand only) per session (three hours and for ten persons) for the services rendered before the commencement of the show and the cheque should be drawn in favour of "THE FORT AND COLABA WELFARE SOCIETY".</li>
            <li>Police Bandobast: Police Bandobast is compulsory on the day of performance and will be made by the party booking the auditorium. For this purpose, the party should contact well in advance with an application, the Inspector of Police, Juhu Police Station, Vile Parle (West), Mumbai - 400 056, pay the necessary charges and obtain receipt of the same. This should be shown to the Auditorium Manager at the time of the programme.</li>
            <li>Police Permission & Licenses: Permission from the police for the following must be obtained before the sale of tickets and the necessary certificate must be shown to the Auditorium Manager.
                The contents of the performance or the drama to be performed must be got approved by the Commissioner of Police, Theatre Branch, Mumbai - 400 001. It is necessary to obtain the permission of the author before staging performance.</li>
        </ol>
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