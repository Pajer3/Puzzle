using SudokuSolverApi.Types;
using SudokuSolverApi.Services;

namespace SudokuSolverApi.GraphQL
{
    public class Mutation
    {
        private readonly SudokuSolverService _solverService;

        public Mutation(SudokuSolverService solverService)
        {
            _solverService = solverService;
        }

        public SudokuPuzzle SolveSudoku(SudokuPuzzle puzzle)
        {
            if (!puzzle.IsValid())
            {
                throw new ArgumentException("Invalid Sudoku puzzle format.");
            }

            if (_solverService.SolveSudoku(puzzle))
            {
                return puzzle;
            }
            else
            {
                throw new Exception("The puzzle is unsolvable.");
            }
        }
    }
}
