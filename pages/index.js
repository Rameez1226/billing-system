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
  InputAdornment,
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
  const [newItem, setNewItem] = useState({
    name: "",
    hsn_sac: "",
    qty: "",
    rate: "",
  });
  const [gst, setGst] = useState(5);
  const [invoices, setInvoices] = useState([]);
  const [billStatus, setBillStatus] = useState(true);

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const gstAmount = (subtotal * ((gst || 5) / 2)) / 100;
  const cgstAmount = (subtotal * ((gst || 5) / 2)) / 100;

  const amountBeforeRoundOff = subtotal + gstAmount + cgstAmount;

  const roundOff = Math.round(amountBeforeRoundOff) - amountBeforeRoundOff;
  const netAmount = amountBeforeRoundOff + roundOff;

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
    setNewItem({ name: "", qty: "", rate: "", hsn_sac: "" });
  };

  // Save Invoice to Firestore
  const saveInvoice = async () => {
    if (items.length === 0) {
      alert("Add at least one item!");
      return;
    }

    try {
      items?.map(async (item) => {
        const invoiceDataItem = {
          ...invoiceData,
          total: subtotal,
          gst: gstAmount,
          itemTotal: item.rate,
          itemGst: (item.rate * (gst || 5)) / 100,
          timestamp: new Date(),
          itemName: item.name,
          qty: item?.qty,
          gstPercent: gst || 5,
        };

        await addDoc(collection(db, "billing"), invoiceDataItem);
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
    saveInvoice();
    window.print();
  };

  const [invoiceData, setInvoiceData] = useState({
    gstin: "32AVAPT8082AIZS",
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
    .table-container {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    .window{
      padding: 5px 0px;
    }
    .textReduceNormal{
      font-size: 12px !important; 
    }
    .textReduceTitle{
      font-size: 20px !important; 
    }
    body {
      zoom: 1;
      font-size: 12px !important; 
    }
    a {
      color: black !important; /* Keep links styled like regular text */
      text-decoration: none !important; /* Remove underline */
    }
    a::after {
      content: "" !important; /* Prevents URLs from appearing */
    }
    a[href]:after {
      content: "" !important; /* Remove appended URLs */
    }
    @page {
      size: auto;
      margin: 0;
      padding: 15px 25px;
    }
    td {
      padding: 3px !important;
    }
    th {
      padding: 6px !important;
    }
    strong {
      font-size: 12px !important; 
    }
  }
`;

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      // maxWidth: "100%",
      width: "100%",
      // margin: "0 auto",
      padding: "0px 5px",
      marginLeft: "auto",
      display: "flex",
      backgroundColor: "#fff",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    labelCell: {
      padding: "8px",
      color: "#555",
      fontWeight: "500",
      borderBottom: "1px solid #eee",
      textAlign: "left",
    },
    valueCell: {
      padding: "8px",
      color: "#333",
      borderBottom: "1px solid #eee",
      textAlign: "right",
    },
    spacerRow: {
      height: "16px",
    },
  };

  function numberToWordsINR(num) {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
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
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const denominations = ["", "Thousand", "Lakh", "Crore"];

    function convertChunk(n) {
      let str = "";
      if (n >= 100) {
        str += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n >= 20) {
        str += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      }
      if (n > 0) {
        str += ones[n] + " ";
      }
      return str.trim();
    }

    function convertInteger(n) {
      if (n === 0) return "Zero";

      let word = "";
      const parts = [];

      parts.push(n % 1000); // Hundreds
      n = Math.floor(n / 1000);
      parts.push(n % 100); // Thousands
      n = Math.floor(n / 100);
      parts.push(n % 100); // Lakhs
      n = Math.floor(n / 100);
      parts.push(n); // Crores

      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i] > 0) {
          word += convertChunk(parts[i]) + " " + denominations[i] + " ";
        }
      }

      return word.trim();
    }

    return "Rupees " + convertInteger(num) + " Only";
  }

  if (invoices.length === 0) return <p>No invoices available</p>;

  // Extracting all unique keys from the invoice objects
  const allKeys = Array.from(new Set(invoices.flatMap(Object.keys)));

  return (
    <div className="window table-container">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <Button
        variant="contained"
        color="success"
        onClick={() => setBillStatus((pre) => !pre)}
        style={{
          marginRight: "10px",
          position: "absolute",
          top: "30px",
          right: "10px",
        }}
        className="no-print"
      >
        {billStatus ? " Transaction History" : "Print Invoice"}
      </Button>
      <Typography
        variant="h2"
        gutterBottom
        className="text-center textReduceTitle"
        style={{ marginBottom: "0px" }}
      >
        P.T SPICES
      </Typography>
      <Typography
        variant="h6"
        gutterBottom
        className="text-center textReduceNormal"
        style={{ width: "70%", margin: "0 auto" }}
      >
        VELLUVANGAD SOUTH. Ρ.Ο, PANDIKKAD - 676 521 MALAPPURAM Dt., KERALA, Mob:
        9496841060, 9037661765, Email: ptspicespkd@gmail.com
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        className="text-center textReduceTitle"
      >
        Tax Invoice
      </Typography>
      {billStatus ? (
        <>
          {" "}
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
                    <div className="font-bold" style={{ textAlign: "center" }}>
                      Billed To:
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2 bg-gray-200">
                    <div className="font-bold" style={{ textAlign: "center" }}>
                      Shipped To:
                    </div>
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
          <TextField
            label="GST"
            variant="outlined"
            className="no-print"
            type="text"
            slotProps={{
              input: {
                endAdornment: "%",
              },
            }}
            style={{ backgroundColor: "#f5f5f5", marginTop: "20px" }}
            value={gst}
            onChange={(e) => {
              const value = e.target.value;
              // Remove any non-numeric characters except decimal point
              const sanitizedValue = value.replace(/[^0-9.]/g, "");
              // Ensure only one decimal point
              const finalValue = sanitizedValue.replace(
                /\./g,
                (match, offset, string) => {
                  return string.indexOf(".") === offset ? match : "";
                }
              );
              setGst(Number(finalValue));
            }}
            inputProps={{
              inputMode: "decimal",
            }}
          />
          <div
            maxWidth="xl"
            style={{ padding: "0px", marginTop: "20px", width: "100%" }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "8px",
                justifyContent: "space-between",
                display: "flex",
              }}
              className="no-print bgNone"
            >
              <TextField
                label="Item Name"
                variant="outlined"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                style={{ backgroundColor: "#f5f5f5", width: "50%" }}
              />
              <TextField
                label="HSN/ SAC"
                variant="outlined"
                type="text"
                style={{ backgroundColor: "#f5f5f5" }}
                value={newItem.hsn_sac}
                onChange={(e) =>
                  setNewItem({ ...newItem, hsn_sac: e.target.value })
                }
              />
              <TextField
                label="Qty"
                variant="outlined"
                type="text"
                slotProps={{
                  input: {
                    endAdornment: "kg",
                  },
                }}
                style={{ backgroundColor: "#f5f5f5" }}
                value={newItem.qty}
                onChange={(e) => {
                  const value = e.target.value;
                  // Remove any non-numeric characters except decimal point
                  const sanitizedValue = value.replace(/[^0-9.]/g, "");
                  // Ensure only one decimal point
                  const finalValue = sanitizedValue.replace(
                    /\./g,
                    (match, offset, string) => {
                      return string.indexOf(".") === offset ? match : "";
                    }
                  );
                  setNewItem({ ...newItem, qty: finalValue });
                }}
                inputProps={{
                  inputMode: "decimal",
                }}
              />
              <TextField
                label="Rate"
                variant="outlined"
                style={{ backgroundColor: "#f5f5f5" }}
                type="text"
                value={newItem.rate}
                onChange={(e) => {
                  const value = e.target.value;
                  // Remove any non-numeric characters except decimal point
                  const sanitizedValue = value.replace(/[^0-9.]/g, "");
                  // Ensure only one decimal point
                  const finalValue = sanitizedValue.replace(
                    /\./g,
                    (match, offset, string) => {
                      return string.indexOf(".") === offset ? match : "";
                    }
                  );
                  setNewItem({ ...newItem, rate: finalValue });
                }}
                inputProps={{
                  inputMode: "decimal",
                }}
              />
              <Button variant="contained" color="primary" onClick={addItem}>
                Add Item
              </Button>
            </div>

            {/* Invoice Table */}
            {items?.length > 0 && (
              <>
                <TableContainer component={Paper} className="table-container">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Description of Goods/ Service</TableCell>
                        <TableCell>HSN/SAC</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.hsn_sac}</TableCell>
                          <TableCell>{item.qty}</TableCell>
                          <TableCell>{item.rate}</TableCell>
                          <TableCell>{item.qty * item.rate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <div style={styles.container} className="table-container">
                  <div style={{ width: "70%" }}></div>
                  <div style={{ width: "30%" }}>
                    <table style={styles.table}>
                      <tbody>
                        <tr>
                          <td style={styles.labelCell}>Less Discount:</td>
                          <td style={styles.valueCell}>0.00</td>
                        </tr>
                        <tr>
                          <td style={styles.labelCell}>Net Value:</td>
                          <td style={styles.valueCell}>{subtotal}</td>
                        </tr>

                        {/* <tr style={styles.spacerRow}>
                      <td colSpan="2"></td>
                    </tr> */}

                        <tr>
                          <td style={styles.labelCell}>CGST Collected:</td>
                          <td style={styles.valueCell}>{gstAmount}</td>
                        </tr>
                        <tr>
                          <td style={styles.labelCell}>SGST Collected:</td>
                          <td style={styles.valueCell}>{cgstAmount}</td>
                        </tr>

                        {/* <tr style={styles.spacerRow}>
                      <td colSpan="2"></td>
                    </tr> */}

                        <tr>
                          <td style={styles.labelCell}>Round Off:</td>
                          <td style={styles.valueCell}>
                            {roundOff.toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ ...styles.labelCell, fontWeight: "bold" }}
                          >
                            Net Amount:
                          </td>
                          <td
                            style={{ ...styles.valueCell, fontWeight: "bold" }}
                          >
                            {netAmount.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #00000063",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      border: "1px solid #00000063",
                    }}
                  >
                    <span
                      className="textReduceNormal"
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: "5px 20px",
                        fontSize: "14px",
                      }}
                    >
                      <strong> {numberToWordsINR(netAmount.toFixed(2))}</strong>
                    </span>
                    <span
                      // className="text-center"
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: "5px 20px",
                        fontSize: "14px",
                      }}
                    ></span>
                  </div>
                  <div
                    style={{
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span
                      className="textReduceNormal"
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: "5px 20px",
                        fontSize: "14px",
                        color: "black",
                      }}
                    >
                      E&OE
                    </span>
                    <span
                      className="textReduceNormal"
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: "5px 20px",
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <strong>P.T Spices </strong>
                    </span>
                  </div>
                  <hr style={{ width: "70%" }}></hr>

                  <div
                    style={{
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span
                      className="textReduceNormal"
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: "5px 20px",
                        fontSize: "14px",
                      }}
                    >
                      <strong>
                        {" "}
                        GST -@ 5% :{netAmount.toFixed(2)}{" "}
                        {` (cgst: ${gstAmount},sgst: ${cgstAmount} )`}
                      </strong>
                    </span>
                    <span
                      // className="text-center"
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: "5px 20px",
                        fontSize: "14px",
                      }}
                    ></span>
                  </div>
                  <hr style={{ width: "70%" }}></hr>

                  <div
                    style={{
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span
                      className="textReduceNormal"
                      style={{
                        width: "120%",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: "5px 20px",
                        fontSize: "14px",
                        color: "black",
                      }}
                    >
                      <strong> BANKS DETAILS: </strong> P.T. SPICES A/c.No:
                      11200200424417 IFSC: FDRL0001120 FEDERAL BANK PANDIKKAD
                    </span>
                    <span
                      // className="text-center"
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: "5px 20px",
                        fontSize: "14px",
                      }}
                    ></span>
                  </div>
                  <hr style={{ width: "70%" }}></hr>

                  <div
                    style={{
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span
                      className="textReduceNormal"
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: "5px 20px",
                        fontSize: "14px",
                      }}
                    >
                      <strong>
                        {" "}
                        certified that the particulars given above are strue and
                        correct
                      </strong>
                    </span>
                    <span
                      className="textReduceNormal"
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: "5px 20px",
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <strong> Authorized Signatory </strong>
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Buttons */}
            <div style={{ marginTop: "20px" }} className="no-print">
              {/* <Button
            variant="contained"
            color="primary"
            onClick={saveInvoice}
            style={{ marginRight: "10px" }}
            disabled={items?.length === 0}
          >
            Save Invoice
          </Button> */}
              <Button
                variant="contained"
                color="secondary"
                onClick={printInvoice}
                disabled={items?.length === 0}
              >
                Print Invoice
              </Button>
            </div>

            {/* Invoice List */}
            {/* <Typography variant="h5" style={{ marginTop: "30px" }}>
          Saved Invoices
        </Typography>
        <ul>
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              Invoice: ₹{invoice.total} (GST: ₹{invoice.gst})
            </li>
          ))}
        </ul> */}
          </div>
        </>
      ) : (
        <div className="overflow-x-auto p-4">
          <Table>
            <TableHead>
              <TableRow>
                {allKeys.map((key) => (
                  <TableCell key={key} className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  {allKeys.map((key) => (
                    <TableCell key={key}>
                      {typeof invoice[key] === "object" && invoice[key] !== null
                        ? JSON.stringify(invoice[key]) // Handle nested objects
                        : invoice[key] ?? "—"}{" "}
                      {/* Handle undefined values */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
