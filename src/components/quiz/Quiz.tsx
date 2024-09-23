import React, { useRef, useState, MutableRefObject } from "react";
import './Quiz.css';
import {data} from '../../assets/data';

// Definisikan tipe untuk data question (asumsi struktur data)
interface Question {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  ans: number;
}

const Quiz: React.FC = () => {
  // State management
  let [index, setIndex] = useState<number>(0);
  let [question, setQuestion] = useState<Question>(data[index]); // Asumsi data diimport dari JSON yang sesuai dengan tipe `Question`
  let [lock, setLock] = useState<boolean>(false);
  let [score, setScore] = useState<number>(0);
  let [result, setResult] = useState<boolean>(false);

  // Refs untuk pilihan jawaban
  let Option1 = useRef<HTMLLIElement>(null);
  let Option2 = useRef<HTMLLIElement>(null);
  let Option3 = useRef<HTMLLIElement>(null);
  let Option4 = useRef<HTMLLIElement>(null);
  let option_array: MutableRefObject<HTMLLIElement | null>[] = [Option1, Option2, Option3, Option4];

  // Fungsi untuk memeriksa jawaban
  const checkAns = (e: React.MouseEvent<HTMLLIElement>, ans: number) => {
    if (!lock) {
      if (question.ans === ans) {
        e.currentTarget.classList.add("correct");
        setLock(true);
        setScore(prev => prev + 1);
      } else {
        e.currentTarget.classList.add("wrong");
        setLock(true);
        option_array[question.ans - 1]?.current?.classList.add("correct");
      }
    }
  };

  // Fungsi untuk melanjutkan ke pertanyaan berikutnya
  const next = () => {
    if (lock) {
      if (index === data.length - 1) {
        setResult(true);
        return;
      }
      const newIndex = index + 1;
      setIndex(newIndex);
      setQuestion(data[newIndex]);
      setLock(false);
      option_array.forEach(option => {
        option.current?.classList.remove("wrong");
        option.current?.classList.remove("correct");
      });
    }
  };

  // Fungsi untuk mereset quiz
  const reset = () => {
    setIndex(0);
    setQuestion(data[0]);
    setScore(0);
    setLock(false);
    setResult(false);
  };

  return (
    <div className='container'>
      <h1>Kuis 100 Famili</h1>
      <hr />
      {!result ? (
        <>
          <h2>{index + 1}.{question.question}</h2>
          <ul>
            <li ref={Option1} onClick={(e) => checkAns(e, 1)}>{question.option1}</li>
            <li ref={Option2} onClick={(e) => checkAns(e, 2)}>{question.option2}</li>
            <li ref={Option3} onClick={(e) => checkAns(e, 3)}>{question.option3}</li>
            <li ref={Option4} onClick={(e) => checkAns(e, 4)}>{question.option4}</li>
          </ul>
          <button onClick={next}>Selanjutnya</button>
          <div className="index">Pertanyaan {index + 1}/{data.length}</div>
        </>
      ) : (
        <>
          <h2>Jumlah Benar Adalah {score} dari {data.length}</h2>
          <button onClick={reset}>Reset</button>
        </>
      )}
    </div>
  );
};

export default Quiz;
