'use server';

import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { serviceAgreementSchema, type FormValues } from './schemas';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { generateEmails } from '@/ai/flows/generate-email-flow';

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
    const docRef = await addDoc(collection(firestore, 'serviceAgreements'), {
        ...parsedData.data,
        status: 'Submitted',
        submittedAt: serverTimestamp(),
    });
    
    // Generate email content after saving
    try {
        const emailContent = await generateEmails({
            formData: parsedData.data,
            trackingId: docRef.id,
        });
        console.log("------- Admin Email HTML -------");
        console.log(emailContent.adminEmail);
        console.log("---------------------------------");
        
        console.log("------- User Email HTML --------");
        console.log(emailContent.userEmail);
        console.log("--------------------------------");

    } catch (emailError) {
        console.error("Error generating email content: ", emailError);
        // We don't want to block the user if email generation fails
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
        submittedAt: data.submittedAt ? data.submittedAt.toISOString() : null,
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
