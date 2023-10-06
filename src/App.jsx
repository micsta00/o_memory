import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import Tile from "./Tile";
import Stopwatch from "./Stopwatch";

export default function App() {
  const SIZE = 4;
  const [isEnd, setIsEnd] = useState(false);
  const [picked, setPicked] = useState([]);
  const [numOfFlipped, setNumOfFlipped] = useState(0);
  const [points, setPoints] = useState(0);

  //stopwatch
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);
  //end stopwatch
  useEffect(() => {
    setRunning(true);
  }, []);
  const [memoryBox, setMemoryBox] = useState(() => {
    const box = [];
    for (let i = 0; i < SIZE ** 2 / 2; i++) {
      for (let k = 0; k < 2; k++) {
        box.push({
          value: i,
          isFlipped: false,
          id: 0,
          havePare: false,
          isClickable: true
        });
      }
    }
    const shuffledBox = box.sort((a, b) => 0.5 - Math.random());

    return shuffledBox.map((item, ind) => {
      return { ...item, id: ind };
    });
  });

  const reveal = function (id) {
    setMemoryBox((prevMemBox) =>
      prevMemBox.map((tile) => {
        return tile.id === id
          ? { ...tile, isFlipped: !tile.isFlipped, isClickable: false }
          : tile;
      })
    );
  };

  const clearUnmatchTiles = function (id) {
    setMemoryBox((prevMemBox) =>
      prevMemBox.map((tile) => {
        return { ...tile, isFlipped: false, isClickable: true };
      })
    );
  };

  const assignPare = function (prevId, id) {
    setMemoryBox((prevMemBox) =>
      prevMemBox.map((tile) => {
        return tile.id === id || tile.id === prevId
          ? { ...tile, havePare: true, isClickable: false }
          : tile;
      })
    );
  };

  const counter = function (id, value) {
    if (numOfFlipped === 0) {
      clearUnmatchTiles();
      reveal(id);
      setNumOfFlipped(1);
      setPicked([{ value: value, id: id }]);
    } else if (numOfFlipped === 1) {
      reveal(id);
      if (picked.length === 1) {
        if (picked[0].value === value && picked[0].id != id) {
          assignPare(picked[0].id, id);
          setPoints((prevPoints) => prevPoints + 1);
        }
        setNumOfFlipped(0);
      }
      setNumOfFlipped(0);
    }
  };

  useEffect(() => {
    if (points === SIZE ** 2 / 2) {
      setRunning(false);
      setIsEnd(true);
    }
  }, [points]);

  return (
    <div className="App">
      <div className="numbers">
        <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
        <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
        <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
      </div>
      {isEnd ? (
        <h2>
          You won! Your time:{" "}
          <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
          <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
          <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
        </h2>
      ) : (
        <h2>Pairs:{points}</h2>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE},70px)` }}
      >
        {memoryBox.map((el, ind) => {
          return (
            <Tile
              key={ind}
              el={el.value}
              counter={counter}
              numOfFlipped={numOfFlipped}
              id={ind}
              isFlipped={el.isFlipped}
              havePare={el.havePare}
              isClickable={el.isClickable}
            />
          );
        })}
      </div>
    </div>
  );
}
