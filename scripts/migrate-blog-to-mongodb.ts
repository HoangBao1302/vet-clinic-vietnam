/**
 * Script to migrate blog posts from blogPosts.ts file to MongoDB
 * 
 * Usage:
 * npx ts-node scripts/migrate-blog-to-mongodb.ts
 */

import mongoose from "mongoose";
import { allBlogPosts } from "../data/blogPosts";
import BlogPost from "../lib/models/BlogPost";
import { dbConnect } from "../lib/mongodb";

async function migrateBlogPosts() {
  try {
    console.log("🚀 Starting blog migration to MongoDB...\n");

    // Connect to MongoDB
    await dbConnect();
    console.log("✅ Connected to MongoDB\n");

    // Clear existing blog posts (optional - comment out if you want to keep existing data)
    const existingCount = await BlogPost.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing blog posts`);
      console.log("   Clearing existing posts...");
      await BlogPost.deleteMany({});
      console.log("✅ Cleared existing posts\n");
    }

    // Migrate each post
    let successCount = 0;
    let errorCount = 0;

    for (const post of allBlogPosts) {
      try {
        const newPost = new BlogPost({
          title: post.title,
          slug: post.id, // Use id as slug
          excerpt: post.excerpt,
          content: post.content || post.previewContent || post.excerpt,
          author: {
            id: "admin",
            name: post.author,
            email: "admin@thebenchmarktrader.com",
          },
          category: post.category,
          tags: post.tags || [],
          image: post.image,
          featured: post.featured || false,
          isPremium: post.isPremium || false,
          status: "published", // Set all migrated posts as published
          views: 0,
          readTime: post.readTime,
          publishedAt: new Date(post.date),
        });

        await newPost.save();
        successCount++;
        console.log(`✅ Migrated: ${post.title}`);
      } catch (error: any) {
        errorCount++;
        console.error(`❌ Error migrating "${post.title}":`, error.message);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 Migration Summary:");
    console.log("=".repeat(60));
    console.log(`✅ Successfully migrated: ${successCount} posts`);
    console.log(`❌ Failed: ${errorCount} posts`);
    console.log(`📝 Total processed: ${allBlogPosts.length} posts`);
    console.log("=".repeat(60) + "\n");

    // Verify migration
    const totalInDb = await BlogPost.countDocuments();
    console.log(`✅ Total posts in MongoDB: ${totalInDb}\n`);

    // Show category breakdown
    const categoryStats = await BlogPost.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    console.log("📂 Category Breakdown:");
    categoryStats.forEach((stat) => {
      const categoryNames: Record<string, string> = {
        news: "📰 Tin Tức",
        education: "🎓 Đào Tạo",
        "ea-leopard": "🤖 EA ThebenchmarkTrader",
      };
      console.log(`   ${categoryNames[stat._id] || stat._id}: ${stat.count} posts`);
    });

    console.log("\n✨ Migration completed successfully!");
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error.message);
    console.error(error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("\n👋 MongoDB connection closed");
    process.exit(0);
  }
}

// Run migration
migrateBlogPosts();

