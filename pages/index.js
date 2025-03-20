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

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Billing System
      </Typography>

      {/* Input for New Item */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
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
        GST ({gst}%): ₹{gstAmount}
      </Typography>
      <Typography variant="h6" style={{ fontWeight: "bold" }}>
        Net Amount: ₹{netAmount}
      </Typography>

      {/* Buttons */}
      <div style={{ marginTop: "20px" }}>
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
  );
}
