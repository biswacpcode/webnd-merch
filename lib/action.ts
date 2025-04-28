'use server'
import { ID, Query } from "node-appwrite";
import { database, storage} from "./appwrite.config";

import nodemailer from "nodemailer";
const {
  DATABASE_ID, BUCKET_ID, NEXT_PUBLIC_ENDPOINT, PROJECT_ID, MERCH_COLLECTION_ID
} = process.env;

export async function UploadFile(payment: File){
  const uploadedFile = await storage.createFile(
    process.env.BUCKET_ID as string,
    ID.unique(),
    payment, // 👈 Upload buffer directly
  );

  return `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${PROJECT_ID}`;
}

export async function CreateMerchRequest(formData: FormData, count: number, imageUrl: string | null) {
  try {
    // Convert FormData to a plain object
    const id = formData.get("id") as string;
    const type = formData.get("type") as string;
    const userName = formData.get("userName") as string;
    const userEmail = formData.get("userEmail") as string;
    const userRoll = formData.get("userRoll") as string;
    const nameToPrint = formData.get("nameToPrint") as string;
    const size = formData.get("size") as string;
    const position = formData.get("position") as string;
    const payment = formData.get("payment") as File;
    const member = formData.get("member") === "true"; // convert string to boolean


    if(count === 1 && (!imageUrl)){
  
      if (payment) {
        // Convert image to Node.js Buffer (safe on server)
        const uploadedFile = await storage.createFile(
          process.env.BUCKET_ID as string,
          ID.unique(),
          payment, // 👈 Upload buffer directly
        );
  
        imageUrl = `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${PROJECT_ID}`;
      }
    }
    const data = {
      id,
      type,
      userName,
      userEmail,
      userRoll,
      nameToPrint,
      size,
      position,
      payment: imageUrl,
      member,
    };


    // Create document in MERCH_COLLECTION_ID
    const response = await database.createDocument(
      DATABASE_ID!,         // Database ID
      MERCH_COLLECTION_ID!, // Collection ID for Merch Requests
      "unique()",                      // Let Appwrite generate a unique ID
      data                             // Document data
    );



    return { success: true, image: imageUrl };
  } catch (error) {
    console.error("CreateMerchRequest error:", error);
    return { success: false, message: error };
  }
}

export async function AllOrders() {
  try {

    // Create document in MERCH_COLLECTION_ID
    const response = await database.listDocuments(
      DATABASE_ID!,         // Database ID
      MERCH_COLLECTION_ID!, // Collection ID for Merch Requests
      [Query.limit(400)]
    );
    const result = response.documents.map((doc) => ({
      $id:doc.$id,
      id: doc.id,
      type: doc.type,
      userName: doc.userName,
      userEmail: doc.userEmail,
      userRoll: doc.userRoll,
      nameToPrint: doc.nameToPrint,
      size: doc.size,
      position: doc.position,
      payment: doc.payment,
      status: doc.status
    }));
    

    return result;
  } catch (error) {
    console.error("CreateMerchRequest error:", error);
    return [];
  }
}

export async function UpdateStatus(id: string, accepted: boolean){
  await database.updateDocument(
    DATABASE_ID!,
    MERCH_COLLECTION_ID!,
    id, 
    {
      status: accepted? "accepted" : "rejected"
    }
  )
}


interface TshirtDetails {
  name: string;
  size: string;
  position?: string;
  status?:string;
}

interface Product {
  name: string;
  price: number;
}

export interface SendOrderEmailProps {
  toEmail: string;
  formData: any;
  product: Product;
  quantity: number;
  tshirtDetails: TshirtDetails[];
  orderId: string;
}

export async function sendOrderEmail({
  toEmail,
  formData,
  product,
  quantity,
  tshirtDetails,
  orderId,
}: SendOrderEmailProps) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // your email (example@gmail.com)
      pass: process.env.GMAIL_PASS, // app password (NOT your email password)
    },
  });

  const totalPrice = quantity === 6 ? product.price * 5 : product.price * quantity;

  const emailHtml = `
    <div style="font-family: 'Inter', sans-serif; max-width:600px; margin:auto; padding:20px; background:#f9fafb; border-radius:12px;">
      <h2 style="text-align:center; font-size:24px; font-weight:bold; margin-bottom:20px;">Order Summary</h2>

      <div style="background:#f3f4f6; padding:16px; border-radius:8px; margin-bottom:20px;">
        <h3 style="font-weight:600; margin-bottom:8px;">Customer Information</h3>
        <table style="width:100%; font-size:14px;">
          <tbody>
            <tr><td><strong>Name:</strong></td><td>${formData.name}</td></tr>
            <tr><td><strong>Roll Number:</strong></td><td>${formData.rollNumber}</td></tr>
            <tr><td><strong>Degree:</strong></td><td>${formData.degree}</td></tr>
            <tr><td><strong>Year:</strong></td><td>${formData.year}</td></tr>
            <tr><td><strong>Hostel:</strong></td><td>${formData.hostel}</td></tr>
            <tr><td><strong>WebnD Member:</strong></td><td>${formData.isMember ? "Yes" : "No"}</td></tr>
          </tbody>
        </table>
      </div>

      <div style="background:#e5e7eb; padding:16px; border-radius:8px; margin-bottom:20px;">
        <h3 style="font-weight:600; margin-bottom:8px;">Order Details</h3>
        <div style="display:flex; justify-content:space-between; font-size:14px;">
          <span>${product.name} × ${quantity}</span>
          <span>
            ${
              quantity === 6
                ? `<span style="text-decoration:line-through; color:#9ca3af; margin-right:8px;">₹${product.price * 6}</span>
                   <span style="font-weight:700; color:#16a34a;">₹${product.price * 5}</span>`
                : `₹${product.price * quantity}`
            }
          </span>
        </div>
      </div>

      <div style="background:#f3f4f6; padding:16px; border-radius:8px; margin-bottom:20px;">
        <h3 style="font-weight:600; margin-bottom:8px;">T-shirt Details</h3>
        ${tshirtDetails
          .map(
            (tshirt, index) => `
            <div style="border-bottom:1px solid #d1d5db; padding-bottom:8px; margin-bottom:8px;">
              <div style="font-weight:500;">T-shirt #${index + 1}</div>
              <table style="width:100%; font-size:14px; margin-top:4px;">
                <tbody>
                  <tr><td><strong>Name:</strong></td><td>${tshirt.name}</td></tr>
                  <tr><td><strong>Size:</strong></td><td>${tshirt.size.toUpperCase()}</td></tr>
                  ${
                    index === 0 && tshirt.position
                      ? `<tr><td><strong>Position:</strong></td><td>${tshirt.position}</td></tr>`
                      : ""
                  }
                </tbody>
              </table>
            </div>
          `
          )
          .join("")}
      </div>

      <div style="text-align:center; margin-top:24px;">
        <a href="https://merch.webnd-iitbbs.org/track/${orderId}" style="background:#3b82f6; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600; display:inline-block;">
          Track Your Order
        </a>
      </div>

      <p style="margin-top:20px; font-size:12px; text-align:center; color:#6b7280;">
        Thank you for supporting WebnD IIT Bhubaneswar!
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"WebnD Merch Store" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Your WebnD Merch Order Summary",
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
}


export async function GetOrdersById(orderId: string){
  try{

    const orders = await database.listDocuments(
      DATABASE_ID!,
      MERCH_COLLECTION_ID!,
      [Query.equal("id", [orderId])]
    );


    if(orders.total === 0 ){
      return null
    }
    else if (orders.total === 1){
      const doc = orders.documents[0];

      const result = {
        id: doc.id,
        type: doc.type,
        userName: doc.userName,
        userEmail: doc.userEmail,
        userRoll: doc.userRoll,
        tshirtDetails: [
          {name: doc.nameToPrint, size: doc.size, position: doc.position, status: doc.status}
        ]
        }

        return result

    }
    else{
      const tshirtDetails: any[] = []

      orders.documents.map((doc)=>{
        tshirtDetails.push({name: doc.nameToPrint, size: doc.size, position: doc.position, status: doc.status})
      })

      const doc = orders.documents[0];

      const result = {
      id: doc.id,
      type: doc.type,
      userName: doc.userName,
      userEmail: doc.userEmail,
      userRoll: doc.userRoll,
      tshirtDetails
      }

      return result
    }

  }catch(error){
    console.log("Error fetching order details : ", error);
    return null
  }
}