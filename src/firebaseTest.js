
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export async function testFirebaseConnection() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    console.log(
      "Firebase connected. Products found:",
      snapshot.size
    );
    return true;
  } catch (error) {
    console.error("Firebase connection failed:", error.code, error.message);
    return false;
  }
}
