import React, { useState } from 'react';
import { WandSparkles, Send, GridIcon } from 'lucide-react';

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
            i === row ? r.map((c, j) =>
                (j === col ? newValue : c)) : r
        );
        setSudokuGrid(newGrid);
    };

    const handleSolveClick = async () => {
        setIsLoading(true);
        setError(null);

        const query = `
            mutation SolveSudoku($puzzle: SudokuPuzzleInput!) {
                solveSudoku(puzzle: $puzzle) {
                    grid
                }
            }
        `;

        try {
            const response = await fetch('https://localhost:5001/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        puzzle: { grid: sudokuGrid }
                    }
                }),
            });

            const result = await response.json();

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            setSudokuGrid(result.data.solveSudoku.grid);
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzIwMjAyMDEwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-50"></div>
            <div className="relative z-10 w-full max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 md:mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 tracking-wider backdrop-filter backdrop-blur-sm p-4 rounded-2xl">
                    <GridIcon className="inline-block mr-2 mb-1" />
                    Sudoku Solver
                </h1>
                <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl p-4 md:p-8 rounded-3xl shadow-2xl border border-white border-opacity-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-30 blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="grid grid-cols-9 gap-1 mb-6 md:mb-8">
                            {sudokuGrid.map((r, i) =>
                                r.map((c, j) => (
                                    <input
                                        key={`${i}-${j}`}
                                        type="text"
                                        value={c === 0 ? '' : c.toString()}
                                        onChange={(e) => handleCellChange(i, j, e.target.value)}
                                        className="w-8 h-8 md:w-10 md:h-10 text-center border border-white border-opacity-30 rounded-lg bg-white bg-opacity-10 text-white text-sm md:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-20 transition duration-300 ease-in-out transform hover:scale-105 backdrop-filter backdrop-blur-sm"
                                        maxLength={1}
                                        readOnly={isLoading}
                                    />
                                ))
                            )}
                        </div>
                        <button
                            onClick={handleSolveClick}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 mb-6 md:mb-8 shadow-lg backdrop-filter backdrop-blur-md relative overflow-hidden group"
                        >
                            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                            <span className="relative z-10 flex items-center justify-center">
                                <WandSparkles className="mr-2" />
                                {isLoading ? 'Solving...' : 'Solve'}
                            </span>
                        </button>
                        <div className="mb-6 md:mb-8">
                            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-white text-opacity-90 backdrop-filter backdrop-blur-sm p-2 rounded-lg">Insert JSON</h2>
                            <textarea
                                value={jsonInput}
                                onChange={handleJsonInputChange}
                                className="w-full h-32 md:h-40 p-4 border border-white border-opacity-30 rounded-xl bg-white bg-opacity-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-20 transition duration-300 ease-in-out resize-none shadow-inner backdrop-filter backdrop-blur-sm"
                                placeholder='[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]'
                            />
                            <button
                                onClick={handleJsonSubmit}
                                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-lg font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg backdrop-filter backdrop-blur-md relative overflow-hidden group"
                            >
                                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                <span className="relative z-10 flex items-center justify-center inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzIwMjAyMDEwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-50">
                                    <Send className="mr-2" />
                                    Submit JSON
                                </span>
                            </button>
                        </div>
                        {error && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500 opacity-20 blur-xl rounded-lg"></div>
                                <p className="relative z-10 text-red-100 mt-4 text-center bg-red-500 bg-opacity-30 p-3 rounded-lg backdrop-filter backdrop-blur-sm">{error}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
