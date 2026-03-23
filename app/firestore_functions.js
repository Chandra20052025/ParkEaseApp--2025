// firestore_functions.js
// Shared Firestore utility functions for ParkEase
// Import and use these in any frame instead of duplicating logic

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, arrayUnion, arrayRemove, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { firebaseConfig } from './firebaseConfig.js';

// FIX: initializeApp was missing — getFirestore(app) now works correctly
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── User Functions ────────────────────────────────────────────────────────

/**
 * Create a new user document in Firestore
 */
async function createUser(userId, email, name, mobile, licenseNo, vehicleNo) {
  try {
    const userDocRef = doc(db, "Users", userId);
    await setDoc(userDocRef, {
      email,
      name,
      mobile,
      licenseNo,
      vehicleNo
    });
    console.log("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Get a user's data by userId
 */
async function getUserData(userId) {
  try {
    const userDocRef = doc(db, "Users", userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      console.error("User document does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

/**
 * Update a user's profile fields
 */
async function updateUserData(userId, updatedFields) {
  try {
    const userDocRef = doc(db, "Users", userId);
    await updateDoc(userDocRef, updatedFields);
    console.log("User updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Check if email, mobile, licenseNo, vehicleNo are unique
 * Returns { valid: true } or { valid: false, message: "..." }
 */
async function checkUniqueValues(email, mobile, licenseNo, vehicleNo) {
  const usersCollection = collection(db, "Users");

  const checks = [
    { field: "email", value: email, label: "Email" },
    { field: "mobile", value: mobile, label: "Mobile number" },
    { field: "licenseNo", value: licenseNo, label: "License number" },
    { field: "vehicleNo", value: vehicleNo, label: "Vehicle number" }
  ];

  for (const check of checks) {
    const q = query(usersCollection, where(check.field, "==", check.value));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { valid: false, message: `${check.label} already registered.` };
    }
  }

  return { valid: true };
}

// ─── Friends Functions ─────────────────────────────────────────────────────

/**
 * Add a friend to the current user's friends list
 */
async function addFriend(currentUserId, friendData) {
  try {
    const userRef = doc(db, "Users", currentUserId);
    await setDoc(userRef, {
      friends: arrayUnion(friendData)
    }, { merge: true });
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
}

/**
 * Remove a friend from the current user's friends list
 */
async function removeFriend(currentUserId, friendData) {
  try {
    const userRef = doc(db, "Users", currentUserId);
    await setDoc(userRef, {
      friends: arrayRemove(friendData)
    }, { merge: true });
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
}

// ─── Booking Functions ─────────────────────────────────────────────────────

/**
 * Cancel a booking by ID from either carBookings or bikeBookings
 * Also frees the slot document if it exists
 */
async function cancelBooking(collectionPath, bookingId) {
  try {
    const bookingRef = doc(db, collectionPath, bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) throw new Error("Booking not found");

    const bookingData = bookingSnap.data();

    await updateDoc(bookingRef, {
      cancelled: true,
      status: "Cancelled",
      lastUpdated: serverTimestamp()
    });

    // Free the slot document if it exists
    if (bookingData.slot) {
      const slotCollection = collectionPath === "carBookings" ? "carSlots" : "bikeSlots";
      const slotRef = doc(db, slotCollection, bookingData.slot);
      const slotSnap = await getDoc(slotRef);
      if (slotSnap.exists()) {
        await updateDoc(slotRef, {
          isBooked: false,
          bookedBy: null,
          lastUpdated: serverTimestamp()
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
}

/**
 * Send a parking slot request to another user
 */
async function sendParkingRequest(requestData) {
  try {
    await addDoc(collection(db, "ParkingRequests"), {
      ...requestData,
      status: "pending",
      timestamp: serverTimestamp()
    });
    console.log("Parking request sent!");
  } catch (error) {
    console.error("Error sending parking request:", error);
    throw error;
  }
}

// ─── Exports ───────────────────────────────────────────────────────────────

export {
  db,
  createUser,
  getUserData,
  updateUserData,
  checkUniqueValues,
  addFriend,
  removeFriend,
  cancelBooking,
  sendParkingRequest
};

