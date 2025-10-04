import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: Request) {
  let prompt = '';
  let result: ReturnType<typeof streamText> | null = null;
  
  try {    
    const requestBody = await request.json();
    prompt = requestBody.prompt;
    // const prompt = "generate single plain math word problem suitable for a Primary 5 student";

    result = streamText({
      model: google('gemini-2.5-flash-lite'),
      prompt,
    });

    // console.log('StreamText result created for question generation:', result);
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in generate-question:', error);
    return new Response('Error processing request', { status: 500 });
  } finally {
    console.log('Final result object:', result);
  }
}
