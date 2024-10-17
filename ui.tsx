import React, { useState } from 'react';

export default function SudokuSolver() {
  const [sudokuGrid, setSudokuGrid] = useState<number[][]>(
    Array(9).fill(null).map(() => Array(9).fill(0))
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  const handleCellChange = (row: number, col: number, value: string) => {
    const newValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(newValue) || newValue < 0 || newValue > 9) return;

    const newGrid = sudokuGrid.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? newValue : c)) : r
    );
    setSudokuGrid(newGrid);
  };

  const handleSolveClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://localhost:5001/sudoku/solve', {
        mode: 'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ grid: sudokuGrid }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      setSudokuGrid(result.grid); // This line updates the grid with the solved puzzle
    } catch (err) {
      console.error('Error details:', err);
      setError(`Error solving Sudoku: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const handleJsonSubmit = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (Array.isArray(parsedJson) && parsedJson.length === 9 && parsedJson.every(row => Array.isArray(row) && row.length === 9)) {
        setSudokuGrid(parsedJson);
        setError(null);
      } else {
        throw new Error('Invalid JSON format. Please provide a 9x9 array.');
      }
    } catch (err) {
      setError(`Error parsing JSON: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sudoku Solver</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="grid grid-cols-9 gap-1 mb-6">
          {sudokuGrid.map((row, i) =>
            row.map((cell, j) => (
              <input
                key={`${i}-${j}`}
                type="text"
                value={cell === 0 ? '' : cell.toString()}
                onChange={(e) => handleCellChange(i, j, e.target.value)}
                className="w-8 h-8 text-center border border-gray-300 rounded p-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={1}
                readOnly={isLoading} // Disable input while solving
              />
            ))
          )}
        </div>
        <button
          onClick={handleSolveClick}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 disabled:opacity-50 mb-4"
        >
          {isLoading ? 'Solving...' : 'Solve'}
        </button>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Insert JSON</h2>
          <textarea
            value={jsonInput}
            onChange={handleJsonInputChange}
            className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder='Enter JSON here (e.g., [[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]])'
          />
          <button
            onClick={handleJsonSubmit}
            className="w-full mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
          >
            Submit JSON
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
