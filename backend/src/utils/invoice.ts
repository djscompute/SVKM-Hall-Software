const puppeteer = require("puppeteer");

type invoiceType = {
  name: String;
  address: String;
  location: String;
  city: String;
  pincode: Number;
  country: String;
  stateCode: String;
  date: String;
  paymentType: String;
  hallName: String;
  amount: number;
  panNo: String;
  gstNo: String;
};

const invoiceHtmlTemplate = (props: invoiceType) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
      }
      h3 {
        text-align: center;
      }
    </style>
  </head>
  <body>
    <h3>TAX INVOICE</h3>
    <section>
      <h4>IRN No.</h4>
      <h4>${props.name}</h4>
      <p>${props.address}</p>
      <p>${props.location}</p>
      <p>${props.city} ${props.pincode}</p>
      <p>${props.country}</p>
      <p>GSTIN : URP</p>
      <p>State Code: ${props.stateCode}</p>
    </section>
    <section>
      <table border="1">
        <tr>
          <th>Kind Attn:</th>
        </tr>
        <tr>
          <th>Invoice no: ${
            Math.random().toString(36).substring(2) +
            Math.random().toString(36).substring(2)
          }</th>
          <td>Date: ${props.date}</td>
          <td>Terms of Payment: ${props.paymentType}</td>
          <td>Doc. No : ${Math.floor(Math.random() * 9999999999)}</td>
        </tr>
        <tr>
          <th>Description</th>
          <th>Amount (INR)</th>
        </tr>
        <tr>
          <td>
            Hell Income
            <br />
            ${props.hallName}
          </td>
          <td>SAC: 997212</td>
          <td>${props.amount}</td>
        </tr>
        <tr>
          <th>Sub Total</th>
          <th>${props.amount}</th>
        </tr>
        <tr>
          <td>State GST - 9 %</td>
          <td>${0.09 * props.amount}</td>
        </tr>
        <tr>
          <td>Central GST - 9 %</td>
          <td>${0.09 * props.amount}</td>
        </tr>
        <tr>
          <th>Rupees One Lakh Eighty Eight Thousand Eight Hundred Only</th>
          <th>Total</th>
          <th>${props.amount + 0.18 * props.amount}</th>
        </tr>
      </table>
      <h4>E.& O.E.</h4>
    </section>
    <section>
        <h4>Demand Draft / Account Payee Cheque to be drawn in favour of " ". Please send TDS certificate to the Cheif Accountant of .</h4>
    </section>
    <section>
        <h4>P.A.N. : ${props.panNo}</h4>
        <h4>GSTIN Number : ${props.gstNo}</h4>
        <h4><u>For ECS</u></h4>
        <div>
            <h4>NEFT IFSC code :</h4>
            <h4>MICR Code :</h4>
            <h4>Account Type :</h4>
            <h4>Bank name :</h4>
            <h4>Account No :</h4>
            <h4>Branch :</h4>
        </div>
    </section>
  </body>
</html>
`;

export async function generateInvoice(props: invoiceType) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const invoice = invoiceHtmlTemplate(props);
    const pdfPath = `./backend/src/files/Customer_${props.name}_Invoice.pdf`;

    await page.setContent(invoice);
    await page.pdf({ path: `${pdfPath}`, format: "A4" });

    console.log(`PDF generated for customer ${props.name}: ${pdfPath}`);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}