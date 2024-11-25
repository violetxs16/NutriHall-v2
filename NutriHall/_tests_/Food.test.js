const {ref, get, set, remove} = require("firebase/database");
const {database} = require("../src/firebaseConfig.js");

describe("Firebase Database Food Tests", () => {
    let foodData = {}; //Used to store fetched food items for reuse across tests
    const testFoodNames = [
        "Cheesy Garlic Bread Sticks",
        "Meatballs",
        "Pork Sausage Patties",
        "Spanish Rice With Peas And Corn",
        "Breaded Pork Chops",
        "Brownie M&M",
        "Cheese Quesadilla"
    ]
    beforeAll(async() => { //BeforeAll runs before all tests in this suite
        for(const foodName of testFoodNames){//Iterate through all food names in food names array
            const foodRef = ref(database, `food/${foodName}`);//Check to see if they are in the database
            const snapshot = await get(foodRef);

            if(snapshot.exists()){//Store food value in the temporary array for test & validate foods that will be used in test
                foodData[foodName] = snapshot.val();//
            }else{
                throw new Error(`Food item ${foodName} not found in database`);
            }
        }
    });
    afterAll(async () => {//Runs once after all tests in this suite
        //Removes each corresponding item from the database
      /*  for (const foodName of foodData){
            const foodRef = ref(database, `food/${foodName}`);
            await remove(foodRef)
        }*/
    });
    describe("Food tests: restrictions, dining Halls, mealPeriods, nutrition ", () => {
        it("should fetch the restrictions for a specific food item", async () => {
            const foodName = "Cheesy Garlic Bread Sticks";
            const data = foodData[foodName];//Fetch data from already grabbed food item from the database
            
            //Assertion, ensure same name and expected restrictions
            expect(data.name).toBe(foodName);//Ensure we are looking at same item
            expect(data.restrictions).toEqual(expect.arrayContaining(["vegetarian","soy","eggs", "milk"]));

        });
        it("should fetch the dining halls for a specific food item", async () => {
            const foodName = "Meatballs";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.diningHalls).toBe(expect.arrayContaining(["Rachel Carson & Oakes"]))
        });
        it("should fetch the meal periods for a specific food item", async () => {
            const foodName = "Pork Sausage Patties";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.mealPeriods).toEqual(expect.arrayContaining["breakfast"]);
        });
        it("should fetch the nutrition information-protein for a specific food item", async () => {
            const foodName = "Spanish Rice With Peas And Corn";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.protein).toContain("1.7g");
        });
        it("should fetch the nutrition information-calcium", async() => {
            const foodName = "Spanish Rice With Peas And Corn";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.calcium).toContain("");
        });
        it("should fetch the nutrition information-calories", async() => {
            const foodName = "Spanish Rice With Peas And Corn";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.calories).toContain("90");
        });
        it("should fetch the nutrition information-cholesterol", async() => {
            const foodName = "Spanish Rice With Peas And Corn";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.cholesterol).toContain("0mg");
        });
        it("should fetch the nutrition information-dietary fiber", async() => {
            const foodName = "Breaded Pork Chops";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.dietaryFiber).toContain("0.4g");
        });
        it("should fetch the nutrition information-iron", async() => {
            const foodName = "Breaded Pork Chops";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.iron).toContain("");
        });
        it("should fetch the nutrition information-potassium", async() => {
            const foodName = "Breaded Pork Chops";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.potassium).toContain("");
        });
        it("should fetch the nutrition information-protein", async() => {
            const foodName = "Brownie M&M";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.protein).toContain("3.5g");
        });
        it("should fetch the nutrition information-satFat", async() => {
            const foodName = "Brownie M&M";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.satFat).toContain("3.5g");
        });
        it("should fetch the nutrition information-sodium", async() => {
            const foodName = "Brownie M&M";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.sodium).toContain("214.8mg");
        });
        it("should fetch the nutrition information-sugars", async() => {
            const foodName = "Brownie M&M";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.sugars).toContain("40.2g");
        });
        it("should fetch the nutrition information-total carbs", async() => {
            const foodName = "Brownie M&M";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.totalCarb).toContain("55.8g");
        });
        it("should fetch the nutrition information-total fat", async() => {
            const foodName = "Brownie M&M";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.totalFat).toContain("11.8g");
        });
        it("should fetch the nutrition information-trans Fat", async() => {
            const foodName = "Brownie M&M";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.transFat).toContain("0.1g");
        });
        it("should fetch the nutrition information-vitaminD", async() => {
            const foodName = "Brownie M&M";
            const data = foodData[foodName];

            //Assertions
            expect(data.name).toBe(foodName);
            expect(data.nutrition.vitaminD).toContain("");
        });
    });

});