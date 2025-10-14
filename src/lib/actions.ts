
'use server';

import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '@/lib/firebase';
import { serviceAgreementSchema, type FormValues } from '@/lib/schemas';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { sendContractEmail } from '@/lib/email';

export async function saveAgreement(data: FormValues) {
  const parsedData = serviceAgreementSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    return { success: false, error: `Validation failed: ${errorMessages}` };
  }

  try {
    const agreementData = {
        ...parsedData.data,
        date: parsedData.data.date.toISOString(),
        status: 'Submitted',
        submittedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(firestore, 'serviceAgreements'), agreementData);
    
    // Automatically send email on successful submission
    try {
      const fullAgreementDataForEmail = {
          ...parsedData.data,
          id: docRef.id,
          date: parsedData.data.date.toISOString(),
          submittedAt: new Date().toISOString(), // Use current time as submission time for email
      };
      await sendContractEmail(fullAgreementDataForEmail);
    } catch (emailError: any) {
      // Log the email error but don't block the user.
      // The submission was successful, only the email failed.
      console.error('Submission successful, but confirmation email failed to send:', emailError);
    }

    return { success: true, docId: docRef.id };
  } catch (error: any) {
    console.error("Error during agreement save: ", error);
    const errorMessage = `Failed to save agreement: ${error.message || String(error)}`;
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
          submittedAt: data.submittedAt ? data.submittedAt.toDate().toLocaleString() : new Date().toLocaleString(),
          date: new Date(data.date).toLocaleDateString(),
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
