import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const API_URL = "https://v2.jokeapi.dev/joke/";

// Define the route for the home page
app.get("/", (req, res) => {
  res.render("index", { content: "Enter Your Favorite Type" });
});

// Define the route to handle the form submission
app.post("/post", async (req, res) => {
  const selectedOptions = Object.keys(req.body).filter(key => req.body[key] === 'on'); // Get selected checkboxes
  const options = selectedOptions.join(','); // Join selected options into a comma-separated string

  try {
    const response = await axios.get(`${API_URL}${options}`);
    console.log("API Response:", response.data);

    if (response.data.error) {
      throw new Error(response.data.message || "Unknown error from Joke API");
    } 

    const joke = formatJoke(response.data);
    res.render("index", { content: joke });
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    console.error("Error:", errorMessage);
    res.render("index", { content: JSON.stringify(errorMessage) });
  }
});


// Function to format the joke depending on its type
function formatJoke(data) {
  if (data.error || !data) {
    return "Error fetching joke";
  }
  if (data.type === "single") {
    return data.joke;
  } else if (data.type === "twopart") {
    return `${data.setup}\n${data.delivery}`;
  } else {
    return "No joke found.";
  }
}

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
