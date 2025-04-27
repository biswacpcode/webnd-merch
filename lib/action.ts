'use server'
import { ID, Query } from "node-appwrite";
import { database, storage} from "./appwrite.config";
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