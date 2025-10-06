"use client";

import { useCompletion } from "@ai-sdk/react";
import React, { FormEvent, useEffect } from "react";
import { useScore } from "./contexts/ScoreContext";

export default function CompletionStreamPage() {
  const { currentScore, totalQuestions, incrementScore, setCurrentScore, setTotalQuestions, levelSelected } = useScore();

  const {
    completion: generatedQuestionCompletion,
    setCompletion: setGeneratedQuestionCompletion,
    setInput: setInputGenerateQuestion,
    handleSubmit: handleSubmitGenerateQuestion,
    isLoading,
    error,
  } = useCompletion({
    api: "/api/generate-question",
    onFinish: (prompt, completion) => {
      console.log('Generated Question Completion:', completion);
      setGeneratedNewQuestion(completion);
    }
  });

  const {
    completion: reviewCompletion,    
    setCompletion: setReviewCompletion,
    setInput: setAnswerInput,
    handleInputChange: handleReviewAnswerInputChange,
    handleSubmit: handleSubmitReviewAnswer,
    isLoading: isLoadingReview,
    error: reviewError,
    stop: reviewStop,    
  } = useCompletion({
    api: "/api/review-answer",
    // onFinish: (completion) => { },
  }, );

  const [inputAnswerText, setInpuAnswerText] =  React.useState('');
  const [generatedNewQuestion, setGeneratedNewQuestion] =  React.useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] =  React.useState<boolean | null>(null);
  const [isStarted, setIsStarted] =  React.useState(false);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
 
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | HTMLInputElement;

    if (submitter.name === "generate") {
      console.log('generating question..'); 
      setReviewCompletion('');
      setIsStarted(true);
      setTotalQuestions(totalQuestions + 1);
      setAnswerInput('');
      setIsAnswerCorrect(null);
      setInpuAnswerText('');
      handleSubmitGenerateQuestion(event);
    } else {    
      handleSubmitReviewAnswer(event);
      setInpuAnswerText('');
    }  };

  const handleReset = () => {
    setCurrentScore(0);
    setTotalQuestions(0);
    setIsAnswerCorrect(null);
    setInpuAnswerText(''); 
    setReviewCompletion('');
    setGeneratedNewQuestion('');
     setGeneratedQuestionCompletion('');
  };

  const handleInputAswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInpuAnswerText(event.target.value);
    const reviewAnswer = generatedNewQuestion + " make a quick review my answer is " + event.target.value + ". And please indicate in last sentence if my answer is correct or incorrect.";
    setAnswerInput(reviewAnswer);
  }

  useEffect(() => {
    if (levelSelected === 1) {
      console.log('Level 1 selected');
      setInputGenerateQuestion('generate a single question for a Primary 5 student. The question should be straightforward and no introduction.');
    } else if (levelSelected === 2) {
      console.log('Level 2 selected');
      setInputGenerateQuestion('generate single math word problem suitable for a Primary 5 student. The question should be straightforward and no introduction.');
    } else if (levelSelected === 3) {
      console.log('Level 3 selected');
      setInputGenerateQuestion('generate single math word problem or general information quiz suitable for a Primary 5 student. The question should be straightforward and no introduction.'); // Please do not include my question in the generated question.
    }
    handleReset();
  },[levelSelected, setInputGenerateQuestion]);

  useEffect(() => {
    if (isLoadingReview === false && reviewCompletion) {
      const isCorrect = !reviewCompletion.toLowerCase().slice(-15).includes('incorrect');
      setIsAnswerCorrect(isCorrect);
      
      if (isCorrect) {
        incrementScore();
        console.log('Answer was correct! Score incremented.'); 
      }
    }
  }, [isLoadingReview]);

  useEffect(() => {
    if (totalQuestions === 0) {
      setIsStarted(false);
    } else if (totalQuestions == 1) {
      setIsStarted(true)
      setIsAnswerCorrect(null);
      setInpuAnswerText('');
    }
  }, [totalQuestions]);

  return (
    <div className="flex flex-col w-full max-w-lg py-8 mx-auto">
      {/* Score Management Controls */}
      {isStarted ? <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">            
            <span className="text-sm self-center">Quiz: {totalQuestions} </span>
          </div>
          <div>
            <span className="text-lg font-semibold">Score: {currentScore}</span>
          </div>
          <button
            onClick={handleReset}
            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
          >
            Reset Quiz
          </button>
        </div>
        {isAnswerCorrect !== null && (
          <div className={`text-center mt-2 font-medium ${isAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}>
            Your answer is {isAnswerCorrect ? 'CORRECT ✓' : 'INCORRECT ✗'}
          </div>
        )}
      </div> : <div className="mb-4 p-4 bg-gray-100 rounded-lg text-center">
        Click &quot;Start&quot; to begin the quiz!  
      </div>}
   
      <div className="flex flex-col w-full max-w-lg pt-8 pb-32 mx-auto stretch">
        {error && <div className="text-red-500 mb-4">{error.message}</div>}
        {reviewError && <div className="text-red-500 mb-4">{reviewError.message}</div>}


        {isLoading && !generatedQuestionCompletion && <div>Loading...</div>}
        {generatedQuestionCompletion && <div className="whitespace-pre-wrap">{generatedQuestionCompletion}</div>}

        {isLoadingReview && !reviewCompletion && <div>Reviewing...</div>}
        {reviewCompletion && <div className="whitespace-pre-wrap">{reviewCompletion}</div>}

        <form
          onSubmit={handleFormSubmit}
          className="fixed bg-white bottom-0 w-full max-w-lg mx-auto left-0 right-0 p-4  border-t border-gray-200  "
        >
          <div className="flex gap-2 items-start">
            <div className="flex flex-column items-center align-bottom">
              <button
                  type="submit"
                  name="generate"
                  className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isStarted ? 'Next' : 'Start'}
              </button>            
            </div>  
            <textarea
              className="flex-1 text-gray-800 p-2 border border-gray-300  rounded "
              value={inputAnswerText}
              onChange={e => handleInputAswerChange(e)}
              placeholder=""
              rows={3}
            />
            {isLoadingReview ? (
              <button
                onClick={reviewStop}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                name="send"
                className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoadingReview || !inputAnswerText.trim()}
              >
                Send
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}