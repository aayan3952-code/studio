
'use server';

import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { serviceAgreementSchema, type FormValues } from './schemas';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { sendContractEmail } from './email';

export async function saveAgreement(data: FormValues) {
  const parsedData = serviceAgreementSchema.safeParse(data);

  if (!parsedData.success) {
    let errorMessages = 'Validation failed: ';
    parsedData.error.issues.forEach((issue) => {
      errorMessages += `${issue.path.join('.')}: ${issue.message}. `;
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

    const fullAgreementDataForEmail = {
        ...agreementData,
        id: docRef.id,
        date: agreementData.date.toISOString(),
        submittedAt: new Date().toISOString(),
        status: 'Submitted'
    };
    
    // The PDF generation is removed as it's causing server errors.
    // We will just send the email with the HTML body.
    await sendContractEmail(fullAgreementDataForEmail);
    
    return { success: true, docId: docRef.id };
  } catch (error: any) {
    console.error("Error during agreement processing: ", error);
    // Ensure the error is always a string, even if it's a complex object.
    const errorMessage = `Failed to process agreement: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`;
    return { success: false, error: errorMessage };
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
