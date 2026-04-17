import { useLebenStore } from "../src/store/useStore";

// This script can be run if we had a CLI for the store, 
// but since it's a browser store, we can just use the browser console.
// I'll provide instructions in the walkthrough.

export const triggerTestNotification = () => {
  const add = useLebenStore.getState().addNotification;
  add({
    id: "test-" + Date.now(),
    title: "Test Notification",
    body: "This is a test notification to verify the red dot."
  });
};
