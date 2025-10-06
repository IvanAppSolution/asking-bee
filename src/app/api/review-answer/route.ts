import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: Request) {
  let prompt = '';
  let result: ReturnType<typeof streamText> | null = null;
  
  try {
    const requestBody = await request.json();
    prompt = requestBody.prompt;

    result = streamText({
      model: google('gemini-2.5-flash-lite'),
      prompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in review-answer:', error);
    return new Response('Error processing request', { status: 500 });
  } finally {
    // console.log('Final result object:', result);

  }
}
