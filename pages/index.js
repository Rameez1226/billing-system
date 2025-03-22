import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
// import { db } from "./api/hello";
import { db, collection, addDoc, getDocs } from "./api/hello";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [items, setItems] = useState([]);
  console.log("🚀 ~ Home ~ items:", items);
  const [newItem, setNewItem] = useState({ name: "", qty: "", rate: "" });
  const [gst, setGst] = useState(5);
  const [invoices, setInvoices] = useState([]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const gstAmount = (subtotal * gst) / 100;
  const netAmount = subtotal + gstAmount;

  // Add item to the list
  const addItem = () => {
    if (!newItem.name || !newItem.qty || !newItem.rate) {
      alert("Please enter all item details");
      return;
    }

    setItems([
      ...items,
      {
        ...newItem,
        qty: parseFloat(newItem.qty),
        rate: parseFloat(newItem.rate),
      },
    ]);
    setNewItem({ name: "", qty: "", rate: "" });
  };

  // Save Invoice to Firestore
  const saveInvoice = async () => {
    if (items.length === 0) {
      alert("Add at least one item!");
      return;
    }

    try {
      items?.map(async (item) => {
        const invoiceData = {
          total: subtotal,
          gst: gstAmount,
          itemTotal: item.rate,
          itemGst: (item.rate * gst) / 100,
          timestamp: new Date(),
          itemName: item.name,
          qty: item?.qty,
        };

        await addDoc(collection(db, "billing"), invoiceData);
      });

      alert("Invoice Saved in Firebase!");
      fetchInvoices();
      setItems([]); // Clear items after saving
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  // Fetch Invoices from Firestore
  const fetchInvoices = async () => {
    const querySnapshot = await getDocs(collection(db, "billing"));
    const invoicesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInvoices(invoicesData);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Print Invoice
  const printInvoice = () => {
    window.print();
  };

  const [invoiceData, setInvoiceData] = useState({
    gstin: "32AEVFS5627Q1Z2",
    eWayBillNo: "",
    pan: "AEVFS5627Q",
    transportationMode: "Road",
    reverseCharge: "No",
    vehicleNo: "",
    invoiceNo: "SE/24-25/17",
    poNo: "",
    dateOfSupply: "12/Sep/2024",
    invoiceDate: "12/Sep/2024",
    poDate: "",
    placeOfSupply: "",
    billedToName: "P T SPICES",
    billedToAddress: "VELLUVANGAD SOUTH P.O PANDIKKAD, MALAPPURAM",
    billedToPhone: "",
    billedToMobile: "9496841060",
    billedToState: "32-KERALA",
    billedToPan: "",
    billedToGstin: "32AVAPT8082A1ZS",
    shippedToName: "P T SPICES",
    shippedToAddress: "VELLUVANGAD SOUTH P.O PANDIKKAD, MALAPPURAM",
    shippedToPhone: "",
    shippedToMobile: "9496841060",
    shippedToState: "32-KERALA",
    shippedToPan: "",
    shippedToGstin: "32AVAPT8082A1ZS",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const InputField = ({ label, field, width = "w-full" }) => (
    <div className="flex items-center">
      {label && <strong className="mr-1">{label}:</strong>}
      <input
        type="text"
        name={field}
        className={`${width} border-none bg-transparent p-0 focus:outline-none focus:ring-0`}
        value={invoiceData[field]}
        onChange={handleChange}
      />
    </div>
  );
  const printStyles = `
  @media print {
    .no-print {
      display: none !important;
    }
  }
`;

  // /* Ensure the invoice content is printed clearly */
  // .print-only {
  //   display: block;
  // }

  // /* Add any other print-specific styles here */
  // body {
  //   padding: 20px;
  // }

  return (
    <div className="window">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <Typography variant="h4" gutterBottom className="text-center">
        Tax Invoice
      </Typography>
      <div className="w-full border border-gray-300 bg-gray-100">
        <table className="w-full border-collapse">
          <tbody>
            {/* Row 1 */}
            <tr>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>GSTIN:</strong>
                  <input
                    type="text"
                    name="gstin"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.gstin}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>EWay Bill No:</strong>
                  <input
                    type="text"
                    name="eWayBillNo"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.eWayBillNo}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2 text-right">
                <div>
                  <strong>Original for Recipient</strong>
                </div>
              </td>
            </tr>

            {/* Row 2 */}
            <tr>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>PAN:</strong>
                  <input
                    type="text"
                    name="pan"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.pan}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Transportation Mode:</strong>
                  <input
                    type="text"
                    name="transportationMode"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.transportationMode}
                    onChange={handleChange}
                  />
                </div>
              </td>
            </tr>

            {/* Row 3 */}
            <tr>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Tax is Payable on Reverse Charge:</strong>
                  <input
                    type="text"
                    name="reverseCharge"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.reverseCharge}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Vehicle No:</strong>
                  <input
                    type="text"
                    name="vehicleNo"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.vehicleNo}
                    onChange={handleChange}
                  />
                </div>
              </td>
            </tr>

            {/* Row 4 */}
            <tr>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Invoice No:</strong>
                  <input
                    type="text"
                    name="invoiceNo"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.invoiceNo}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>PO No:</strong>
                  <input
                    type="text"
                    name="poNo"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.poNo}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Date & Time of Supply:</strong>
                  <input
                    type="text"
                    name="dateOfSupply"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.dateOfSupply}
                    onChange={handleChange}
                  />
                </div>
              </td>
            </tr>

            {/* Row 5 */}
            <tr>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Invoice Date:</strong>
                  <input
                    type="text"
                    name="invoiceDate"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.invoiceDate}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>PO Date:</strong>
                  <input
                    type="text"
                    name="poDate"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.poDate}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Place of Supply:</strong>
                  <input
                    type="text"
                    name="placeOfSupply"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.placeOfSupply}
                    onChange={handleChange}
                  />
                </div>
              </td>
            </tr>

            {/* Row 6 - Billed To & Shipped To headers */}
            <tr>
              <td
                colSpan="2"
                className="border border-gray-300 p-2 bg-gray-200"
              >
                <div className="font-bold">Billed To:</div>
              </td>
              <td className="border border-gray-300 p-2 bg-gray-200">
                <div className="font-bold">Shipped To:</div>
              </td>
            </tr>

            {/* Row 7 - Names */}
            <tr>
              <td colSpan="2" className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Name:</strong>
                  <input
                    type="text"
                    name="billedToName"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.billedToName}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Name:</strong>
                  <input
                    type="text"
                    name="shippedToName"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.shippedToName}
                    onChange={handleChange}
                  />
                </div>
              </td>
            </tr>

            {/* Row 8 - Addresses */}
            <tr>
              <td colSpan="2" className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Address:</strong>
                  <input
                    type="text"
                    name="billedToAddress"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.billedToAddress}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Address:</strong>
                  <input
                    type="text"
                    name="shippedToAddress"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.shippedToAddress}
                    onChange={handleChange}
                  />
                </div>
              </td>
            </tr>

            {/* Row 9 - Phone numbers */}
            <tr>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Phone:</strong>
                  <input
                    type="text"
                    name="billedToPhone"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.billedToPhone}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>Mobile:</strong>
                  <input
                    type="text"
                    name="billedToMobile"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.billedToMobile}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div>
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td
                          className="border-r border-gray-300"
                          style={{ width: "50%" }}
                        >
                          <div className="flex items-center">
                            <strong>Phone:</strong>
                            <input
                              type="text"
                              name="shippedToPhone"
                              className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                              value={invoiceData.shippedToPhone}
                              onChange={handleChange}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <strong>Mobile:</strong>
                            <input
                              type="text"
                              name="shippedToMobile"
                              className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                              value={invoiceData.shippedToMobile}
                              onChange={handleChange}
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>

            {/* Row 10 - State & PAN */}
            <tr>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>State:</strong>
                  <input
                    type="text"
                    name="billedToState"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.billedToState}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>PAN:</strong>
                  <input
                    type="text"
                    name="billedToPan"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.billedToPan}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div>
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td
                          className="border-r border-gray-300"
                          style={{ width: "50%" }}
                        >
                          <div className="flex items-center">
                            <strong>State:</strong>
                            <input
                              type="text"
                              name="shippedToState"
                              className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                              value={invoiceData.shippedToState}
                              onChange={handleChange}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <strong>PAN:</strong>
                            <input
                              type="text"
                              name="shippedToPan"
                              className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                              value={invoiceData.shippedToPan}
                              onChange={handleChange}
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>

            {/* Row 11 - GSTIN */}
            <tr>
              <td colSpan="2" className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>GSTIN/UID:</strong>
                  <input
                    type="text"
                    name="billedToGstin"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.billedToGstin}
                    onChange={handleChange}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <strong>GSTIN/UID:</strong>
                  <input
                    type="text"
                    name="shippedToGstin"
                    className="ml-1 w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                    value={invoiceData.shippedToGstin}
                    onChange={handleChange}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Container maxWidth="xl" style={{ padding: "0px", marginTop: "20px" }}>
        {/* Input for New Item */}
        <div
          style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
          className="no-print"
        >
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            style={{ backgroundColor: "#f5f5f5" }}
          />
          <TextField
            label="Qty"
            variant="outlined"
            type="number"
            style={{ backgroundColor: "#f5f5f5" }}
            value={newItem.qty}
            onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
          />
          <TextField
            label="Rate"
            variant="outlined"
            style={{ backgroundColor: "#f5f5f5" }}
            type="number"
            value={newItem.rate}
            onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={addItem}>
            Add Item
          </Button>
        </div>

        {/* Invoice Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.qty * item.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals */}
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Subtotal: ₹{subtotal}
        </Typography>
        <Typography>
          GST {"->"} CGST + SGST ({gst}%): ₹{gstAmount}
        </Typography>
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          Net Amount: ₹{netAmount}
        </Typography>

        {/* Buttons */}
        <div style={{ marginTop: "20px" }} className="no-print">
          <Button
            variant="contained"
            color="primary"
            onClick={saveInvoice}
            style={{ marginRight: "10px" }}
          >
            Save Invoice
          </Button>
          <Button variant="contained" color="secondary" onClick={printInvoice}>
            Print Invoice
          </Button>
        </div>

        {/* Invoice List */}
        <Typography variant="h5" style={{ marginTop: "30px" }}>
          Saved Invoices
        </Typography>
        <ul>
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              Invoice: ₹{invoice.total} (GST: ₹{invoice.gst})
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
