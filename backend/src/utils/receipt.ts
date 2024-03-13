const puppeteer = require("puppeteer");

type receiptType = {
  name: String;
  hallName: String;
  amount: number;
};

const receiptHtmlTemplate = (props: receiptType) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <section>
        <h3>SVKM Hall</h3>
        <p>Bhaktivedanta Marg, Vile Parle West , Bhaidas Sabhargriha Building</p>
        <p>Mumbai, India - 400056</p>
    </section>
    <section>
        <h3>Receipt Confirmation</h3>
        <h4>Date: 08.02.2024</h4>
    </section>
    <section>
        <p>Receipt Document :2500000156</p>
        <p>Received with thanks From :${props.name}</p>
        <p>Towards</p>        
    </section>
    <section>
        <h3>Cheque Details ( * )</h3>
        <p>Bank :${props.hallName}</p>
        <p>Cheque No. :NEFT 19.12.23</p>
        <p>Currency :INR</p>
        <p>Amount :${props.amount}</p>
        <p>Amount ( in Words ) :Rs. One Lakh Eighty Eight Thousand Eight Hundred Only</p>
    </section>
    <section>
        <p>Authorised Signatory</p>
        <p>( * ) Subject to realization of cheque</p>
    </section>
</body>
</html>
`;

export async function generateReceipt(props: receiptType) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const receipt = receiptHtmlTemplate(props);
    const pdfPath = `./backend/src/files/Customer_${props.name}_Receipt.pdf`;   

    await page.setContent(receipt);
    await page.pdf({ path: `${pdfPath}`, format: "A4" });

    console.log(`PDF generated for customer ${props.name}: ${pdfPath}`);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}