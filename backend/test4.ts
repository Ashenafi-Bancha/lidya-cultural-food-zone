import { createMenuItemSchema } from './src/utils/validators';

async function main() {
  const req = {
    body: {
      name: 'Kitfo',
      description: 'Minced prime beef seasoned with mitmita and niter kibbeh, served raw, medium, or well done with ayib and gomen.',
      price: '580 ETB',
      tag: 'Signature',
      categoryId: 'fd7b24d1-595b-4054-b9e7-1abaa7a290a8',
      isAvailable: true,
      imageUrl: '',
    },
    params: {
      id: 'menu-kitfo-seed',
    },
    query: {}
  };

  try {
    await createMenuItemSchema.parseAsync(req);
    console.log("Validation passed!");
  } catch (err: any) {
    console.error("Validation failed:", err.errors);
  }
}

main();
