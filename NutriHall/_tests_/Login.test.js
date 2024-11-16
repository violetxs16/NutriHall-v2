const { ref, get } = require("firebase/database");
const { database } = require("../src/firebaseConfig");

describe("Firebase Database Tests", () => {
  it("should fetch the restrictions for a specific food item", async () => {
    const foodName = "2% Lactose Free Milk"; // Example food name
    const foodRef = ref(database, `food/${foodName}`);

    const snapshot = await get(foodRef);

    if (snapshot.exists()) {
      const data = snapshot.val();

      // Assertions
      expect(data.name).toBe("2% Lactose Free Milk");
      expect(data.restrictions).toContain("Lactose-Free"); // Example restriction
    } else {
      throw new Error("Food item not found");
    }
  });
});
