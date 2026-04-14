import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MockAiService {
  private readonly logger = new Logger(MockAiService.name);

  /**
   * Simulates sending a receipt image to OpenAI's gpt-4o vision model
   * and receiving structured data back.
   * Enforces rules against handwritten receipts.
   */
  async extractReceiptData(imageBuffer: Buffer, mimetype: string) {
    this.logger.log(`Mock analyzing receipt image (${Math.round(imageBuffer.length / 1024)} KB)...`);

    // Simulate network delay for AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock validation logic based on strict rules:
    // Only digitally printed receipts from verifiable vendors
    // (We simulate a quick "check" by assuming all current test uploads are valid)

    // For a real implementation, the OpenAI prompt would be:
    /*
      "Analyze this receipt image. 
       1. If it is handwritten, return { valid: false, reason: 'Handwritten' }
       2. If it is not a receipt from a valid supermarket/vendor, return { valid: false, reason: 'Invalid vendor' }
       3. Otherwise, extract the storeName, date, totalAmount, and a list of items (name, quantity, unitPrice).
       Return strict JSON."
    */

    return {
      valid: true,
      storeName: 'Shoprite', // Simulating extracted store name
      date: new Date().toISOString(),
      totalAmount: 5000,
      confidence: 0.95,
      items: [
        {
          rawName: 'PEAK MILK PWD',
          quantity: 1,
          unitPrice: 5000,
        }
      ]
    };
  }

  /**
   * Simulates sending a handwritten or typed shopping list file to OpenAI's gpt-4o vision model
   * and receiving a structured array of requested items back.
   */
  async extractShoppingList(fileBuffer: Buffer, mimetype: string) {
    this.logger.log(`Mock analyzing unstructured shopping list (${Math.round(fileBuffer.length / 1024)} KB)...`);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate extracting a few common items found in our seed data
    return [
      { rawName: 'Golden Penny Spaghetti', quantity: 2, unit: '500g' },
      { rawName: 'Peak Milk', quantity: 1, unit: '900g' },
      { rawName: 'Dangote Sugar', quantity: 1, unit: '1kg' },
    ];
  }
}
