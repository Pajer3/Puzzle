using SudokuSolverApi.Models;

namespace SudokuSolverApi.Services;

public class SudokuSolverService
{
    public bool SolveSudoku(Types puzzle)
    {
        return SolveRecursively(puzzle.Grid);
    }

    private bool SolveRecursively(int[][] grid)
    {
        for (int row = 0; row < 9; row++)
        {
            for (int col = 0; col < 9; col++)
            {
                if (grid[row][col] == 0)
                {
                    for (int num = 1; num <= 9; num++)
                    {
                        if (IsValid(grid, row, col, num))
                        {
                            grid[row][col] = num;

                            if (SolveRecursively(grid))
                            {
                                return true;
                            }
                            else
                            {
                                grid[row][col] = 0;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private bool IsValid(int[][] grid, int row, int col, int num)
    {
        // Check row
        for (int x = 0; x < 9; x++)
            if (grid[row][x] == num)
                return false;

        // Check column
        for (int x = 0; x < 9; x++)
            if (grid[x][col] == num)
                return false;

        // Check 3x3 box
        int startRow = row - row % 3;
        int startCol = col - col % 3;

        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                if (grid[i + startRow][j + startCol] == num)
                    return false;

        return true;
    }
}
