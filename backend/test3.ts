import { prisma } from './src/database/prisma';

async function main() {
  try {
    const categories = await prisma.category.findMany();
    console.log("Categories:", categories);
    const menus = await prisma.menuItem.findMany();
    console.log("Menus:", menus);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
