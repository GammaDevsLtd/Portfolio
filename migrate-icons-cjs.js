const mongoose = require("mongoose");
const fs = require("fs");

// Load environment variables from .env or .env.local
const envFile = fs.existsSync(".env.local") ? ".env.local" : ".env";
if (fs.existsSync(envFile)) {
  const content = fs.readFileSync(envFile, "utf-8");
  content.split("\n").forEach((line) => {
    if (line && !line.startsWith("#")) {
      const [key, value] = line.split("=");
      if (key && value) {
        // Remove quotes from value if present
        let cleanValue = value.trim().replace(/^["']|["']$/g, "");
        process.env[key.trim()] = cleanValue;
      }
    }
  });
}

const techStackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    detailedDescription: String,
    category: [String],
    images: [String],
    backgroundImage: String,
    liveLink: String,
    githubLink: String,
    techStack: [techStackSchema],
    features: [String],
    challenges: [String],
    solutions: [String],
    status: String,
    timeline: String,
    teamSize: Number,
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model("ProjectModel", projectSchema);

async function migrateIcons() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get all projects
    const projects = await ProjectModel.find();
    console.log(`📦 Found ${projects.length} projects to migrate\n`);

    if (projects.length === 0) {
      console.log("⚠️ No projects found. Nothing to migrate.");
      await mongoose.disconnect();
      return;
    }

    let updatedCount = 0;

    // Migrate each project
    for (const project of projects) {
      let needsUpdate = false;

      // Check if any techStack item has 'value' instead of 'icon'
      if (project.techStack && project.techStack.length > 0) {
        project.techStack = project.techStack.map((stack) => {
          // If 'value' exists and 'icon' doesn't, rename it
          if (stack.value && !stack.icon) {
            console.log(
              `  📝 Migrating: "${stack.name}" (${stack.value} → icon)`
            );
            needsUpdate = true;
            return {
              name: stack.name,
              category: stack.category,
              icon: stack.value,
            };
          }
          // If already has 'icon', keep it
          return {
            name: stack.name,
            category: stack.category,
            icon: stack.icon,
          };
        });
      }

      // Save the updated project
      if (needsUpdate) {
        await project.save();
        updatedCount++;
        console.log(`✅ Updated project: "${project.title}"\n`);
      }
    }

    console.log(`\n🎉 Migration Complete!`);
    console.log(`📊 Summary: ${updatedCount} projects updated`);

    // Verify the migration
    const verifyProjects = await ProjectModel.find();
    let hasValue = 0;
    verifyProjects.forEach((project) => {
      if (project.techStack) {
        project.techStack.forEach((stack) => {
          if (stack.value) hasValue++;
        });
      }
    });

    if (hasValue === 0) {
      console.log(
        "✨ Verification: All 'value' fields have been successfully migrated to 'icon'"
      );
    } else {
      console.warn(`⚠️ Warning: Found ${hasValue} remaining 'value' fields`);
    }

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Migration Error:", error);
    process.exit(1);
  }
}

// Run migration
migrateIcons();
