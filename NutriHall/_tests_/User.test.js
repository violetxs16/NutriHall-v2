const { ref, get } = require("firebase/database");
const { database } = require("../src/firebaseConfig");

describe("Firebase Database Tests Users", () => {
  it("should fetch the account info-calorie range for specific users", async () => {
      const user_name = "0ggYor0lQIdyWMzgKtcmE2ml74s1";
      const user_name_ref = ref(database, `users/${user_name}`);
      const snapshot = await get(user_name_ref);
      if(snapshot.exists()){
        const data = snapshot.val();
        //Assertions
        expect(data.accountInfo.name).toBe("Artem")
        expect(data.preferences.calorieRange).toBe(2223)
      }else{
        throw new Error("User does not exist");
      }
  });
  it("should fetch the account history for specific users", async () => {
    const user_name = "fGtDykrhLQc86sqy0bllmKk8qYH3";
    const user_name_ref = ref(database, `users/${user_name}`);
    const snapshot = await get(user_name_ref);
    if(snapshot.exists()){
      const data = snapshot.val();
      //Assertions
      expect(data.accountInfo.name).toBe("Violeta Solorio")
      expect(data.history.OB7gwABgm20n4FfI3AZ.id).toBe("Chicken & Rice Soup")
    }else{
      throw new Error("User does not exist");
    }
  });

});
