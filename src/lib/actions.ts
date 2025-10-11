'use server';

import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { serviceAgreementSchema, type FormValues } from './schemas';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { sendContractEmail } from './email';
import { generateContractPdf } from './pdf';

export async function saveAgreement(data: FormValues) {
  const parsedData = serviceAgreementSchema.safeParse(data);

  if (!parsedData.success) {
    let errorMessages = '';
    parsedData.error.issues.forEach((issue) => {
      errorMessages = errorMessages + issue.path[0] + ': ' + issue.message + '. ';
    });
    return { success: false, error: errorMessages };
  }

  try {
    const agreementData = {
        ...parsedData.data,
        status: 'Submitted',
        submittedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(firestore, 'serviceAgreements'), agreementData);

    // After saving, generate PDF and send email
    try {
        const fullAgreementData = {
            ...agreementData,
            id: docRef.id,
            date: agreementData.date.toISOString(),
            submittedAt: new Date().toISOString(), // Use current date as timestamp is on server
        }
        
        const pdfBuffer = await generateContractPdf(fullAgreementData);
        
        await sendContractEmail(fullAgreementData, pdfBuffer);

    } catch (emailOrPdfError) {
        console.error("Error generating PDF or sending email: ", emailOrPdfError);
        // Don't block the user response for this, just log the error.
        // In a real-world scenario, you might add this to a retry queue.
    }
    
    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error("Error saving to Firestore: ", error);
    return { success: false, error: 'Failed to save agreement. Please try again.' };
  }
}

export async function getAgreement(id: string) {
  try {
    const docRef = doc(firestore, 'serviceAgreements', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        success: true, 
        data: {
          ...data,
          id: docSnap.id,
          // Convert Firestore Timestamps to serializable strings
          date: data.date.toDate().toISOString(),
          submittedAt: data.submittedAt ? data.submittedAt.toDate().toISOString() : null,
        }
      };
    } else {
      return { success: false, error: 'No such document!' };
    }
  } catch (error) {
    console.error("Error fetching from Firestore: ", error);
    return { success: false, error: 'Failed to fetch agreement. Please try again.' };
  }
}

export async function getAllAgreements() {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'serviceAgreements'));
    const agreements = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        date: data.date.toDate().toISOString(),
        submittedAt: data.submittedAt ? data.submittedAt.toDate().toISOString() : null,
      }
    });
    return { success: true, data: agreements };
  } catch (error) {
    console.error("Error fetching all agreements: ", error);
    return { success: false, error: 'Failed to fetch agreements.' };
  }
}

export async function updateAgreementStatus(id: string, status: string) {
  try {
    const docRef = doc(firestore, 'serviceAgreements', id);
    await updateDoc(docRef, { status });
    return { success: true };
  } catch (error) {
    console.error("Error updating status: ", error);
    return { success: false, error: 'Failed to update status.' };
  }
}

export async function deleteAgreement(id: string) {
  try {
    const docRef = doc(firestore, 'serviceAgreements', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting agreement: ", error);
    return { success: false, error: 'Failed to delete agreement.' };
  }
}


export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    return { success: true, idToken };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
