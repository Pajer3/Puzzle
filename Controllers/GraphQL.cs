using SudokuSolverApi.Models;
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

        public Types SolveSudoku(Types puzzle)
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
