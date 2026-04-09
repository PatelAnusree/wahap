#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log("✅ .env file already exists. Skipping setup.");
  process.exit(0);
}

// Read .env.example
const envExamplePath = path.join(__dirname, ".env.example");
let exampleContent = "MONGODB_URI=example_uri\nPORT=5000\nNODE_ENV=production\nFRONTEND_URL=http://localhost:3000";

if (fs.existsSync(envExamplePath)) {
  exampleContent = fs.readFileSync(envExamplePath, "utf-8");
}

// For team setup: use the shared Atlas URI
const sharedAtlasUri = "mongodb+srv://patelanusree03_db_user:dEjR.mi.j.PF96Y@wahap.zgnz6r6.mongodb.net/wahap?retryWrites=true&w=majority";

const envContent = `# Auto-generated from setup.js
# Team database: All team members share this MongoDB Atlas URI
MONGODB_URI=${sharedAtlasUri}
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
`;

// Write .env
fs.writeFileSync(envPath, envContent);
console.log("✅ Setup complete!");
console.log("✅ .env file created with the shared MongoDB Atlas URI");
console.log("✅ All team members will now see the same events data");
console.log("\nYou can now run: node index.js");
