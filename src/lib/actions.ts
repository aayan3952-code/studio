
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
        date: parsedData.data.date.toISOString(), // Convert Date object to string BEFORE saving
        status: 'Submitted',
        submittedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(firestore, 'serviceAgreements'), agreementData);
    
    return { success: true, docId: docRef.id };
  } catch (error: any) {
    console.error("Error during agreement save: ", error);
    const errorMessage = `Failed to save agreement: ${error.message || String(error)}`;
    return { success: false, error: errorMessage };
  }
}

export async function sendConfirmationEmail(agreementId: string) {
    try {
        const agreementDataResult = await getAgreement(agreementId);
        if (!agreementDataResult.success || !agreementDataResult.data) {
            throw new Error('Agreement not found.');
        }
        
        // The type assertion is safe because we checked for success.
        const agreementData = agreementDataResult.data as FormValues & { id: string; submittedAt: string; date: string; status: string; };

        await sendContractEmail(agreementData);
        return { success: true };
    } catch (error: any) {
        console.error("Error sending confirmation email: ", error);
        return { success: false, error: error.message };
    }
}


export async function getAgreement(id: string) {
  try {
    const docRef = doc(firestore, 'serviceAgreements', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Firestore Timestamps need to be converted for serialization.
      // The 'date' field is already a string from our `saveAgreement` fix.
      const submittedAt = data.submittedAt ? data.submittedAt.toDate().toISOString() : new Date().toISOString();
      
      return { 
        success: true, 
        data: {
          ...data,
          id: docSnap.id,
          submittedAt,
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
        // date is already a string
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
