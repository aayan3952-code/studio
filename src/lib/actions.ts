'use server';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase';
import { serviceAgreementSchema, type FormValues } from './schemas';

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
    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error("Error saving to Firestore: ", error);
    return { success: false, error: 'Failed to save agreement. Please try again.' };
  }
}
